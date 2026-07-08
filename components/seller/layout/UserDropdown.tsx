"use client";

import { useState, useRef, useEffect } from "react";
import { useCurrentUser, useLogout } from "@/lib/hooks/useAuth";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";

export function UserDropdown() {
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-surface transition-colors"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <User className="h-4 w-4" />
        </div>
        <span className="hidden md:inline text-text-primary">{user.email}</span>
        <ChevronDown className={`h-4 w-4 text-text-secondary transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card shadow-lg z-50">
          <div className="p-3 border-b border-border">
            <p className="text-sm font-medium text-text-primary">{user.email}</p>
            <p className="text-xs text-text-muted mt-0.5">Seller Account</p>
          </div>
          
          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to settings
              }}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-text-primary hover:bg-surface transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
            
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
