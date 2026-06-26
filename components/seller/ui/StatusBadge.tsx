import { Badge } from "./Badge";

const STATUS_MAP: Record<string, { label: string; variant: "default" | "primary" | "success" | "warning" | "destructive" }> = {
  new: { label: "New", variant: "warning" },
  pending: { label: "Pending", variant: "warning" },
  processing: { label: "Processing", variant: "warning" },
  confirmed: { label: "Confirmed", variant: "primary" },
  packed: { label: "Packed", variant: "primary" },
  shipped: { label: "Shipped", variant: "primary" },
  delivered: { label: "Delivered", variant: "success" },
  published: { label: "Published", variant: "success" },
  draft: { label: "Draft", variant: "default" },
  archived: { label: "Archived", variant: "default" },
  pending_review: { label: "Pending Review", variant: "warning" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  returned: { label: "Returned", variant: "destructive" },
  active: { label: "Active", variant: "success" },
  scheduled: { label: "Scheduled", variant: "primary" },
  expired: { label: "Expired", variant: "default" },
  requested: { label: "Requested", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "destructive" },
  open: { label: "Open", variant: "warning" },
  resolved: { label: "Resolved", variant: "success" },
  closed: { label: "Closed", variant: "default" },
  quoted: { label: "Quoted", variant: "primary" },
  negotiating: { label: "Negotiating", variant: "warning" },
  paid: { label: "Paid", variant: "success" },
  failed: { label: "Failed", variant: "destructive" },
  pending_label: { label: "Pending label", variant: "warning" },
  in_transit: { label: "In transit", variant: "primary" },
  out_for_delivery: { label: "Out for delivery", variant: "primary" },
  awaiting_seller: { label: "Awaiting reply", variant: "warning" },
  in_progress: { label: "In progress", variant: "primary" },
  completed: { label: "Completed", variant: "success" },
  under_review: { label: "Under review", variant: "warning" },
};

export function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase().replace(/\s+/g, "_");
  const config = STATUS_MAP[key] ?? { label: status, variant: "default" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
