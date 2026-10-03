"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeftIcon } from "@/components/icons";
import { Location } from "iconsax-react";
import { Chip } from "@/components/ui/Chip";
import { ProviderCard, type Provider } from "@/components/ui/ProviderCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { categories } from "@/lib/categories";
import { artisansApi } from "@/lib/api/artisans";
import { summaryToProvider } from "@/lib/artisanMapper";

type Filter = "available" | "top-rated" | "book-only";

const filters: { value: Filter; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "top-rated", label: "Top rated" },
  { value: "book-only", label: "Book only" },
];

function CategoryContent({ slug }: { slug: string }) {
  const router = useRouter();
  const address = useSearchParams().get("address");
  const [filter, setFilter] = useState<Filter>("available");
  const [sourceList, setSourceList] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const category = categories.find((c) => c.slug === slug);
  const title = category?.label ?? slug;

  useEffect(() => {
    let cancelled = false;
    async function fetchCategoryArtisans() {
      try {
        const results = await artisansApi.list({ category: title });
        if (cancelled) return;
        setSourceList(Array.isArray(results) ? results.map(summaryToProvider) : []);
        setLoadError(null);
      } catch (err: unknown) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "We couldn't load providers.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetchCategoryArtisans();
    return () => {
      cancelled = true;
    };
  }, [title, reloadKey]);

  const retry = () => {
    setIsLoading(true);
    setLoadError(null);
    setReloadKey((k) => k + 1);
  };

  let providers = sourceList;
  if (filter === "top-rated") {
    providers = sourceList.filter((p) => p.rating >= 4.5);
  } else if (filter === "book-only") {
    providers = sourceList.filter((p) => p.isOpen);
  }

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4 lg:px-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-muted transition-colors hover:bg-zinc-100 hover:text-foreground"
          >
            <ChevronLeftIcon />
            <span className="hidden sm:inline">Back</span>
          </button>
          <span className="text-zinc-300">/</span>
          <h1 className="text-base font-bold text-foreground sm:text-lg">{title}</h1>
        </div>
        {address && (
          <span className="flex max-w-[200px] items-center gap-1.5 truncate text-xs font-medium text-foreground bg-zinc-50 border border-border px-2.5 py-1 rounded-full">
            <Location size={16} color="#3d5afe" variant="Bold" />
            <span className="truncate">{address}</span>
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-10 lg:py-8 lg:max-w-6xl xl:max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {filters.map((f) => (
              <Chip key={f.value} selected={filter === f.value} onClick={() => setFilter(f.value)}>
                {f.label}
              </Chip>
            ))}
          </div>
          <p className="text-xs text-muted">
            {isLoading ? "Loading providers..." : `Showing ${providers.length} provider${providers.length === 1 ? "" : "s"}`}
          </p>
        </div>

        {loadError ? (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {loadError}{" "}
            <button type="button" onClick={retry} className="font-semibold underline">
              Try again
            </button>
          </div>
        ) : providers.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              message={
                isLoading
                  ? "Loading providers..."
                  : sourceList.length > 0
                    ? "No providers match this filter."
                    : "No providers in this category yet."
              }
            />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CategoryPageContent({ slug }: { slug: string }) {
  return (
    <Suspense fallback={null}>
      <CategoryContent slug={slug} />
    </Suspense>
  );
}
