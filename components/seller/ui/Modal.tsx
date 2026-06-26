"use client";

import { cn } from "@/lib/utils/helpers";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "max-w-[560px]",
  md: "max-w-[640px]",
  lg: "max-w-[720px]",
};

export function Modal({ open, onClose, title, children, size = "sm", className }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        "fixed inset-0 z-50 m-auto w-full rounded-[8px] border border-border bg-card p-0 shadow-lg backdrop:bg-black/40 max-h-[90vh] overflow-hidden",
        sizes[size],
        "max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:top-auto max-md:max-h-[85vh] max-md:rounded-b-none max-md:rounded-t-[12px]",
        className,
      )}
      onClose={onClose}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        {title && <h2 className="text-sm font-semibold text-text-primary">{title}</h2>}
        <button
          type="button"
          onClick={onClose}
          className="rounded-[6px] p-1 text-text-secondary hover:bg-surface"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4 overflow-y-auto">{children}</div>
    </dialog>
  );
}
