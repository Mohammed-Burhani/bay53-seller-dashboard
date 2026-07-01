"use client";

import { cn } from "@/lib/utils/helpers";
import { Upload, X, FileText } from "lucide-react";
import { useState, useRef, forwardRef, useImperativeHandle } from "react";

interface FileUploadProps {
  label: string;
  error?: string;
  accept?: string;
  maxSizeMB?: number;
  onChange?: (fileUrl: string) => void;
  value?: string;
  helperText?: string;
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ label, error, accept = "image/*,.pdf", maxSizeMB = 5, onChange, value, helperText }, ref) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>(value ?? "");
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!);

    const handleFile = (selectedFile: File) => {
      if (selectedFile.size > maxSizeMB * 1024 * 1024) {
        alert(`File size must be less than ${maxSizeMB}MB`);
        return;
      }

      setFile(selectedFile);
      
      // Create preview for images
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setPreview(result);
          onChange?.(result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // For PDFs and other documents, just store the file name
        const mockUrl = `uploaded://${selectedFile.name}`;
        setPreview(mockUrl);
        onChange?.(mockUrl);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    };

    const handleRemove = () => {
      setFile(null);
      setPreview("");
      onChange?.("");
      if (inputRef.current) inputRef.current.value = "";
    };

    const isImage = preview && (preview.startsWith("data:image") || preview.startsWith("http"));
    const fileName = file?.name ?? preview.replace("uploaded://", "");

    return (
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-primary">{label}</label>
        
        {!preview ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-[6px] border-2 border-dashed border-border bg-surface px-6 py-8 transition-colors hover:border-primary/50 hover:bg-primary/5",
              isDragging && "border-primary bg-primary/10",
              error && "border-destructive",
            )}
          >
            <Upload className="mb-2 h-8 w-8 text-text-muted" />
            <p className="text-sm text-text-secondary">
              <span className="font-medium text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="mt-1 text-xs text-text-muted">
              {helperText ?? `Max ${maxSizeMB}MB`}
            </p>
          </div>
        ) : (
          <div className="relative rounded-[6px] border border-border bg-surface p-3">
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-sm hover:bg-destructive hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            
            {isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Preview" className="h-32 w-full rounded object-cover" />
            ) : (
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{fileName}</p>
                  <p className="text-xs text-text-muted">Document uploaded</p>
                </div>
              </div>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) handleFile(selectedFile);
          }}
          className="hidden"
        />
        
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  },
);
FileUpload.displayName = "FileUpload";
