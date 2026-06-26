"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/helpers";
import type { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
  collapsed?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ href, icon: Icon, label, badge, collapsed, onClick }: SidebarItemProps) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-2 rounded-[6px] px-3 py-2 text-sm transition-colors",
        active
          ? "bg-primary/8 text-sidebar-text-active before:absolute before:left-0 before:top-1 before:bottom-1 before:w-0.5 before:rounded-full before:bg-primary"
          : "text-text-secondary hover:bg-gray-50 hover:text-text-primary",
        collapsed && "justify-center px-2",
      )}
      title={collapsed ? label : undefined}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {badge !== undefined && badge > 0 && (
            <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-white">
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}
