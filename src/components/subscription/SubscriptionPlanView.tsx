"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useRouter, useSearchParams } from "next/navigation";
import { TickCircle } from "iconsax-react";
import { billingsApi } from "@/lib/api/billings";
import { walletApi } from "@/lib/api/wallet";
import { formatNaira } from "@/lib/money";
import type { BillingPlan } from "@/types/api";

export type PlanType = "free" | "standard" | "premium";

interface PlanFeature {
  title: string;
  description: string;
  icon: "notification" | "verified" | "chart" | "cash" | "chat" | "support";
}

interface PlanData {
  id: PlanType;
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
    name: "Free",
    price: "Free",
    period: "forever",
    cardDescription: "Everything you need to start getting booked: job requests that match your services.",
    features: [
      {
        title: "Job requests",
        description: "Get booking requests from customers who find you in search.",
        icon: "notification",
      },
    ],
  },
  standard: {
    id: "standard",
    name: "Standard",
    price: "",
    period: "per month",
    cardDescription: "Stand out with a trust badge, appear above free providers and keep more of every job.",
    features: [
      {
        title: "Verified Provider badge",
        description: "A trust badge on your profile and in search results.",
        icon: "verified",
      },
      {
        title: "Better placement",
        description: "Listed above free providers when customers browse and search.",
        icon: "chart",
      },
      {
        title: "Lower platform fee",
        description: "Keep more of every job you complete.",
        icon: "cash",
      },
    ],
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: "",
    period: "per month",
    cardDescription: "Everything in Standard, with the top spot in search and our lowest platform fee.",
    features: [
      {
        title: "Verified Provider badge",
        description: "A trust badge on your profile and in search results.",
        icon: "verified",
      },
      {
        title: "Top placement",
        description: "Listed first, above Standard and free providers.",
        icon: "chart",
      },
      {
        title: "Lowest platform fee",
        description: "Our lowest fee on every job you complete.",
        icon: "cash",
      },
    ],
  },
};

interface MySubscription {
  plan: PlanType;
  expires_at: string | null;
}

