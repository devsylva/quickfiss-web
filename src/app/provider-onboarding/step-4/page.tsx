"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car, Trash, Cake, Home2, Truck, Brush, Monitor } from "iconsax-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CategoryAccordion } from "@/components/ui/CategoryAccordion";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";

interface Category {
  key: string;
  title: string;
  icon: React.ReactNode;
  services: string[];
}

const categories: Category[] = [
  {
    key: "automotive",
    title: "Automotive",
    icon: <Car size={22} color="#3d5afe" variant="Linear" />,
    services: ["Car Wash", "Auto Repair", "Tire Service", "Towing", "Car AC Repair"],
  },
  {
    key: "cleaning",
    title: "Cleaning & Waste",
    icon: <Trash size={22} color="#3d5afe" variant="Linear" />,
    services: ["House Cleaning", "Office Cleaning", "Waste Disposal", "Fumigation", "Laundry"],
  },
  {
    key: "food",
    title: "Food & Catering",
    icon: <Cake size={22} color="#3d5afe" variant="Linear" />,
    services: ["Event Catering", "Private Chef", "Baking", "Meal Prep"],
  },
  {
    key: "home",
    title: "Home Services",
    icon: <Home2 size={22} color="#3d5afe" variant="Linear" />,
    services: ["Plumbing", "Electrical", "Carpentry", "Painting", "AC Repair", "Interior Design"],
  },
  {
    key: "logistics",
    title: "Logistics",
    icon: <Truck size={22} color="#3d5afe" variant="Linear" />,
    services: ["Package Delivery", "Moving Services", "Dispatch Rider", "Freight"],
  },
  {
    key: "personal-care",
    title: "Personal Care",
    icon: <Brush size={22} color="#3d5afe" variant="Linear" />,
    services: ["Haircut & Barbing", "Makeup", "Massage", "Manicure & Pedicure", "Spa"],
  },
  {
    key: "tech",
    title: "Tech & Electronics",
    icon: <Monitor size={22} color="#3d5afe" variant="Linear" />,
    services: ["Phone Repair", "Computer Repair", "TV Installation", "Home Networking"],
  },
];

import { useProviderOnboardingStore } from "@/store/useProviderOnboardingStore";

export default function ProviderOnboardingStep4Page() {
  const router = useRouter();
  const store = useProviderOnboardingStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set(store.services));

  const toggleService = (service: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(service)) next.delete(service);
      else next.add(service);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.size === 0) return;
    store.setCustomizationStep4(Array.from(selected));
    router.push("/provider-onboarding/step-5");
  };

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-white px-6 py-12">
      <form onSubmit={handleSubmit} className="w-full lg:max-w-xl">
        <ProgressBar percent={20} />

        <h1 className="mt-6 text-2xl font-extrabold leading-snug text-primary lg:text-3xl">
          Set up your professional profile
        </h1>
        <p className="mt-2 text-sm text-muted">What services do you offer?</p>

        <div className="mt-6">
          {categories.map((category) => (
            <CategoryAccordion
              key={category.key}
              icon={category.icon}
              title={category.title}
              expanded={expanded === category.key}
              onToggle={() => setExpanded((prev) => (prev === category.key ? null : category.key))}
            >
              {category.services.map((service) => (
                <Chip key={service} selected={selected.has(service)} onClick={() => toggleService(service)}>
                  {service}
                </Chip>
              ))}
            </CategoryAccordion>
          ))}
        </div>

        <div className="mt-8">
          <Button type="submit" disabled={selected.size === 0}>
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}
