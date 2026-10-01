"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown2 } from "iconsax-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Chip } from "@/components/ui/Chip";
import { FileInputRow } from "@/components/ui/FileInputRow";
import { Button } from "@/components/ui/Button";

const yearOptions = ["1 Year", "2 Years", "3 Years", "4 Years", "5 Years", "6 Years", "7 Years", "8 Years", "9 Years", "10 Years+"];

import { useProviderOnboardingStore } from "@/store/useProviderOnboardingStore";

export default function ProviderOnboardingStep5Page() {
  const router = useRouter();
  const store = useProviderOnboardingStore();
  const [businessName, setBusinessName] = useState(store.businessName);
  const [bio, setBio] = useState(store.bio);
  const [serviceYears, setServiceYears] = useState<string | null>(store.serviceYears);
  const [yearsExpanded, setYearsExpanded] = useState(true);
  const [certification, setCertification] = useState<File | null>(store.certification);

  const isValid = businessName.trim() !== "" && serviceYears !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    store.setCustomizationStep5({
      businessName,
      bio,
      serviceYears,
      certification,
    });
    router.push("/provider-onboarding/step-6");
  };

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-white px-6 py-12">
      <form onSubmit={handleSubmit} className="w-full lg:max-w-xl">
        <ProgressBar percent={40} />

        <h1 className="mt-6 text-2xl font-extrabold leading-snug text-primary lg:text-3xl">
          Let&rsquo;s Get to Know Your Business
        </h1>
        <p className="mt-2 text-sm text-muted">Tell us about your business</p>

        <div className="mt-6 flex flex-col gap-5">
          <Input
            label="Business Name"
            placeholder="Enter your business name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />

          <Textarea
            label="Short Bio"
            placeholder="Write a short bio about your business"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <div className="border-b border-t border-border py-4">
            <button
              type="button"
              onClick={() => setYearsExpanded((v) => !v)}
              className="flex w-full items-center justify-between"
            >
              <span className="text-sm font-semibold text-foreground">Service years</span>
              <ArrowDown2
                size={18}
                color="#a1a1aa"
                className={`transition-transform duration-300 ${yearsExpanded ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ${yearsExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-wrap gap-2 pt-4">
                  {yearOptions.map((year) => (
                    <Chip key={year} selected={serviceYears === year} onClick={() => setServiceYears(year)}>
                      {year}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <FileInputRow label="Certification" onFileSelect={setCertification} />
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
