"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Clock, CloseCircle, DocumentText } from "iconsax-react";
import { Button } from "@/components/ui/Button";
import { artisansApi } from "@/lib/api/artisans";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Everything on the provider side sits behind this. A provider can't work until they have been
 * approved, so until then they see where they are in the review instead of the dashboard.
 */
export function ProviderGate({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const setIsOnline = useAuthStore((s) => s.setIsOnline);
  const status = user?.provider_status;

  // Approval happens outside this browser, so always check the latest status on entry.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const fresh = await refreshUser();
      if (cancelled || fresh?.provider_status !== "approved") return;
      try {
        const profile = await artisansApi.me();
        if (!cancelled) setIsOnline(profile.is_online);
      } catch {
        // keep whatever the switch showed; it's only a display default
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [refreshUser, setIsOnline]);

  if (status === "approved") return <>{children}</>;

  const box = "mx-auto mt-16 flex max-w-md flex-col items-center px-6 text-center";

  if (status === "pending") {
    return (
      <div className={box}>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
          <Clock size={30} color="#b45309" variant="Bold" />
        </div>
        <h1 className="mt-5 text-xl font-extrabold text-foreground">Your profile is being reviewed</h1>
        <p className="mt-2 text-sm text-muted">
          We check every provider before they can take jobs. We&apos;ll email you as soon as you&apos;re approved.
          Until then you can keep using Quickfiss as a customer.
        </p>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className={box}>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <CloseCircle size={30} color="#dc2626" variant="Bold" />
        </div>
        <h1 className="mt-5 text-xl font-extrabold text-foreground">We couldn&apos;t approve your profile yet</h1>
        {user?.provider_rejection_reason && (
          <p className="mt-2 rounded-input bg-red-50 p-3 text-sm text-red-700">{user.provider_rejection_reason}</p>
        )}
        <p className="mt-3 text-sm text-muted">Update your details and send them again for another review.</p>
        <Link href="/provider-onboarding/step-1" className="mt-5 w-full">
          <Button type="button">Update my details</Button>
        </Link>
      </div>
    );
  }

  // draft / none: onboarding was started but never submitted
  return (
    <div className={box}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
        <DocumentText size={30} color="#3d5afe" variant="Bold" />
      </div>
      <h1 className="mt-5 text-xl font-extrabold text-foreground">Finish setting up your provider profile</h1>
      <p className="mt-2 text-sm text-muted">
        Complete your details so we can review them. You can start taking jobs once you&apos;re approved.
      </p>
      <Link href="/provider-onboarding/step-1" className="mt-5 w-full">
        <Button type="button">Continue setup</Button>
      </Link>
    </div>
  );
}
