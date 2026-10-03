"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TickCircle } from "iconsax-react";
import { billingsApi } from "@/lib/api/billings";

export type PlanType = "free" | "standard" | "premium";

interface PlanFeature {
  title: string;
  description: string;
  icon: "notification" | "verified" | "chart" | "cash" | "chat" | "support";
}

interface PlanData {
  id: PlanType;
  apiPlanId?: number;
  name: string;
  badge?: string;
  price: string;
  period: string;
  cardDescription: string;
  features: PlanFeature[];
}

const plans: Record<PlanType, PlanData> = {
  free: {
    id: "free",
    apiPlanId: 1,
    name: "Free",
    badge: "Active",
    price: "$0",
    period: "forever",
    cardDescription:
      "We send you job offers that match what you're good at, so you don't have to search too hard. Just the right jobs, sent straight to you!",
    features: [
      {
        title: "Tailored Job Request Notification",
        description:
          "We send you job offers that match what you're good at, so you don't have to search too hard. Just the right jobs, sent straight to you!",
        icon: "notification",
      },
    ],
  },
  standard: {
    id: "standard",
    apiPlanId: 2,
    name: "Standard",
    price: "$19",
    period: "per month",
    cardDescription:
      "Great for growing artisans ready to scale their bookings, stand out to local clients, and access priority direct communication.",
    features: [
      {
        title: "Priority Job Notification",
        description:
          "Get notified 15 minutes before free tier providers for high-budget matching requests.",
        icon: "notification",
      },
      {
        title: "Verified Provider Status",
        description:
          "Stand out to potential clients with a verified artisan trust badge on your profile.",
        icon: "verified",
      },
      {
        title: "Direct Client Messaging",
        description:
          "Clients will be able to message you directly before booking confirmations.",
        icon: "chat",
      },
    ],
  },
  premium: {
    id: "premium",
    apiPlanId: 3,
    name: "Premium",
    price: "$49",
    period: "per month",
    cardDescription:
      "For people who want to grow their business and get the most out of Quickfiss. Everything in the Standard Plan, plus more tools to help you grow faster.",
    features: [
      {
        title: "Instant Verified Badge",
        description: "Get verified badge on registeration",
        icon: "verified",
      },
      {
        title: "Weekly Top Chart",
        description: "Be listed among top tier providers within your region",
        icon: "chart",
      },
      {
        title: "Accept Cash Payment",
        description: "Get cash back and instant withdrawal",
        icon: "cash",
      },
    ],
  },
};

