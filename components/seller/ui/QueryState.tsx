"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "./Button";
import { Skeleton } from "./Skeleton";

export function QueryError({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <p className="mt-2 text-sm font-medium text-text-primary">Something went wrong</p>
      <p className="text-sm text-text-secondary">{message ?? "We couldn&apos;t load this data."}</p>
      {onRetry && <Button className="mt-3" variant="secondary" size="sm" onClick={onRetry}>Try again</Button>}
    </div>
  );
}

export function QueryLoading({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
