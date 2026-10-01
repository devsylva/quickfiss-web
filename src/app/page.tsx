"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  SearchNormal1,
  Location,
  ShieldTick,
  Flash,
  Card,
  MessageText1,
  Star1,
  ArrowRight,
  TickCircle,
  Car,
  Home2,
  Trash,
  Cake,
  Monitor,
  Truck,
  Brush,
  ArrowDown2,
  Sms,
  Call,
} from "iconsax-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";

const serviceCategories = [
  {
    title: "Automotive Repair",
    slug: "automotive",
    count: "450+ Mechanics",
    description: "Car mechanics, AC specialists, battery diagnostics & towing.",
    icon: <Car size={26} color="#3d5afe" variant="Bold" />,
    popular: "Brake service, engine scans, AC refilling",
  },
  {
    title: "Home Services",
    slug: "home",
    count: "780+ Pros",
    description: "Licensed plumbers, electricians, carpenters & AC technicians.",
    icon: <Home2 size={26} color="#3d5afe" variant="Bold" />,
    popular: "Leak repairs, rewiring, AC servicing",
  },
  {
    title: "Cleaning & Waste",
    slug: "cleaning",
    count: "320+ Cleaners",
    description: "Deep house cleaning, post-construction, fumigation & laundry.",
    icon: <Trash size={26} color="#3d5afe" variant="Bold" />,
    popular: "Standard clean, office fumigation, rug wash",
  },
  {
    title: "Food & Catering",
    slug: "food",
    count: "290+ Chefs",
    description: "Event caterers, private chefs, bakers & meal prep.",
    icon: <Cake size={26} color="#3d5afe" variant="Bold" />,
    popular: "Party jollof, small chops, birthday cakes",
  },
  {
    title: "Tech & Gadgets",
    slug: "tech",
    count: "410+ Techs",
    description: "Smartphone repair, laptop diagnostics, CCTV & home networking.",
    icon: <Monitor size={26} color="#3d5afe" variant="Bold" />,
    popular: "Screen replacement, software setup, CCTV",
  },
  {
    title: "Logistics & Moving",
    slug: "logistics",
    count: "310+ Riders",
    description: "Express dispatch delivery, apartment moving, and freight trucks.",
    icon: <Truck size={26} color="#3d5afe" variant="Bold" />,
    popular: "Same-day package, interstate haulage",
  },
  {
    title: "Personal Care",
    slug: "personal-care",
    count: "260+ Stylists",
    description: "Home hair styling, professional barbing, spa & makeup artists.",
    icon: <Brush size={26} color="#3d5afe" variant="Bold" />,
    popular: "Barbing, dreadlocks, event glam makeup",
  },
];