export function SubscriptionPlanView({
  onPlanSelected,
  showSkip = true,
}: {
  onPlanSelected?: (plan: PlanType) => void;
  showSkip?: boolean;
}) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("free");
  const [activeSubscribedPlan, setActiveSubscribedPlan] = useState<PlanType>("free");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentPlan = plans[selectedPlan];

  const handleSubscribe = async () => {
    if (isSubscribing) return;
    // Paid plans have no payment step yet, so don't pretend they can be bought.
    if (selectedPlan !== "free") {
      setToastMessage(`The ${currentPlan.name} plan isn't available yet. We'll let you know when it is.`);
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }
    setIsSubscribing(true);
    try {
      if (currentPlan.apiPlanId) {
        try {
          await billingsApi.createSubscription(currentPlan.apiPlanId);
        } catch (err: unknown) {
          // An account that already has a plan just stays on it; anything else is a real failure.
          if (!(err instanceof Error && /already have a subscription/i.test(err.message))) throw err;
        }
      }
      setActiveSubscribedPlan(selectedPlan);
      setToastMessage("You're on the Free plan.");
      setTimeout(() => {
        if (onPlanSelected) onPlanSelected(selectedPlan);
        else router.push("/dashboard");
      }, 1500);
    } catch (err: unknown) {
      setToastMessage(err instanceof Error ? err.message : "We couldn't update your plan. Please try again.");
      setTimeout(() => setToastMessage(null), 3500);
    } finally {
      setIsSubscribing(false);
    }
  };

  const renderFeatureIcon = (iconType: PlanFeature["icon"]) => {
    switch (iconType) {
      case "notification":
        // Blue briefcase / shopping bag with white handle
        return (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-primary shadow-2xs">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 6V5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V6"
                stroke="#3d5afe"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect x="3" y="6" width="18" height="15" rx="4" fill="#3d5afe" />
              <path d="M3 11H21" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="13" r="1.5" fill="#ffffff" />
            </svg>
          </div>
        );

      case "verified":
        // Blue scalloped badge with checkmark (Matching Screenshot 2)
        return (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-primary shadow-2xs">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L14.4 3.7L17.3 3.5L18.6 6.1L21.3 7.3L21.1 10.2L23 12.3L21.1 14.4L21.3 17.3L18.6 18.5L17.3 21.1L14.4 20.9L12 22.6L9.6 20.9L6.7 21.1L5.4 18.5L2.7 17.3L2.9 14.4L1 12.3L2.9 10.2L2.7 7.3L5.4 6.1L6.7 3.5L9.6 3.7L12 2Z"
                fill="#3d5afe"
              />
              <path
                d="M8.5 12.5L10.8 14.8L15.5 9.8"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );

      case "chart":
        // Blue weekly top chart card with star (Matching Screenshot 2)
        return (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-primary shadow-2xs">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="16" rx="4" fill="#3d5afe" />
              <path
                d="M7 14L10 11L13 13L17 8"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Little star on bottom right */}
              <path
                d="M17 17L17.6 15.6L19 15.5L17.9 14.5L18.2 13.1L17 13.8L15.8 13.1L16.1 14.5L15 15.5L16.4 15.6L17 17Z"
                fill="#ffffff"
              />
            </svg>
          </div>
        );

      case "cash":
        // Blue cash payment banknote icon (Matching Screenshot 2)
        return (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-primary shadow-2xs">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="6" width="20" height="12" rx="3" fill="#3d5afe" />
              <circle cx="12" cy="12" r="3" fill="#ffffff" />
              <circle cx="5.5" cy="12" r="1.5" fill="#ffffff" />
              <circle cx="18.5" cy="12" r="1.5" fill="#ffffff" />
            </svg>
          </div>
        );

      case "chat":
        return (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-primary shadow-2xs">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20 12C20 16.4183 16.4183 20 12 20C10.5 20 9.1 19.6 7.9 18.9L4 20L5.2 16.3C4.4 15 4 13.5 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
                fill="#3d5afe"
              />
              <circle cx="8.5" cy="12" r="1" fill="#ffffff" />
              <circle cx="12" cy="12" r="1" fill="#ffffff" />
              <circle cx="15.5" cy="12" r="1" fill="#ffffff" />
            </svg>
          </div>
        );

      default:
        return (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-primary shadow-2xs">
            <TickCircle size={22} color="#3d5afe" variant="Bold" />
          </div>
        );
    }
  };

  return (
    <div className="mx-auto flex min-h-[85dvh] w-full max-w-md flex-col justify-between px-5 py-6 sm:max-w-xl sm:px-8 sm:py-8 lg:max-w-4xl">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm text-white shadow-xl sm:bottom-8 sm:right-8">
          <TickCircle size={18} color="#3d5afe" variant="Bold" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div>
        {/* Top Header Bar with Skip */}
        <div className="flex items-center justify-end">
          {showSkip && (
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-primary transition-opacity hover:opacity-80"
            >
              Skip
            </Link>
          )}
        </div>

        {/* Title */}
        <div className="mt-3 sm:mt-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Select subscription plan
          </h1>
        </div>

        {/* Plan Selector Pill Tabs (Matching Screenshot 1 & 2) */}
        <div className="mt-6 flex items-center gap-2 sm:gap-4">
          {(["free", "standard", "premium"] as PlanType[]).map((planKey) => {
            const isSelected = selectedPlan === planKey;
            const p = plans[planKey];
            return (
              <button
                key={planKey}
                type="button"
                onClick={() => setSelectedPlan(planKey)}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all sm:text-sm ${
                  isSelected
                    ? "bg-[#eaf4ec] text-foreground shadow-2xs"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        {/* Plan Header Card with Mint/Green Tint Background */}
        <div className="mt-6 rounded-3xl bg-[#e3f4e8] p-6 shadow-2xs transition-all sm:p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
              {currentPlan.name}
            </h2>

            {activeSubscribedPlan === selectedPlan && (
              <span className="rounded-full bg-[#dbeafe] px-3 py-1 text-xs font-bold text-[#2563eb]">
                Active
              </span>
            )}
          </div>

          <p className="mt-3 text-xs leading-relaxed text-zinc-700 sm:text-sm">
            {currentPlan.cardDescription}
          </p>
        </div>

        {/* "You'll get" Section */}
        <div className="mt-8">
          <h3 className="text-base font-extrabold text-foreground sm:text-lg">
            You&apos;ll get
          </h3>

          <div className="mt-4 space-y-5 sm:space-y-6">
            {currentPlan.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3.5 sm:gap-4">
                {renderFeatureIcon(feature.icon)}

                <div className="flex-1">
                  <h4 className="text-sm font-bold text-foreground sm:text-base">
                    {feature.title}
                  </h4>
                  <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 sm:text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Comparison Grid on Large Screens (>= 1024px) */}
        <div className="mt-10 hidden border-t border-border/60 pt-8 lg:block">
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted">
            Compare All Plans
          </h4>
          <div className="grid grid-cols-3 gap-4">
            {(["free", "standard", "premium"] as PlanType[]).map((pKey) => {
              const p = plans[pKey];
              const isSelected = selectedPlan === pKey;
              return (
                <div
                  key={pKey}
                  onClick={() => setSelectedPlan(pKey)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? "border-primary bg-primary-light/20 shadow-xs"
                      : "border-border/80 bg-white hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">{p.name}</span>
                    <span className="text-xs font-extrabold text-primary">{p.price}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted line-clamp-2">{p.cardDescription}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Button */}
      <div className="mt-8 pt-4 pb-2">
        <button
          type="button"
          onClick={handleSubscribe}
          disabled={isSubscribing}
          className="w-full rounded-2xl bg-primary py-4 text-center text-sm font-bold text-white shadow-md transition-all hover:bg-primary-dark active:scale-95 disabled:opacity-70 sm:text-base"
        >
          {isSubscribing
            ? "Updating Plan..."
            : activeSubscribedPlan === selectedPlan
            ? "Current Plan"
            : "Subscribe"}
        </button>
      </div>
    </div>
  );
}
