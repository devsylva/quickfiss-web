"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Location } from "iconsax-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Input } from "@/components/ui/Input";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { Button } from "@/components/ui/Button";

import { TickCircle } from "iconsax-react";
import { Modal } from "@/components/ui/Modal";
import { useProviderOnboardingStore } from "@/store/useProviderOnboardingStore";
import { onboardingApi } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

const availabilityOptions = [
  { value: "MORNING", label: "Morning" },
  { value: "AFTERNOON", label: "Noon" },
  { value: "NIGHT", label: "Evening" },
];

const formatNaira = (v: number) => `₦${v.toLocaleString()}`;

export default function ProviderOnboardingStep7Page() {
  const router = useRouter();
  const store = useProviderOnboardingStore();

  const [location, setLocation] = useState(store.location);
  const [availability, setAvailability] = useState<string[]>(store.availability);
  const [priceRange, setPriceRange] = useState<[number, number]>(store.priceRange);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [approved, setApproved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = location.trim() !== "" && availability.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    store.setCustomizationStep7({ location, availability, priceRange });
    setError(null);

    // The answers from steps 4-6 live in memory only, so a page refresh loses them.
    const experience = store.serviceYears ? String(parseInt(store.serviceYears, 10)) : "";
    if (store.services.length === 0 || !store.businessName || !experience || !store.language) {
      setError("Some details from the earlier steps are missing. Please go back to step 4 and fill them in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      store.services.forEach((s) => formData.append("services", s));
      formData.append("business_name", store.businessName);
      if (store.bio) formData.append("bio", store.bio);
      if (store.businessAbout) formData.append("business_about", store.businessAbout);
      formData.append("experience", experience);
      formData.append("language", store.language);
      formData.append("location", location);
      availability.forEach((a) => formData.append("availability", a));
      formData.append("min_price", String(priceRange[0]));
      formData.append("max_price", String(priceRange[1]));
      if (store.certification) formData.append("certification", store.certification);

      const result = await onboardingApi.submitArtisanCustomization(formData);
      store.resetOnboarding();
      useAuthStore.getState().setActiveRole("provider");
      await useAuthStore.getState().refreshUser();
      setApproved(result?.kyc_status === "approved");
      setShowSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save your profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-white px-6 py-12">
      <form onSubmit={handleSubmit} className="w-full lg:max-w-xl">
        <ProgressBar percent={100} />

        <h1 className="mt-6 text-2xl font-extrabold leading-snug text-primary lg:text-3xl">
          Where do you typically offer your services?
        </h1>
        <p className="mt-2 text-sm text-muted">Let clients know where and when they can reach you.</p>

        <div className="mt-6 flex flex-col gap-5">
          <Input
            label="Location"
            placeholder="Enter your service address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            icon={<Location size={18} color="#3d5afe" variant="Bold" />}
          />

          <MultiSelect
            label="What time are you available to work?"
            options={availabilityOptions}
            selected={availability}
            onChange={setAvailability}
          />

          <div>
            <p className="mb-2 text-sm font-semibold text-foreground">Starting price</p>
            <RangeSlider min={5000} max={50000} step={1000} value={priceRange} onChange={setPriceRange} formatLabel={formatNaira} />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-600">
            {error}
          </div>
        )}

        <div className="mt-8">
          <Button type="submit" disabled={!isValid || isSubmitting}>
            {isSubmitting ? "Setting up profile..." : "Complete Profile"}
          </Button>
        </div>
      </form>

      <Modal open={showSuccess}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
          <TickCircle size={32} color="#3d5afe" variant="Bold" />
        </div>
        <h2 className="mt-5 text-xl font-extrabold text-foreground">
          {approved ? "You're approved! 🎉" : "Thanks, we're reviewing your profile"}
        </h2>
        <p className="mt-2 text-center text-sm text-muted">
          {approved
            ? "Your provider profile is live. You can now receive booking requests from customers."
            : "We check every provider's details before they can take jobs. We'll email you as soon as you're approved, usually within one business day."}
        </p>
        <div className="mt-6 flex flex-col gap-2.5">
          <Button variant="secondary" onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
        </div>
      </Modal>
    </div>
  );
}