const faqs = [
  {
    question: "How does Quickfiss vet and verify service providers?",
    answer:
      "Every artisan on Quickfiss undergoes mandatory multi-tiered KYC verification. We verify their Government-issued Identity (National ID, Passport, or Driver's License), complete residential address with utility proof, and validate past work references and skill certifications before granting them access to client requests.",
  },
  {
    question: "How does Escrow Payment Protection keep my money safe?",
    answer:
      "When you book a service, your payment is securely held in an escrow wallet powered by Paystack. The funds are never transferred to the artisan until the job is completed, inspected, and you approve the final delivery.",
  },
  {
    question: "What if I am not satisfied with the work done?",
    answer:
      "Your funds remain in escrow. If there is any dissatisfaction, you can request a complimentary revision from the artisan through our in-app chat or escalate to Quickfiss Dispute Support within 48 hours for immediate mediation or a refund.",
  },
  {
    question: "How much does it cost to use Quickfiss?",
    answer:
      "Browsing, requesting quotes, and connecting with artisans is completely free for clients. You only pay for the service negotiated and accepted, with 100% upfront pricing and zero hidden fees.",
  },
  {
    question: "How do artisans get paid?",
    answer:
      "Once the customer marks the job as complete, funds are immediately released into the artisan's Quickfiss wallet, from where they can withdraw directly to any Nigerian commercial or digital bank account in seconds.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("Lagos, Nigeria");
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [howItWorksTab, setHowItWorksTab] = useState<"client" | "artisan">("client");

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSent, setContactSent] = useState(false);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("name", searchQuery.trim());
    if (locationQuery.trim()) params.set("address", locationQuery.trim());
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactSent(true);
    setTimeout(() => {
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      setContactSent(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-white text-foreground selection:bg-primary-light selection:text-primary">
      {/* Navigation Header */}
      <LandingNavbar />

      <main>
        {/* ========================================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/40 via-white to-white pb-20 pt-12 lg:pb-32 lg:pt-20">
          {/* Subtle decorative glow orb */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
              {/* Left Column: Headlines & CTA */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary">
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span>Africa&rsquo;s #1 On-Demand Artisan Network</span>
                </div>

                <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.12]">
                  Hire Verified, Skilled Artisans in Minutes &mdash;{" "}
                  <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                    Zero Hassle.
                  </span>
                </h1>

                <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg lg:max-w-xl">
                  Quickfiss connects homeowners and businesses with background-checked mechanics, plumbers, electricians, caterers, and technicians. Safe escrow payments and guaranteed satisfaction on every job.
                </p>

                {/* Hero Search Box */}
                <form
                  onSubmit={handleHeroSearch}
                  className="mt-8 flex flex-col gap-3 rounded-2xl border border-border/80 bg-white p-2.5 shadow-lg shadow-zinc-200/50 sm:flex-row sm:items-center sm:gap-2 sm:rounded-full lg:max-w-2xl"
                >
                  <div className="flex flex-1 items-center gap-2.5 px-3 py-2">
                    <SearchNormal1 size={20} color="#3d5afe" variant="Linear" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="What service do you need? (e.g. AC repair, plumber)"
                      className="w-full bg-transparent text-sm text-foreground placeholder:text-zinc-400 outline-none"
                    />
                  </div>

                  <div className="hidden h-6 w-[1px] bg-border sm:block" />

                  <div className="flex items-center gap-2 px-3 py-2">
                    <Location size={18} color="#71717a" variant="Bold" />
                    <input
                      type="text"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      placeholder="Location"
                      className="w-32 bg-transparent text-sm text-foreground placeholder:text-zinc-400 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark active:scale-[0.98] sm:rounded-full"
                  >
                    <span>Search</span>
                    <ArrowRight size={16} color="#ffffff" variant="Linear" />
                  </button>
                </form>

                {/* Trust Badges Bar */}
                <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted">
                  <div className="flex items-center gap-2">
                    <ShieldTick size={18} color="#3d5afe" variant="Bold" />
                    <span className="font-semibold text-foreground">100% KYC Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Card size={18} color="#3d5afe" variant="Bold" />
                    <span className="font-semibold text-foreground">Paystack Escrow Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star1 size={18} color="#f59e0b" variant="Bold" />
                    <span className="font-semibold text-foreground">4.9/5 Rating (15k+ Reviews)</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Stack */}
              <div className="relative lg:col-span-5">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Decorative glowing background */}
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-primary to-emerald-400 opacity-20 blur-xl" />

                  {/* Main Hero Card Preview */}
                  <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-white p-6 shadow-2xl">
                    <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-zinc-100">
                      <Image
                        src="/images/slide-1.png"
                        alt="Quickfiss Artisan"
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-foreground shadow-sm backdrop-blur-md">
                        ⚡ Instant Dispatch
                      </div>
                      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                        <TickCircle size={14} color="#ffffff" variant="Bold" />
                        Verified Pro
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">Ade Auto & AC Works</h3>
                        <p className="text-xs text-muted">Certified Auto Mechanic &bull; Lekki, Lagos</p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                        <Star1 size={14} color="#f59e0b" variant="Bold" />
                        4.8 (142)
                      </div>
                    </div>

                    {/* Escrow badge */}
                    <div className="mt-4 rounded-xl border border-primary/20 bg-primary-light/50 p-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-muted">Starting rate:</span>
                        <span className="font-bold text-primary">₦15,000 / job</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-zinc-500">
                        <ShieldTick size={14} color="#3d5afe" variant="Bold" />
                        Protected by Quickfiss Escrow Payout
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link
                        href="/choose-role"
                        className="flex flex-1 items-center justify-center rounded-btn bg-primary py-3 text-xs font-bold text-white shadow-sm hover:bg-primary-dark"
                      >
                        Book This Artisan
                      </Link>
                      <Link
                        href="/sign-in"
                        className="flex items-center justify-center rounded-btn border border-border px-4 py-3 text-xs font-semibold text-foreground hover:bg-zinc-50"
                      >
                        <MessageText1 size={16} color="#71717a" variant="Linear" />
                      </Link>
                    </div>
                  </div>

                  {/* Floating Micro Badge */}
                  <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border/80 bg-white p-3.5 shadow-xl sm:flex sm:items-center sm:gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <TickCircle size={22} color="#059669" variant="Bold" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Payment Secured</p>
                      <p className="text-[11px] text-muted">Released only on customer sign-off</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STATS STRIP */}
        {/* ========================================================================= */}
        <section className="border-y border-border/60 bg-zinc-50/60 py-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              <div>
                <p className="text-3xl font-extrabold text-foreground sm:text-4xl">10,000+</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted">Vetted Artisans</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-foreground sm:text-4xl">99.2%</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted">Satisfied Clients</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-foreground sm:text-4xl">&lt; 5 Mins</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted">Average Match Time</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-foreground sm:text-4xl">₦0</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted">Hidden Fees</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CATEGORIES SECTION */}
        {/* ========================================================================= */}
        <section id="categories" className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Explore Skills</span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Popular Service Categories
                </h2>
                <p className="mt-2 text-sm text-muted">
                  From emergency car diagnostics to home electrical, our certified experts have you covered.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark md:mt-0"
              >
                <span>View all services</span>
                <ArrowRight size={16} color="currentColor" variant="Linear" />
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {serviceCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/dashboard/category/${cat.slug}`}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      {cat.icon}
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-primary">
                        {cat.title}
                      </h3>
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600">
                        {cat.count}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted">{cat.description}</p>
                  </div>

                  <div className="mt-6 border-t border-border/60 pt-4 text-[11px] text-zinc-500">
                    <span className="font-semibold text-foreground">Common:</span> {cat.popular}
                  </div>
                </Link>
              ))}

              {/* Artisan recruitment callout in categories */}
              <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-xl">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-xs">
                    <Flash size={26} color="#ffffff" variant="Bold" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold">Offer Your Skilled Services?</h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/85">
                    Connect with thousands of paying clients across your neighborhood. Zero commission in your first month.
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    href="/provider-onboarding/step-1"
                    className="flex w-full items-center justify-center rounded-btn bg-white py-3 text-xs font-bold text-primary shadow-sm hover:bg-zinc-100"
                  >
                    Register as Artisan
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* WHY QUICKFISS / FEATURES & TRUST PILLARS */}
        {/* ========================================================================= */}
        <section id="features" className="border-t border-border/60 bg-zinc-50/50 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Uncompromising Trust</span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Built For Safety, Transparency & Peace of Mind
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                We took the friction and anxiety out of hiring informal workers in Africa. Here is how Quickfiss protects both clients and craftsmen:
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Feature 1 */}
              <div className="rounded-2xl border border-border/80 bg-white p-7 shadow-xs transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldTick size={26} color="#059669" variant="Bold" />
                </div>
                <h3 className="mt-5 text-base font-bold text-foreground">Verified Identities (KYC)</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  No anonymous workers. We thoroughly verify government IDs, NIN, residential utility bills, and work references for every single service provider.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl border border-border/80 bg-white p-7 shadow-xs transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <Card size={26} color="#3d5afe" variant="Bold" />
                </div>
                <h3 className="mt-5 text-base font-bold text-foreground">Paystack Escrow Wallets</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Your payment is locked safely in escrow. Artisans only receive payout once you test, inspect, and confirm complete satisfaction with the job.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-2xl border border-border/80 bg-white p-7 shadow-xs transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Flash size={26} color="#d97706" variant="Bold" />
                </div>
                <h3 className="mt-5 text-base font-bold text-foreground">Instant In-App Chat & Media</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Discuss the repair, share photos and diagnostic videos directly in the app. Get transparent itemized quotes before booking.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="rounded-2xl border border-border/80 bg-white p-7 shadow-xs transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Star1 size={26} color="#7c3aed" variant="Bold" />
                </div>
                <h3 className="mt-5 text-base font-bold text-foreground">Verified Reviews Only</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Zero fake ratings. Only clients who completed and paid for a real service can leave ratings, keeping our community transparent and accountable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW IT WORKS */}
        {/* ========================================================================= */}
        <section id="how-it-works" className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Simple 3-Step Process</span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                How Quickfiss Works
              </h2>

              {/* Client vs Artisan Toggle */}
              <div className="mt-6 inline-flex rounded-full border border-border bg-zinc-100 p-1">
                <button
                  type="button"
                  onClick={() => setHowItWorksTab("client")}
                  className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                    howItWorksTab === "client" ? "bg-white text-primary shadow-xs" : "text-muted hover:text-foreground"
                  }`}
                >
                  For Customers
                </button>
                <button
                  type="button"
                  onClick={() => setHowItWorksTab("artisan")}
                  className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                    howItWorksTab === "artisan" ? "bg-white text-primary shadow-xs" : "text-muted hover:text-foreground"
                  }`}
                >
                  For Artisans
                </button>
              </div>
            </div>

            {/* Client Steps */}
            {howItWorksTab === "client" && (
              <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="relative rounded-2xl border border-border/80 bg-white p-8 shadow-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-black text-white">
                    1
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">Search & Compare</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    Enter your location and required service. Browse through verified nearby professionals, see real ratings, distance, and starting rates.
                  </p>
                </div>

                <div className="relative rounded-2xl border border-border/80 bg-white p-8 shadow-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-black text-white">
                    2
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">Schedule & Fund Escrow</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    Pick your preferred date and time. Fund the booking securely via Paystack. Your money remains protected in escrow until the job is done.
                  </p>
                </div>

                <div className="relative rounded-2xl border border-border/80 bg-white p-8 shadow-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-black text-white">
                    3
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">Inspect & Release Payment</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    The artisan completes the job. Once you inspect the work and confirm satisfaction, release the funds and leave a review to help others.
                  </p>
                </div>
              </div>
            )}

            {/* Artisan Steps */}
            {howItWorksTab === "artisan" && (
              <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="relative rounded-2xl border border-border/80 bg-white p-8 shadow-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-black text-white">
                    1
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">Complete Quick KYC</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    Register with your government ID and proof of address. Set your trade categories, working hours, service areas, and pricing.
                  </p>
                </div>

                <div className="relative rounded-2xl border border-border/80 bg-white p-8 shadow-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-black text-white">
                    2
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">Receive Guaranteed Bookings</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    Receive verified job requests from clients around you. Every booking is backed by escrow funds already committed before you start work.
                  </p>
                </div>

                <div className="relative rounded-2xl border border-border/80 bg-white p-8 shadow-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-black text-white">
                    3
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">Instant Wallet Payouts</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    Deliver great service, collect 5-star ratings, and get instant payouts into your Quickfiss wallet with zero withdrawal delays.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ABOUT US SNAPSHOT */}
        {/* ========================================================================= */}
        <section id="about" className="border-t border-border/60 bg-zinc-50/60 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">About Quickfiss</span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Empowering Africa&rsquo;s Craftsmen, Protecting Every Home
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                  For decades, finding a trusted artisan in African cities meant relying on unreliable word-of-mouth, uncertain pricing, and the risk of shoddy workmanship. Meanwhile, brilliant craftsmen struggled with unsteady incomes and client distrust.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                  Quickfiss bridges this divide. By providing structured identity verification, transparent escrow payments, and an in-app dispute resolution framework, we are dignifying artisan labor while giving every household absolute peace of mind.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center gap-2 rounded-btn bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/25 hover:bg-primary-dark"
                  >
                    <span>Read Our Full Story</span>
                    <ArrowRight size={16} color="#ffffff" variant="Linear" />
                  </Link>
                  <Link
                    href="/choose-role"
                    className="inline-flex items-center justify-center rounded-btn border border-border bg-white px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-zinc-50"
                  >
                    Join Quickfiss Today
                  </Link>
                </div>
              </div>

              {/* Photo Showcase */}
              <div className="relative lg:col-span-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative h-64 overflow-hidden rounded-2xl bg-zinc-200 shadow-md">
                    <Image
                      src="/images/slide-2.png"
                      alt="Artisan at work"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-64 overflow-hidden rounded-2xl bg-zinc-200 shadow-md translate-y-6">
                    <Image
                      src="/images/slide-3.png"
                      alt="Happy client"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FAQS SECTION */}
        {/* ========================================================================= */}
        <section id="faq" className="py-20 lg:py-28">
          <div className="mx-auto max-w-4xl px-6 lg:px-12">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Got Questions?</span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-sm text-muted">
                Everything you need to know about booking, vetting, and payments on Quickfiss.
              </p>
            </div>

            <div className="mt-12 flex flex-col gap-4">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-2xl border border-border/80 bg-white transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between p-6 text-left"
                    >
                      <span className="text-sm font-bold text-foreground sm:text-base">{faq.question}</span>
                      <ArrowDown2
                        size={18}
                        color="#71717a"
                        className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-border/40 px-6 pb-6 pt-3 text-xs leading-relaxed text-muted sm:text-sm">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CONTACT US SECTION */}
        {/* ========================================================================= */}
        <section id="contact" className="border-t border-border/60 bg-zinc-50/50 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Get In Touch</span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  We&rsquo;re Here to Help
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Have an inquiry, need corporate artisan staffing, or experiencing an issue with a booking? Our dedicated team is ready 24/7.
                </p>

                <div className="mt-8 flex flex-col gap-5 text-sm text-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                      <Location size={20} color="#3d5afe" variant="Bold" />
                    </div>
                    <div>
                      <p className="font-bold">Lagos Head Office</p>
                      <p className="text-xs text-muted">14 Adeola Odeku St, Victoria Island, Lagos</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                      <Call size={20} color="#3d5afe" variant="Bold" />
                    </div>
                    <div>
                      <p className="font-bold">Customer Hotline</p>
                      <p className="text-xs text-muted">+234 1 800 QUICK (Mon - Sun, 24/7)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                      <Sms size={20} color="#3d5afe" variant="Bold" />
                    </div>
                    <div>
                      <p className="font-bold">Email Support</p>
                      <p className="text-xs text-muted">support@quickfiss.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Contact Form */}
              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-border/80 bg-white p-8 shadow-lg shadow-zinc-200/50 sm:p-10">
                  <h3 className="text-xl font-bold text-foreground">Send Us a Direct Message</h3>
                  <p className="mt-1 text-xs text-muted">We typically respond within 15 minutes.</p>

                  {contactSent ? (
                    <div className="mt-8 rounded-2xl bg-emerald-50 p-6 text-center text-emerald-800">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <TickCircle size={28} color="#059669" variant="Bold" />
                      </div>
                      <h4 className="mt-3 text-base font-bold">Message Delivered!</h4>
                      <p className="mt-1 text-xs text-emerald-700">
                        Thank you for contacting Quickfiss. A support specialist has received your inquiry and will reach out shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="mt-6 flex flex-col gap-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground">Your Name</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. Tunde Johnson"
                          className="mt-1.5 w-full rounded-xl border border-border px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-foreground">Email Address</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="tunde@example.com"
                          className="mt-1.5 w-full rounded-xl border border-border px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-foreground">How can we help?</label>
                        <textarea
                          rows={4}
                          required
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Tell us about your inquiry, service feedback or custom request..."
                          className="mt-1.5 w-full rounded-xl border border-border px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </div>

                      <button
                        type="submit"
                        className="mt-2 rounded-btn bg-primary py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark active:scale-[0.98]"
                      >
                        Submit Inquiry
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FINAL CALL TO ACTION BANNER */}
        {/* ========================================================================= */}
        <section className="bg-gradient-to-r from-primary via-primary to-primary-dark py-16 text-white">
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-12">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Get Your Next Repair Done Right
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
              Join over 10,000 satisfied households and businesses across Nigeria. Book a background-checked artisan today.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/choose-role"
                className="w-full rounded-btn bg-white px-8 py-4 text-sm font-bold text-primary shadow-lg transition-all hover:bg-zinc-100 sm:w-auto"
              >
                Find an Artisan Now
              </Link>
              <Link
                href="/provider-onboarding/step-1"
                className="w-full rounded-btn border border-white/40 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-xs transition-all hover:bg-white/20 sm:w-auto"
              >
                Register as a Pro
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
