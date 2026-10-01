"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchNormal1 } from "iconsax-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ProviderCard, type Provider } from "@/components/ui/ProviderCard";
import { categories as defaultCategories } from "@/lib/categories";
import { categoryIcons } from "@/lib/categoryIcons";
import { sampleProviders } from "@/lib/sampleProviders";
import { coreApi } from "@/lib/api";
import type { FeedItem, SearchArtisanItem } from "@/types/api";

const VISITED_KEY = "quickfiss_dashboard_visited";
const featuredProviders = Object.values(sampleProviders).flat();

function mapFeedItemToProvider(item: FeedItem): Provider {
  return {
    id: String(item.artisan_id || item.id),
    name: item.job_title || "Verified Artisan",
    tagline: item.description,
    priceFrom: item.price ? `₦${Number(item.price).toLocaleString()}` : "₦10,000",
    tags: item.tags ? item.tags.split(",").map((t) => t.trim()) : ["Artisan"],
    distance: item.distance ? `${item.distance}km away` : "Nearby",
    isOpen: item.availability_status ? item.availability_status.toLowerCase() === "open" : true,
    rating: item.rating || 5.0,
    reviewCount: item.likes || 12,
    image: item.image,
    description: item.description,
  };
}

function mapSearchItemToProvider(item: SearchArtisanItem): Provider {
  return {
    id: String(item.id),
    name: item.business_name || item.full_name || `${item.first_name || ""} ${item.last_name || ""}`.trim() || "Artisan",
    priceFrom: "₦10,000",
    tags: ["Verified Artisan"],
    distance: "Nearby",
    isOpen: true,
    rating: 4.8,
    reviewCount: 8,
    image: item.profile_picture,
  };
}

function DashboardHomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const address = searchParams.get("address") ?? undefined;

  const [isFirstVisit, setIsFirstVisit] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Provider[] | null>(null);
  const [feedProviders, setFeedProviders] = useState<Provider[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;
    const visited = localStorage.getItem(VISITED_KEY) === "1";
    setIsFirstVisit(!visited);
    if (!visited) localStorage.setItem(VISITED_KEY, "1");

    // Fetch personalized feed from API
    const loadData = async () => {
      setIsLoadingFeed(true);
      try {
        const feed = await coreApi.getFeed();
        if (Array.isArray(feed) && feed.length > 0) {
          setFeedProviders(feed.map(mapFeedItemToProvider));
        }
      } catch {
        // Fallback to sample providers gracefully if offline/unreachable
      } finally {
        setIsLoadingFeed(false);
      }
    };
    loadData();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const results = await coreApi.searchArtisans({ q: query });
      if (Array.isArray(results)) {
        setSearchResults(results.map(mapSearchItemToProvider));
      } else {
        setSearchResults([]);
      }
    } catch {
      // Local fallback search across sample providers
      const lower = query.toLowerCase();
      const filtered = featuredProviders.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.tags.some((t) => t.toLowerCase().includes(lower))
      );
      setSearchResults(filtered);
    } finally {
      setIsSearching(false);
    }
  };

  const goToCategory = (slug: string) =>
    router.push(`/dashboard/category/${slug}${address ? `?address=${encodeURIComponent(address)}` : ""}`);

  const activeProviders = searchResults !== null
    ? searchResults
    : (feedProviders.length > 0 ? feedProviders : featuredProviders);

  return (
    <DashboardShell address={address}>
      <div className="px-6 py-6 lg:px-10 lg:py-8 lg:max-w-6xl xl:max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">Hi {name || "there"} 👋</p>
            <h1 className="mt-1 text-2xl font-extrabold leading-tight text-foreground sm:text-3xl lg:text-4xl">
              What are you looking for today?
            </h1>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-white py-1.5 pl-4 pr-1.5 shadow-xs transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 max-w-xl lg:max-w-2xl"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search artisans, cleaners, plumbers, caterers..."
            className="flex-1 bg-transparent py-2 text-sm text-foreground placeholder-zinc-400 outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSearchResults(null);
              }}
              className="text-xs text-muted hover:text-foreground mr-1"
            >
              Clear
            </button>
          )}
          <button
            type="submit"
            disabled={isSearching}
            aria-label="Search"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-opacity hover:opacity-95 disabled:opacity-50"
          >
            <SearchNormal1 size={18} color="#ffffff" variant="Linear" />
          </button>
        </form>

        {/* First visit onboarding banner */}
        {isFirstVisit && (
          <div className="mt-6 rounded-2xl bg-primary p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
                Welcome to Quickfiss
              </span>
              <h3 className="mt-2 text-lg font-bold">Find trusted artisans for all your home and business tasks</h3>
              <p className="mt-1 text-xs text-white/80">
                Browse through verified categories below or search directly for your needs.
              </p>
            </div>
          </div>
        )}

        {/* Categories Strip */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground sm:text-lg">Explore Categories</h2>
            <span className="text-xs font-semibold text-primary">{defaultCategories.length} Services</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {defaultCategories.map((category) => {
              const Icon = categoryIcons[category.slug];
              return (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => goToCategory(category.slug)}
                  className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-border/80 bg-zinc-50/70 p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary-light/50 hover:shadow-xs"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary shadow-xs transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon size={20} color="currentColor" variant="Linear" />
                  </div>
                  <span className="text-xs font-medium text-foreground transition-colors group-hover:text-primary">
                    {category.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Providers Section */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground sm:text-lg">
              {searchResults !== null ? `Search Results (${searchResults.length})` : "Recommended for you"}
            </h2>
            <span className="text-xs font-medium text-muted">
              {isLoadingFeed ? "Loading..." : "Verified & highly rated"}
            </span>
          </div>

          {activeProviders.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">
              No artisans found matching &ldquo;{searchQuery}&rdquo;. Try another search keyword.
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
              {activeProviders.map((provider) => (
                <ProviderCard key={provider.id || provider.name} provider={provider} />
              ))}
            </div>
          )}
        </section>
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
