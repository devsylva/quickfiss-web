"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home2, Briefcase } from "iconsax-react";
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
    router.push("/");
  };

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-white px-6 py-12">
      <form onSubmit={handleSubmit} className="w-full lg:max-w-xl">
        <h1 className="text-2xl font-extrabold leading-snug text-primary lg:text-3xl">
          How are you planning to use Quickfiss
        </h1>
        <p className="mt-2 text-sm text-muted">What services are you interested in?</p>

        <div className="mt-8 flex flex-col gap-5">
          <SelectCard
            selected={role === "customer"}
            onSelect={() => setRole("customer")}
            illustration={<Home2 size={40} color="#3d5afe" variant="Bulk" />}
            title="I need repairs & services"
            description="Book skilled providers for home and business needs."
          />
          <SelectCard
            selected={role === "provider"}
            onSelect={() => setRole("provider")}
            illustration={<Briefcase size={40} color="#3d5afe" variant="Bulk" />}
            title="I want to offer my skills & services"
            description="Connect with clients and grow your business."
          />
        </div>

        <div className="mt-8">
          <Button type="submit" disabled={!role}>
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
