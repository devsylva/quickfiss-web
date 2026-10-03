"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { PromoteServiceView } from "@/components/dashboard/PromoteServiceView";

export default function PromotePage() {
  return (
    <DashboardShell>
      <PromoteServiceView isStandalonePage />
    </DashboardShell>
  );
}
