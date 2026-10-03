"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SelectCard } from "@/components/ui/SelectCard";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/store/useAuthStore";

type Role = "customer" | "provider";

export default function ChooseRolePage() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await authApi.setUserType({ user_type: role === "provider" ? "artisan" : "client" });

      const { user, setUser } = useAuthStore.getState();
      if (user) setUser({ ...user, user_type: role === "provider" ? "artisan" : "client" });

      router.push(role === "provider" ? "/provider-onboarding/step-1" : "/customer-onboarding/step-1");
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Your session has expired. Please sign in to continue.");
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      }
      setIsSubmitting(false);
    }
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

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
            {error}{" "}
            {error.includes("sign in") && (
              <Link href="/sign-in" className="font-semibold underline">
                Sign in
              </Link>
            )}
          </div>
        )}

        <div className="mt-10 mx-auto max-w-md lg:mx-0 lg:max-w-none">
          <Button type="submit" disabled={!role} isLoading={isSubmitting}>
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
