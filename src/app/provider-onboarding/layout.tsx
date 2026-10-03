"use client";

import { useEffect, useState } from "react";
import { useProviderOnboardingStore } from "@/store/useProviderOnboardingStore";

// Steps read the saved answers when they mount, so wait for rehydration from
// IndexedDB before rendering any of them.
export default function ProviderOnboardingLayout({ children }: LayoutProps<"/provider-onboarding">) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve(useProviderOnboardingStore.persist.rehydrate()).finally(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return ready ? <>{children}</> : null;
}
