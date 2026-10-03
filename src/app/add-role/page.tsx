"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/useAuthStore";

function AddRoleContent() {
  const router = useRouter();
  const role = useSearchParams().get("role") === "customer" ? "customer" : "provider";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isProvider = role === "provider";

  const start = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await authApi.setUserType({ user_type: isProvider ? "artisan" : "client" });
      await useAuthStore.getState().refreshUser();
      router.push(isProvider ? "/provider-onboarding/step-1" : "/customer-onboarding/step-1");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-white px-6 py-12">
      <div className="w-full lg:max-w-xl">
        <h1 className="text-2xl font-extrabold leading-snug text-primary sm:text-3xl">
          {isProvider ? "Offer your services on Quickfiss" : "Book services on Quickfiss"}
        </h1>
        <p className="mt-2 text-sm text-muted sm:text-base">
          {isProvider
            ? "You'll keep your customer account. Becoming a provider adds a second side you can switch to any time."
            : "You'll keep your provider account. Adding a customer side lets you book other providers."}
        </p>

        {isProvider && (
          <ol className="mt-6 flex flex-col gap-3 text-sm text-foreground">
            {[
              "Tell us about yourself, your ID and your business",
              "We review your details (usually within one business day)",
              "Once you're approved, you can accept jobs and get paid",
            ].map((step, i) => (
              <li key={step} className="flex items-start gap-3 rounded-input bg-zinc-50 p-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        )}

        {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-600">{error}</div>}

        <div className="mt-8 flex flex-col gap-3">
          <Button onClick={start} disabled={busy}>
            {busy ? "One moment..." : "Get started"}
          </Button>
          <Link href="/dashboard" className="text-center text-sm font-medium text-muted hover:text-foreground">
            Not now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AddRolePage() {
  return (
    <Suspense fallback={null}>
      <AddRoleContent />
    </Suspense>
  );
}
