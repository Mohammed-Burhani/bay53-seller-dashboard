interface SidebarSectionProps {
  title: string;
  collapsed?: boolean;
  children: React.ReactNode;
}

export function SidebarSection({ title, collapsed, children }: SidebarSectionProps) {
  if (collapsed) return <div className="space-y-0.5 py-1">{children}</div>;
  return (
    <div className="py-2">
      <p className="mb-1 px-3 text-[10px] font-medium uppercase tracking-wider text-text-muted">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
