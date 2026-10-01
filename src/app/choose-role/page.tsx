"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SelectCard } from "@/components/ui/SelectCard";
import { Button } from "@/components/ui/Button";

type Role = "customer" | "provider";

export default function ChooseRolePage() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    // TODO: wire up to the real account-setup API once available.
    if (role === "provider") {
      router.push("/provider-onboarding/step-1");
      return;
    }
    router.push("/customer-onboarding/step-1");
  };

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-white px-6 py-12 lg:py-16">
      <form onSubmit={handleSubmit} className="w-full lg:max-w-3xl">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl font-extrabold leading-snug text-primary sm:text-3xl lg:text-4xl">
            How are you planning to use Quickfiss?
          </h1>
          <p className="mt-2 text-sm text-muted sm:text-base">Select how you want to get started with our platform.</p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
          <SelectCard
            selected={role === "customer"}
            onSelect={() => setRole("customer")}
            illustration={<Image src="/images/role-customer.png" alt="" width={112} height={112} className="h-28 w-28 object-contain" />}
            title="I need repairs & services"
            description="Book skilled and verified providers for home and business needs."
          />
          <SelectCard
            selected={role === "provider"}
            onSelect={() => setRole("provider")}
            illustration={<Image src="/images/role-provider.png" alt="" width={112} height={112} className="h-28 w-28 object-contain" />}
            title="I want to offer my skills & services"
            description="Connect with clients, get booked, and grow your local business."
          />
        </div>

        <div className="mt-10 mx-auto max-w-md lg:mx-0 lg:max-w-none">
          <Button type="submit" disabled={!role}>
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
