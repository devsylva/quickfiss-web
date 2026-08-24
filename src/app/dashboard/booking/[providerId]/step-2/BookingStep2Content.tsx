"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Location as LocationIcon, Calendar as CalendarIcon, Clock, ArrowDown2, ArrowUp2 } from "iconsax-react";
import { WizardStepHeading } from "@/components/ui/WizardStepHeading";
import { Calendar } from "@/components/ui/Calendar";
import { TimePicker, type TimeValue } from "@/components/ui/TimePicker";
import { Button } from "@/components/ui/Button";
import { ChevronLeftIcon } from "@/components/icons";
import type { Provider } from "@/components/ui/ProviderCard";

const SUGGESTED_ADDRESSES = [
  "12B Admiralty Way, Lekki Phase 1, Lagos",
  "22 Gwarinpa Crescent, Gwarinpa, Abuja",
  "45 Old Aba Road, Rumuogba, Port Harcourt",
  "8 Owerri Road, GRA, Enugu",
  "14 Ahmadu Bello Way, GRA, Kaduna",
  "6 Ikot Ekpene Road, Uyo",
  "32 Challenge Road, Ring Road, Ibadan",
  "17 Opebi Road, Ikeja, Lagos",
];

const pad = (n: number) => String(n).padStart(2, "0");

function BookingStep2Inner({ provider }: { provider: Provider }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialAddress = searchParams.get("address") ?? "";

  const [locationSearchOpen, setLocationSearchOpen] = useState(false);
  const [location, setLocation] = useState(initialAddress);
  const [locationQuery, setLocationQuery] = useState(initialAddress);
  const [date, setDate] = useState<Date | null>(null);
  const [dateOpen, setDateOpen] = useState(false);
  const [time, setTime] = useState<TimeValue | null>(null);
  const [timeOpen, setTimeOpen] = useState(false);

  const isValid = location.trim() !== "" && date !== null && time !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    // TODO: build steps 3-4 (review & confirm, payment) once those screens are provided.
    router.push("/dashboard");
  };

  const filteredSuggestions = SUGGESTED_ADDRESSES.filter((a) =>
    a.toLowerCase().includes(locationQuery.toLowerCase()),
  );

  if (locationSearchOpen) {
    return (
      <div className="flex min-h-dvh w-full flex-col bg-white px-6 py-6 lg:items-center lg:py-10">
        <div className="w-full lg:max-w-xl">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setLocationSearchOpen(false)} aria-label="Go back">
              <ChevronLeftIcon />
            </button>
            <h1 className="text-lg font-semibold text-foreground">Location</h1>
          </div>

          <div className="relative mt-4">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <LocationIcon size={18} color="#3d5afe" variant="Bold" />
            </span>
            <input
              autoFocus
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="w-full rounded-input border border-primary py-3.5 pl-11 pr-4 text-sm text-foreground outline-none ring-4 ring-primary/15"
            />
          </div>

          <div className="mt-2 flex flex-col divide-y divide-border">
            {filteredSuggestions.map((address) => (
              <button
                key={address}
                type="button"
                onClick={() => {
                  setLocation(address);
                  setLocationQuery(address);
                  setLocationSearchOpen(false);
                }}
                className="py-4 text-left text-sm text-foreground hover:text-primary"
              >
                {address}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-white px-6 py-10">
      <form onSubmit={handleSubmit} className="w-full lg:max-w-xl">
        <WizardStepHeading step={2} totalSteps={4} title="Choose where & when the provider should come" />
        <p className="mb-6 text-sm text-muted">Booking with {provider.name}</p>

        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">Location</p>
          <button
            type="button"
            onClick={() => setLocationSearchOpen(true)}
            className="flex w-full items-center gap-3 rounded-input border border-emerald-200 bg-emerald-50/50 px-4 py-3.5 text-left"
          >
            <LocationIcon size={20} color="#3d5afe" variant="Bold" />
            <span>
              <span className="block text-sm font-semibold text-foreground">Current Location</span>
              <span className="block text-sm text-muted">{location || "Select your location"}</span>
            </span>
          </button>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-foreground">Date</p>
          <button
            type="button"
            onClick={() => {
              setDateOpen((v) => !v);
              setTimeOpen(false);
            }}
            className={`flex w-full items-center justify-between rounded-input border px-4 py-3.5 text-sm ${
              dateOpen ? "border-primary ring-4 ring-primary/15" : "border-border"
            }`}
          >
            <span className="flex items-center gap-2 text-foreground">
              <CalendarIcon size={18} color="#171717" variant="Linear" />
              {date
                ? date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                : "Select Date"}
            </span>
            {dateOpen ? (
              <ArrowUp2 size={16} color="#171717" variant="Linear" />
            ) : (
              <ArrowDown2 size={16} color="#171717" variant="Linear" />
            )}
          </button>
          {dateOpen && (
            <div className="mt-2">
              <Calendar
                value={date}
                onChange={(d) => {
                  setDate(d);
                  setDateOpen(false);
                }}
              />
            </div>
          )}
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-foreground">Time</p>
          <button
            type="button"
            onClick={() => {
              setTimeOpen((v) => !v);
              setDateOpen(false);
            }}
            className={`flex w-full items-center justify-between rounded-input border px-4 py-3.5 text-sm ${
              timeOpen ? "border-primary ring-4 ring-primary/15" : "border-border"
            }`}
          >
            <span className="flex items-center gap-2 text-foreground">
              <Clock size={18} color="#171717" variant="Linear" />
              {time ? `${pad(time.hour)} : ${pad(time.minute)} ${time.meridiem}` : "Select Time"}
            </span>
            {timeOpen ? (
              <ArrowUp2 size={16} color="#171717" variant="Linear" />
            ) : (
              <ArrowDown2 size={16} color="#171717" variant="Linear" />
            )}
          </button>
          {timeOpen && (
            <div className="mt-2">
              <TimePicker value={time ?? { hour: 12, minute: 0, meridiem: "AM" }} onChange={setTime} />
            </div>
          )}
        </div>

        <div className="mt-8">
          <Button type="submit" disabled={!isValid}>
            Next Step
          </Button>
        </div>
      </form>
    </div>
  );
}

export function BookingStep2Content({ provider }: { provider: Provider }) {
  return (
    <Suspense fallback={null}>
      <BookingStep2Inner provider={provider} />
    </Suspense>
  );
}
