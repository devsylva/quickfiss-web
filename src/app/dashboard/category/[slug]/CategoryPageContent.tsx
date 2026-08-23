"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeftIcon } from "@/components/icons";
import { Location } from "iconsax-react";
import { Chip } from "@/components/ui/Chip";
import { ProviderCard } from "@/components/ui/ProviderCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { categories } from "@/lib/categories";
import { sampleProviders } from "@/lib/sampleProviders";

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

  const category = categories.find((c) => c.slug === slug);
  const title = category?.label ?? slug;
  const providers = filter === "available" ? (sampleProviders[slug] ?? []) : [];

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4 lg:px-8">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => router.back()} aria-label="Go back" className="text-foreground">
            <ChevronLeftIcon />
          </button>
          <h1 className="text-base font-semibold text-foreground">{title}</h1>
        </div>
        {address && (
          <span className="flex max-w-[160px] items-center gap-1 truncate text-xs font-medium text-foreground">
            <Location size={16} color="#3d5afe" variant="Bold" />
            <span className="truncate">{address}</span>
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 lg:max-w-4xl lg:px-8 lg:py-8">
        <div className="flex gap-2">
          {filters.map((f) => (
            <Chip key={f.value} selected={filter === f.value} onClick={() => setFilter(f.value)}>
              {f.label}
            </Chip>
          ))}
        </div>

        {providers.length === 0 ? (
          <EmptyState message="No Available service was found!" />
        ) : (
          <div className="mt-5 flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-8">
            {providers.map((provider) => (
              <ProviderCard key={provider.name} provider={provider} />
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
