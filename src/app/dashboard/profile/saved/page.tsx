"use client";

import { useEffect, useState } from "react";
import { ProfileFrame } from "@/components/profile/ProfileFrame";
import { ProviderCard, type Provider } from "@/components/ui/ProviderCard";
import { artisansApi } from "@/lib/api/artisans";
import { summaryToProvider } from "@/lib/artisanMapper";
import { useAuthStore } from "@/store/useAuthStore";

import Link from "next/link";
import { Heart } from "iconsax-react";
import { Button } from "@/components/ui/Button";

export default function SavedProvidersPage() {
  const initAuth = useAuthStore((s) => s.initAuth);
  const [providers, setProviders] = useState<Provider[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    let cancelled = false;
    artisansApi
      .saved()
      .then(({ data }) => {
        if (!cancelled) setProviders(data.map(summaryToProvider));
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "We couldn't load your saved providers.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ProfileFrame
      title="Saved Artisans"
      subtitle="Quick access to service providers and artisans you have bookmarked"
      maxWidth="max-w-md md:max-w-4xl lg:max-w-6xl"
    >
      <div className="mt-2">
        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>
        ) : providers === null ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-3 text-xs sm:text-sm">Loading your saved providers...</p>
          </div>
        ) : providers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-zinc-50/60 p-10 text-center sm:py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-4">
              <Heart size={32} color="#e11d48" variant="Bold" />
            </div>
            <h3 className="text-base font-extrabold text-foreground sm:text-lg">No saved artisans yet</h3>
            <p className="mt-1 text-xs sm:text-sm text-muted max-w-sm">
              Tap the heart icon on any provider profile or search result to save them here for quick booking.
            </p>
            <div className="mt-6">
              <Link href="/dashboard">
                <Button className="!w-auto !px-6 text-xs font-semibold">Explore Providers</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p className="mb-4 text-xs font-semibold text-muted">
              {providers.length} saved provider{providers.length === 1 ? "" : "s"}
            </p>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {providers.map((p) => (
                <ProviderCard key={p.id} provider={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </ProfileFrame>
  );
}
