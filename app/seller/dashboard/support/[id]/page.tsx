"use client";

import { use } from "react";
import { mockSupportTickets } from "@/lib/mock/modules";
import { StatusBadge } from "@/components/seller/ui/StatusBadge";
import { formatRelative } from "@/lib/utils/formatters";
import Link from "next/link";

export default function SupportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = mockSupportTickets.find((x) => x.id === id);

  if (!t) return <p className="text-text-secondary">Ticket not found.</p>;

  return (
    <div className="max-w-3xl space-y-4">
      <Link href="/seller/dashboard/support" className="text-sm text-primary hover:underline">← Support</Link>
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold">{t.subject}</h1>
        <StatusBadge status={t.status.replace("_", " ")} />
      </div>
      <p className="font-mono text-xs text-text-muted">{t.ticket_number}</p>
      <div className="space-y-3">
        <div className="rounded-[8px] bg-surface p-4 text-sm">
          <p className="text-xs font-medium text-text-muted">Platform agent</p>
          <p className="mt-1">{t.message_preview}</p>
          <p className="mt-2 text-xs text-text-muted">{formatRelative(t.created_at)}</p>
        </div>
        <div className="rounded-[8px] bg-primary/8 p-4 text-sm ml-8">
          <p className="text-xs font-medium text-primary">You</p>
          <p className="mt-1 text-text-secondary">Reply thread — form stubbed for next phase.</p>
        </div>
      </div>
    </div>
  );
}
