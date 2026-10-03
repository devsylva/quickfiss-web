"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft2 } from "iconsax-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Chip } from "@/components/ui/Chip";
import { artisansApi } from "@/lib/api/artisans";
import { coreApi } from "@/lib/api/core";
import { onboardingApi } from "@/lib/api/onboarding";
import { useAuthStore } from "@/store/useAuthStore";
import type { ApiCategory, ApiService } from "@/types/api";

const LANGUAGES = ["English", "Pidgin", "Igbo", "Hausa", "Yoruba"];
const YEARS = Array.from({ length: 10 }, (_, i) => String(i + 1));
const SLOTS = [
  { value: "MORNING", label: "Morning" },
  { value: "AFTERNOON", label: "Afternoon" },
  { value: "NIGHT", label: "Evening" },
];

export default function BusinessProfilePage() {
  const initAuth = useAuthStore((s) => s.initAuth);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [allServices, setAllServices] = useState<ApiService[]>([]);

  const [businessName, setBusinessName] = useState("");
  const [bio, setBio] = useState("");
  const [about, setAbout] = useState("");
  const [experience, setExperience] = useState("");
  const [language, setLanguage] = useState("English");
  const [services, setServices] = useState<Set<string>>(new Set());
  const [slots, setSlots] = useState<Set<string>>(new Set());
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [profile, cats, svcs] = await Promise.all([
          artisansApi.me(),
          coreApi.getCategories(),
          coreApi.getServices(),
        ]);
        if (cancelled) return;
        setCategories(cats);
        setAllServices(svcs);
        setBusinessName(profile.business_name ?? "");
        setBio(profile.bio ?? "");
        setAbout(profile.business_about ?? "");
        setExperience(profile.experience ?? "");
        setLanguage(profile.language || "English");
        setServices(new Set(profile.services ?? []));
        setSlots(new Set((profile.availability_data ?? []).map((a) => a.name)));
        setMinPrice(profile.min_price ? String(Math.round(Number(profile.min_price))) : "");
        setMaxPrice(profile.max_price ? String(Math.round(Number(profile.max_price))) : "");
        setLocation(profile.location ?? "");
      } catch (err: unknown) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "We couldn't load your business profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = (set: Set<string>, setter: (s: Set<string>) => void, value: string) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
    setSaved(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaveError(null);
    if (!businessName.trim()) return setSaveError("Enter your business name.");
    if (services.size === 0) return setSaveError("Choose at least one service you offer.");
    if (slots.size === 0) return setSaveError("Choose when you're available.");
    const min = Number(minPrice || 0);
    const max = Number(maxPrice || 0);
    if (max && min > max) return setSaveError("Your starting price can't be higher than your top price.");

    setSaving(true);
    try {
      await onboardingApi.submitArtisanCustomization({
        business_name: businessName.trim(),
        bio: bio.trim(),
        business_about: about.trim(),
        experience,
        language,
        services: [...services],
        availability: [...slots],
        location: location.trim(),
        min_price: min,
        max_price: max,
      });
      setSaved(true);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "We couldn't save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const select =
    "w-full rounded-input border border-border bg-white px-3.5 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

  return (
    <DashboardShell>
      <div className="mx-auto w-full max-w-md sm:max-w-2xl lg:max-w-4xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <Link
          href="/dashboard/profile"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft2 size={16} color="currentColor" variant="Linear" />
          <span>Back to Profile</span>
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Business profile</h1>
        <p className="mt-1 text-xs sm:text-sm text-muted">What customers see when they browse and book your services.</p>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-3 text-xs sm:text-sm">Loading your business profile...</p>
          </div>
        ) : loadError ? (
          <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError}</p>
        ) : (
          <div className="mt-6 rounded-3xl border-0 sm:border sm:border-border/80 bg-white sm:p-8 sm:shadow-xs">
            <form onSubmit={save} className="flex flex-col gap-6">
            <Input label="Business name" value={businessName} maxLength={100} onChange={(e) => { setBusinessName(e.target.value); setSaved(false); }} />
            <Textarea label="Short bio" value={bio} onChange={(e) => { setBio(e.target.value); setSaved(false); }} />
            <Textarea label="About your business" value={about} onChange={(e) => { setAbout(e.target.value); setSaved(false); }} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="biz-years" className="mb-2 block text-sm font-semibold text-foreground">Years of experience</label>
                <select id="biz-years" className={select} value={experience} onChange={(e) => { setExperience(e.target.value); setSaved(false); }}>
                  <option value="">Select</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y === "10" ? "10+ years" : `${y} year${y === "1" ? "" : "s"}`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="biz-lang" className="mb-2 block text-sm font-semibold text-foreground">Main language</label>
                <select id="biz-lang" className={select} value={language} onChange={(e) => { setLanguage(e.target.value); setSaved(false); }}>
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">Services you offer</p>
              <div className="flex flex-col gap-4">
                {categories.map((category) => {
                  const list = allServices.filter((s) => String(s.category) === String(category.id));
                  if (list.length === 0) return null;
                  return (
                    <div key={category.id}>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">{category.name}</p>
                      <div className="flex flex-wrap gap-2">
                        {list.map((service) => (
                          <Chip key={service.name} selected={services.has(service.name)} onClick={() => toggle(services, setServices, service.name)}>
                            {service.name}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">When you&apos;re available</p>
              <div className="flex flex-wrap gap-2">
                {SLOTS.map((slot) => (
                  <Chip key={slot.value} selected={slots.has(slot.value)} onClick={() => toggle(slots, setSlots, slot.value)}>
                    {slot.label}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Starting price (₦)" inputMode="numeric" value={minPrice} onChange={(e) => { setMinPrice(e.target.value.replace(/\D/g, "")); setSaved(false); }} />
              <Input label="Top price (₦)" inputMode="numeric" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value.replace(/\D/g, "")); setSaved(false); }} />
            </div>

            <Input label="Service address" maxLength={100} value={location} onChange={(e) => { setLocation(e.target.value); setSaved(false); }} />

            {saveError && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">{saveError}</p>}
            {saved && <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-700">Saved. Your changes are live.</p>}

            <Button type="submit" isLoading={saving}>Save changes</Button>
          </form>
        </div>
        )}
      </div>
    </DashboardShell>
  );
}
