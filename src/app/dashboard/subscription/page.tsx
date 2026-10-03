"use client";

import { Suspense } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SubscriptionPlanView } from "@/components/subscription/SubscriptionPlanView";

export default function SubscriptionPage() {
  return (
    <DashboardShell>
      <div className="flex h-full w-full flex-col overflow-y-auto bg-white py-4 sm:py-6">
        <Suspense fallback={null}>
          <SubscriptionPlanView showSkip={true} />
        </Suspense>
      </div>
    </DashboardShell>
  );
}
