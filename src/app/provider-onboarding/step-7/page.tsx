"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Location } from "iconsax-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Input } from "@/components/ui/Input";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { Button } from "@/components/ui/Button";

const availabilityOptions = [
  { value: "morning", label: "Morning" },
  { value: "noon", label: "Noon" },
  { value: "evening", label: "Evening" },
];

const formatNaira = (v: number) => `₦${v.toLocaleString()}`;

export default function ProviderOnboardingStep7Page() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([10000, 40000]);

  const isValid = location.trim() !== "" && availability.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    // TODO: wire up to the real provider-onboarding API once available.
    router.push("/");
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

        <div className="mt-8">
          <Button type="submit" disabled={!isValid}>
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}