export function SubscriptionPlanView({
  onPlanSelected,
  showSkip = true,
}: {
  onPlanSelected?: (plan: PlanType) => void;
  showSkip?: boolean;
}) {
  const router = useRouter();
  const returned = useSearchParams().get("paid");
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [mine, setMine] = useState<MySubscription>({ plan: "free", expires_at: null });
  const [apiPlans, setApiPlans] = useState<Partial<Record<PlanType, BillingPlan & { fee_percent?: number }>>>({});
  const [loading, setLoading] = useState(true);
  const [payOpen, setPayOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [paying, setPaying] = useState<"wallet" | "card" | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const toast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        // Coming back from Paystack: confirm the card payment before reading the plan.
        if (returned) await billingsApi.verifySubscriptionPayment().catch(() => {});
        const [list, sub] = await Promise.all([billingsApi.getPlans(), billingsApi.getSubscription()]);
        if (cancelled) return;
        const byName: Partial<Record<PlanType, BillingPlan>> = {};
        (Array.isArray(list) ? list : []).forEach((p) => {
          byName[p.name as PlanType] = p;
        });
        setApiPlans(byName);
        setMine({ plan: (sub.plan as PlanType) ?? "free", expires_at: sub.expires_at ?? null });
        if (returned) toast(sub.plan === "free" ? "We haven't received that payment yet." : `You're now on the ${plans[sub.plan as PlanType]?.name} plan.`);
      } catch (err: unknown) {
        if (!cancelled) toast(err instanceof Error ? err.message : "We couldn't load the plans.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [returned, reloadKey]);

  const shown: PlanType = selectedPlan ?? mine.plan;
  const currentPlan = plans[shown];
  const apiPlan = apiPlans[shown];
  const priceOf = (key: PlanType) => (key === "free" ? "Free" : apiPlans[key] ? formatNaira(apiPlans[key]!.price) : "");
  const isCurrent = mine.plan === shown;
  const expiry = mine.expires_at ? new Date(mine.expires_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null;

  const openPay = async () => {
    setPayError(null);
    setPayOpen(true);
    setWalletBalance(null);
    try {
      setWalletBalance(Number((await walletApi.getMyWallet()).balance));
    } catch {
      setWalletBalance(null);
    }
  };

  const handleSubscribe = () => {
    if (shown === "free") {
      if (mine.plan !== "free") {
        toast(`You'll move to Free when your ${plans[mine.plan].name} plan ends${expiry ? ` on ${expiry}` : ""}.`);
        return;
      }
      if (onPlanSelected) onPlanSelected("free");
      else router.push("/dashboard");
      return;
    }
    openPay();
  };

  const payWithWallet = async () => {
    if (!apiPlan || paying) return;
    setPaying("wallet");
    setPayError(null);
    try {
      await billingsApi.purchaseSubscription(apiPlan.id, "wallet");
      setPayOpen(false);
      setSelectedPlan(null);
      setReloadKey((k) => k + 1);
      toast(`You're now on the ${currentPlan.name} plan.`);
      onPlanSelected?.(shown);
    } catch (err: unknown) {
      setPayError(err instanceof Error ? err.message : "We couldn't take that payment.");
    } finally {
      setPaying(null);
    }
  };

  const payWithCard = async () => {
    if (!apiPlan || paying) return;
    setPaying("card");
    setPayError(null);
    try {
      const { authorization_url } = await billingsApi.purchaseSubscriptionByCard(
        apiPlan.id,
        `${window.location.origin}/dashboard/subscription?paid=1`,
      );
      window.location.assign(authorization_url);
    } catch (err: unknown) {
      setPayError(err instanceof Error ? err.message : "We couldn't start the payment.");
      setPaying(null);
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
            const isSelected = shown === planKey;
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

            {isCurrent && (
              <span className="rounded-full bg-[#dbeafe] px-3 py-1 text-xs font-bold text-[#2563eb]">
                Active
              </span>
            )}
          </div>
          {shown !== "free" && apiPlan && (
            <p className="mt-1 text-sm font-bold text-foreground">
              {priceOf(shown)} <span className="font-medium text-muted">/ {apiPlan.duration_days} days</span>
            </p>
          )}
          {isCurrent && expiry && <p className="mt-1 text-xs text-zinc-600">Active until {expiry}</p>}
          {shown !== "free" && apiPlan?.fee_percent !== undefined && (
            <p className="mt-1 text-xs text-zinc-600">Platform fee: {apiPlan.fee_percent}% per job</p>
          )}

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
              const isSelected = shown === pKey;
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
                    <span className="text-xs font-extrabold text-primary">{priceOf(pKey)}</span>
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
          disabled={loading || (isCurrent && shown !== "free" ? false : isCurrent)}
          className="w-full rounded-2xl bg-primary py-4 text-center text-sm font-bold text-white shadow-md transition-all hover:bg-primary-dark active:scale-95 disabled:opacity-70 sm:text-base"
        >
          {loading
            ? "Loading..."
            : shown === "free"
              ? isCurrent
                ? "Current Plan"
                : "Switch to Free when my plan ends"
              : isCurrent
                ? `Extend by ${apiPlan?.duration_days ?? 30} days · ${priceOf(shown)}`
                : `Subscribe · ${priceOf(shown)}`}
        </button>
      </div>

      <Modal open={payOpen} position="bottom">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            {currentPlan.name} · {priceOf(shown)}
          </h2>
          <button type="button" onClick={() => setPayOpen(false)} aria-label="Close">
            <span className="text-xl text-foreground">×</span>
          </button>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Pay for {apiPlan?.duration_days ?? 30} days. It doesn&apos;t renew by itself; you can extend any time.
        </p>
        {payError && <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">{payError}</p>}
        <div className="mt-5 flex flex-col gap-3">
          <Button
            isLoading={paying === "wallet"}
            disabled={paying !== null || (walletBalance !== null && apiPlan !== undefined && walletBalance < Number(apiPlan.price))}
            onClick={payWithWallet}
          >
            Pay from wallet{walletBalance !== null ? ` (${formatNaira(walletBalance)})` : ""}
          </Button>
          <Button variant="secondary" isLoading={paying === "card"} disabled={paying !== null} onClick={payWithCard}>
            Pay with card
          </Button>
          {walletBalance !== null && apiPlan !== undefined && walletBalance < Number(apiPlan.price) && (
            <Link href="/dashboard/wallet" className="text-center text-xs font-semibold text-primary">
              Add money to your wallet
            </Link>
          )}
        </div>
      </Modal>
    </div>
  );
}
