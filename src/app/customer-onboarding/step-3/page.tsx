"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Profile, Location, CloseCircle } from "iconsax-react";
import { ChevronLeftIcon } from "@/components/icons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

function LocationPin() {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
        <Location size={22} color="#3d5afe" variant="Bold" />
      </div>
    </div>
  );
}

function CustomerOnboardingStep3Content() {
  const router = useRouter();
  const name = useSearchParams().get("name") ?? "";
  const [address, setAddress] = useState("");
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);

  const handleEnableLocation = () => {
    setShowLocationPrompt(false);
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      // Permission only — no reverse-geocoding API wired up yet, so the
      // address field still needs to be filled in manually below.
      navigator.geolocation.getCurrentPosition(
        () => {},
        () => {},
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim() === "") return;
    // TODO: wire up to the real customer-onboarding API once available.
    const params = new URLSearchParams({ address });
    if (name) params.set("name", name);
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-white">
      <div className="flex items-center gap-3 border-b border-border px-4 py-4">
        <button type="button" onClick={() => router.back()} aria-label="Go back" className="text-foreground">
          <ChevronLeftIcon />
        </button>
        <h1 className="text-base font-semibold text-foreground">Your Location</h1>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Static placeholder — swap for a real map SDK (Google Maps/Mapbox) once wired up. */}
        <div className="relative flex-1 bg-[repeating-linear-gradient(45deg,#eef0fb,#eef0fb_10px,#e6e9fa_10px,#e6e9fa_20px)]">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%+8px)]">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-primary shadow-lg">
              <Profile size={20} color="#ffffff" variant="Bold" />
            </div>
            <div className="mx-auto -mt-1 h-3 w-3 rotate-45 bg-primary" />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-t-card border-t border-border bg-white px-6 pb-8 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] lg:flex lg:w-[420px] lg:shrink-0 lg:flex-col lg:justify-center lg:rounded-none lg:border-l lg:border-t-0 lg:px-10 lg:py-0 lg:shadow-none"
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-zinc-200 lg:hidden" />
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Location Details</h2>
            <button type="button" onClick={() => router.back()} aria-label="Close">
              <CloseCircle size={22} color="#a1a1aa" variant="Linear" />
            </button>
          </div>

          <div className="mt-4">
            <Input
              label="Address"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              icon={<Location size={18} color="#3d5afe" variant="Bold" />}
              iconPosition="right"
            />
          </div>

          <div className="mt-6">
            <Button type="submit" disabled={address.trim() === ""}>
              Continue
            </Button>
          </div>
        </form>
      </div>

      <Modal open={showLocationPrompt}>
        <div className="mx-auto">
          <LocationPin />
        </div>
        <h2 className="mt-5 text-xl font-extrabold text-primary">Enable Location</h2>
        <p className="mt-2 text-sm text-muted">
          We need access to your location to find service providers around you.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button onClick={handleEnableLocation}>Enable Location</Button>
          <Button variant="secondary" onClick={() => setShowLocationPrompt(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default function CustomerOnboardingStep3Page() {
  return (
    <Suspense fallback={null}>
      <CustomerOnboardingStep3Content />
    </Suspense>
  );
}
