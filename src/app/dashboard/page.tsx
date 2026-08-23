"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Home2, Truck, Cake, Monitor, Car, Trash, Brush, SearchNormal1 } from "iconsax-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ProviderCard } from "@/components/ui/ProviderCard";
import { categories } from "@/lib/categories";
import { sampleProviders } from "@/lib/sampleProviders";

const categoryIcons: Record<string, typeof Home2> = {
  "home-services": Home2,
  logistics: Truck,
  "food-catering": Cake,
  "tech-electronics": Monitor,
  automotive: Car,
  "cleaning-waste": Trash,
  "personal-care": Brush,
};

const VISITED_KEY = "quickfiss_dashboard_visited";
const featuredProviders = Object.values(sampleProviders).flat();

function DashboardHomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const address = searchParams.get("address") ?? undefined;

  // The category picker only makes sense before we know anything about the
  // user's interests — from the second visit on, show a service feed instead.
  const [isFirstVisit, setIsFirstVisit] = useState<boolean | null>(null);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Guards against React StrictMode's dev-only double-invoke: without this,
    // the second run would read the flag the first run just wrote.
    if (hasChecked.current) return;
    hasChecked.current = true;
    const visited = localStorage.getItem(VISITED_KEY) === "1";
    setIsFirstVisit(!visited);
    if (!visited) localStorage.setItem(VISITED_KEY, "1");
  }, []);

  const goToCategory = (slug: string) =>
    router.push(`/dashboard/category/${slug}${address ? `?address=${encodeURIComponent(address)}` : ""}`);

  return (
    <DashboardShell address={address}>
      <div className="px-6 py-6 lg:max-w-4xl lg:py-10">
        <p className="text-base text-foreground">Hi {name || "there"} 👋</p>
        <h1 className="mt-1 text-3xl font-extrabold leading-tight text-foreground lg:text-4xl">
          What you are looking for today
        </h1>

        <div className="mt-6 flex items-center gap-3 rounded-input border border-border bg-white py-1 pl-4 pr-1.5 lg:max-w-xl">
          <input
            type="text"
            placeholder="Search what you need..."
            className="flex-1 bg-transparent py-2.5 text-sm text-foreground placeholder-zinc-400 outline-none"
          />
          <button
            type="button"
            aria-label="Search"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-input bg-primary"
          >
            <SearchNormal1 size={18} color="#ffffff" variant="Linear" />
          </button>
        </div>

        {isFirstVisit === null ? null : isFirstVisit ? (
          <>
            <p className="mt-8 text-sm font-semibold text-foreground">Categories</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {categories.map((category) => {
                const Icon = categoryIcons[category.slug];
                return (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() => goToCategory(category.slug)}
                    className="flex items-center gap-2 rounded-input bg-primary-light px-4 py-3 text-sm font-medium text-primary hover:bg-primary-light/70"
                  >
                    <Icon size={20} color="#3d5afe" variant="Linear" />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <p className="mt-8 text-sm font-semibold text-foreground">Recommended for you</p>
            <div className="mt-3 flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-8">
              {featuredProviders.map((provider) => (
                <ProviderCard key={provider.name} provider={provider} />
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}

export default function DashboardHomePage() {
  return (
    <Suspense fallback={null}>
      <DashboardHomeContent />
    </Suspense>
  );
}
