"use client";

import { useEffect, useState } from "react";
import { Bell, Menu, PanelLeftClose, PanelLeft, Search } from "lucide-react";
import { Breadcrumb } from "../ui/Breadcrumb";
import { useBadgeCounts } from "@/lib/queries/useDashboard";
import { GlobalSearch } from "./GlobalSearch";

interface HeaderProps {
  breadcrumbs: { label: string; href?: string }[];
  onMenuClick?: () => void;
  onToggleCollapse?: () => void;
  collapsed?: boolean;
}

export function Header({ breadcrumbs, onMenuClick, onToggleCollapse, collapsed }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: badges } = useBadgeCounts();

  useEffectCmdK(() => setSearchOpen(true));

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card px-4">
        <button
          type="button"
          className="rounded-[6px] p-2 text-text-secondary hover:bg-surface lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        {onToggleCollapse && (
          <button
            type="button"
            className="hidden rounded-[6px] p-2 text-text-secondary hover:bg-surface lg:block"
            onClick={onToggleCollapse}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </button>
        )}
        <div className="hidden min-w-0 sm:block">
          <Breadcrumb items={breadcrumbs} />
        </div>
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="mx-auto flex h-9 max-w-md flex-1 items-center gap-2 rounded-[6px] border border-border bg-surface px-3 text-sm text-text-muted hover:border-primary/30"
        >
          <Search className="h-4 w-4" />
          <span>Search products, orders...</span>
          <kbd className="ml-auto hidden rounded border border-border bg-card px-1.5 text-[10px] sm:inline">
            ⌘K
          </kbd>
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative rounded-[6px] p-2 text-text-secondary hover:bg-surface"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {badges && badges.unreadNotifications > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
                {badges.unreadNotifications}
              </span>
            )}
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
            S
          </div>
        </div>
      </header>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function useEffectCmdK(onOpen: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpen();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpen]);
}
