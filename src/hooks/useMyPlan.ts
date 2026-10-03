"use client";

import { useEffect, useState } from "react";
import { billingsApi } from "@/lib/api/billings";

/** The signed-in provider's current plan name ("Free", "Standard" or "Premium"). */
export function useMyPlan(enabled = true) {
  const [plan, setPlan] = useState<"free" | "standard" | "premium">("free");

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    billingsApi
      .getSubscription()
      .then((s) => {
        if (!cancelled) setPlan(s.plan);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { plan, label: plan.charAt(0).toUpperCase() + plan.slice(1), isFree: plan === "free" };
}
