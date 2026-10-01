"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const languageOptions = [
  { value: "english", label: "English" },
  { value: "pidgin", label: "Pidgin" },
  { value: "igbo", label: "Igbo" },
  { value: "hausa", label: "Hausa" },
  { value: "yoruba", label: "Yoruba" },
];

import { useProviderOnboardingStore } from "@/store/useProviderOnboardingStore";

export default function ProviderOnboardingStep6Page() {
  const router = useRouter();
  const store = useProviderOnboardingStore();
  const [about, setAbout] = useState(store.businessAbout);
  const [language, setLanguage] = useState(store.language);

  const isValid = about.trim() !== "" && language !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    store.setCustomizationStep6({
      businessAbout: about,
      language,
    });
    router.push("/provider-onboarding/step-7");
  };

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-white px-6 py-12">
      <form onSubmit={handleSubmit} className="w-full lg:max-w-xl">
        <ProgressBar percent={70} />

        <h1 className="mt-6 text-2xl font-extrabold leading-snug text-primary lg:text-3xl">
          What makes you unique?
        </h1>
        <p className="mt-2 text-sm text-muted">Briefly describe your service style and what makes you unique.</p>

        <div className="mt-6 flex flex-col gap-5">
          <Textarea
            label="About"
            placeholder="e.g. I specialize in same-day repairs with a 1-year warranty on all work."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />

          <Select
            label="Language"
            placeholder="Select"
            options={languageOptions}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
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
