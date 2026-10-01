import Link from "next/link";
import Image from "next/image";
import { ShieldTick, Flash, Card, Star1, TickCircle } from "iconsax-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata = {
  title: "About Us | Quickfiss - Africa's Trusted Artisan Network",
  description: "Learn how Quickfiss is organizing and empowering skilled African artisans through background verification, transparent escrow payments, and modern tools.",
};

export default function AboutPage() {
  const pillars = [
    {
      title: "Integrity & Verification First",
      description: "We believe trust is earned through rigor. Every single artisan undergoes comprehensive government ID verification, residential address audits, and skill evaluations.",
      icon: <ShieldTick size={26} color="#059669" variant="Bold" />,
    },
    {
      title: "Financial Protection for All",
      description: "Through our milestone escrow payment system with Paystack, clients never pay for sub-standard work, and honest artisans never worry about unpaid invoices.",
      icon: <Card size={26} color="#3d5afe" variant="Bold" />,
    },
    {
      title: "Dignity for Informal Labor",
      description: "We are empowering thousands of African craftsmen with digital identities, financial creditworthiness via digital wallets, and steady, high-value client bookings.",
      icon: <Star1 size={26} color="#7c3aed" variant="Bold" />,
    },
    {
      title: "Unmatched Speed & Reliability",
      description: "When an emergency strikes &mdash; whether a burst pipe or car breakdown &mdash; you should not have to wait days. We match you with nearby pros in under 5 minutes.",
      icon: <Flash size={26} color="#d97706" variant="Bold" />,
    },
  ];

  const milestones = [
    { year: "2024", title: "Quickfiss Founded", description: "Launched in Lagos with 50 vetted automotive and plumbing artisans." },
    { year: "2025", title: "Escrow Wallet Launch", description: "Integrated milestone-based escrow payments powered by Paystack." },
    { year: "2026", title: "10,000+ Verified Pros", description: "Expanded to multiple major African hubs with over 15,000 completed bookings." },
  ];

  return (
    <div className="min-h-screen bg-white text-foreground selection:bg-primary-light selection:text-primary">
      <LandingNavbar />

      <main>
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/40 via-white to-white py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                Our Story & Mission
              </span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Building Africa&rsquo;s Most Trusted Service Infrastructure
              </h1>
              <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
                Quickfiss was created with a clear objective: to take the uncertainty, mistrust, and friction out of hiring informal service providers across Africa.
              </p>
            </div>
          </div>
        </section>

        {/* The Problem & Solution */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="relative lg:col-span-6">
                <div className="relative h-96 w-full overflow-hidden rounded-3xl bg-zinc-100 shadow-xl">
                  <Image
                    src="/images/slide-1.png"
                    alt="African artisan technician"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="text-lg font-bold">100% Background Checked</p>
                    <p className="text-xs text-white/80">Every technician is verified with government ID and proof of address</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Why We Exist</span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Solving the Broken Trust in Home & Auto Services
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                  For decades, households and small businesses relied on unverified recommendations, arbitrary pricing, and zero accountability when things went wrong. Talented artisans were equally vulnerable to delayed payments and customer skepticism.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                  Quickfiss combines digital identity checks, secure milestone escrow, and in-app instant chat to create a win-win ecosystem. We give customers complete peace of mind and provide vetted artisans with predictable, dignified livelihoods.
                </p>

                <div className="mt-6 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                    <TickCircle size={20} color="#059669" variant="Bold" />
                    <span>Rigorous multi-point artisan screening</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                    <TickCircle size={20} color="#059669" variant="Bold" />
                    <span>Paystack-secured escrow payments</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                    <TickCircle size={20} color="#059669" variant="Bold" />
                    <span>Fair dispute resolution & satisfaction guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Pillars */}
        <section className="border-t border-border/60 bg-zinc-50/60 py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Our Core Values</span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                What Guides Everything We Build
              </h2>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {pillars.map((pillar, i) => (
                <div key={i} className="rounded-2xl border border-border/80 bg-white p-7 shadow-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50">
                    {pillar.icon}
                  </div>
                  <h3 className="mt-5 text-base font-bold text-foreground">{pillar.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Journey & Timeline */}
        <section className="py-20 lg:py-24">
          <div className="mx-auto max-w-4xl px-6 lg:px-12">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Growth & Milestones</span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Our Journey So Far
              </h2>
            </div>

            <div className="mt-14 flex flex-col gap-6">
              {milestones.map((item, idx) => (
                <div key={idx} className="flex gap-6 rounded-2xl border border-border/80 bg-white p-6 shadow-xs">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-black text-white">
                    {item.year}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="bg-primary py-16 text-white">
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-12">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Experience the Future of African Artisan Services
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">
              Join thousands of happy homeowners and verified professionals today.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/choose-role"
                className="rounded-btn bg-white px-8 py-3.5 text-sm font-bold text-primary shadow-lg hover:bg-zinc-100"
              >
                Get Started
              </Link>
              <Link
                href="/contact"
                className="rounded-btn border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/20"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
