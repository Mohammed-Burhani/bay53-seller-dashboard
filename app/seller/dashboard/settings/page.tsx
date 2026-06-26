"use client";

import Link from "next/link";
import { useSettingsSections } from "@/lib/queries/useModules";
import { QueryError, QueryLoading } from "@/components/seller/ui/QueryState";
import { cn } from "@/lib/utils/helpers";
import { Check, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  const { data, isLoading, isError, refetch } = useSettingsSections();

  const completed = data?.filter((s) => s.complete).length ?? 0;
  const total = data?.length ?? 0;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary">
          Account setup · {completed}/{total} sections complete
        </p>
        <div className="mt-3 h-2 max-w-md overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-success transition-all" style={{ width: `${(completed / total) * 100}%` }} />
        </div>
      </div>

      {isLoading && <QueryLoading />}
      {isError && <QueryError onRetry={() => refetch()} />}

      {data && (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.map((section) => (
            <Link
              key={section.id}
              href={section.href}
              className="group flex items-center gap-4 rounded-[8px] border border-border bg-card p-4 hover:border-primary/40 hover:bg-surface"
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  section.complete ? "bg-success/12 text-success" : "bg-gray-100 text-text-muted",
                )}
              >
                {section.complete ? <Check className="h-5 w-5" /> : <span className="text-sm font-bold">!</span>}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-text-primary">{section.label}</p>
                <p className="text-sm text-text-secondary">{section.desc}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-text-muted group-hover:text-primary" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
