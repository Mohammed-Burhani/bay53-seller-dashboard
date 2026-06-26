import { Suspense } from "react";
import { DashboardLayoutClient } from "./DashboardLayoutClient";

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
    </Suspense>
  );
}
