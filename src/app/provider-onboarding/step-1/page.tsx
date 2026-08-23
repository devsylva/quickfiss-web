"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepHeader } from "@/components/ui/StepHeader";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FileUploadBox } from "@/components/ui/FileUploadBox";
import { Button } from "@/components/ui/Button";

const days = Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
].map((m, i) => ({ value: String(i + 1), label: m }));
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 83 }, (_, i) => {
  const year = currentYear - 18 - i;
  return { value: String(year), label: String(year) };
});
const genders = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Prefer not to say" },
];

export default function ProviderOnboardingStep1Page() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");

  const isValid = firstName.trim() !== "" && lastName.trim() !== "" && day && month && year && gender;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    // TODO: wire up to the real provider-onboarding API once available.
    router.push("/provider-onboarding/step-2");
  };

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-white px-6 py-12">
      <form onSubmit={handleSubmit} className="w-full lg:max-w-xl">
        <StepHeader
          step={1}
          totalSteps={4}
          title="Let&rsquo;s Get to Know You"
          subtitle="Enter your basic details to get started"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            label="Last Name"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-foreground">Profile Picture</p>
          <FileUploadBox helperText="JPG and PNG files supported. Max size 4MB." />
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-foreground">Date of Birth</p>
          <div className="grid grid-cols-3 gap-4">
            <Select placeholder="Day" options={days} value={day} onChange={(e) => setDay(e.target.value)} />
            <Select placeholder="Month" options={months} value={month} onChange={(e) => setMonth(e.target.value)} />
            <Select placeholder="Year" options={years} value={year} onChange={(e) => setYear(e.target.value)} />
          </div>
        </div>

        <div className="mt-5">
          <Select
            label="Gender"
            placeholder="Select"
            options={genders}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
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
