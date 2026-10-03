"use client";

import Link from "next/link";
import { Briefcase } from "iconsax-react";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function PromotePage() {
  return (
    <DashboardShell>
      <div className="mx-auto mt-16 flex max-w-md flex-col items-center px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dcfce7]">
          <Briefcase size={30} color="#16a34a" variant="Bold" />
        </div>
        <h1 className="mt-5 text-xl font-extrabold text-foreground">Promote your service is coming soon</h1>
        <p className="mt-2 text-sm text-muted">
          Soon you&apos;ll be able to boost your profile so more customers see it first. We&apos;ll let you know when it&apos;s ready.
        </p>
        <Link href="/dashboard" className="mt-6 text-sm font-semibold text-primary hover:underline">
          Back to dashboard
        </Link>
      </div>
    </DashboardShell>
  );
}
