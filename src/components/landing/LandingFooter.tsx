import Link from "next/link";
import { Flash, ShieldTick, Card, Call, Sms, Location } from "iconsax-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-white">
      {/* Top Banner: Trust badges */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/60 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldTick size={22} color="#34d399" variant="Bold" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">100% Vetted Artisans</p>
              <p className="text-[11px] text-zinc-400">Government ID & address verification</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Card size={22} color="#3d5afe" variant="Bold" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Escrow Payment Protection</p>
              <p className="text-[11px] text-zinc-400">Funds released only upon job satisfaction</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Flash size={22} color="#fbbf24" variant="Bold" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Lightning Fast Dispatch</p>
              <p className="text-[11px] text-zinc-400">Connect with nearby pros in under 5 minutes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/30">
                <Flash size={20} color="#ffffff" variant="Bold" />
              </div>
              <span className="font-sans text-2xl font-extrabold tracking-tight text-white">
                Quickfiss
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              Africa&rsquo;s most trusted on-demand artisan platform. Connecting homeowners, drivers, and businesses with top-rated, background-checked craftsmen.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Location size={16} color="#71717a" variant="Bold" />
                <span>Victoria Island, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-2">
                <Call size={16} color="#71717a" variant="Bold" />
                <span>+234 1 800 QUICK (784-253)</span>
              </div>
              <div className="flex items-center gap-2">
                <Sms size={16} color="#71717a" variant="Bold" />
                <span>support@quickfiss.com</span>
              </div>
            </div>
          </div>

          {/* Column 1: Services */}
          <div>
            <h4 className="text-sm font-bold text-white">Services</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/dashboard/category/automotive" className="hover:text-white transition-colors">
                  Auto Mechanics & AC
                </Link>
              </li>
              <li>
                <Link href="/dashboard/category/home" className="hover:text-white transition-colors">
                  Plumbing & Electrical
                </Link>
              </li>
              <li>
                <Link href="/dashboard/category/cleaning" className="hover:text-white transition-colors">
                  Cleaning & Waste
                </Link>
              </li>
              <li>
                <Link href="/dashboard/category/food" className="hover:text-white transition-colors">
                  Food & Catering
                </Link>
              </li>
              <li>
                <Link href="/dashboard/category/tech" className="hover:text-white transition-colors">
                  Gadgets & Electronics
                </Link>
              </li>
              <li>
                <Link href="/dashboard/category/logistics" className="hover:text-white transition-colors">
                  Dispatch & Moving
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="text-sm font-bold text-white">Company</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/provider-onboarding/step-1" className="hover:text-white transition-colors">
                  Become a Provider
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  Help & FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Trust */}
          <div>
            <h4 className="text-sm font-bold text-white">Legal & Safety</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  KYC & Safety Guarantee
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Dispute Resolution
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 text-xs text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Quickfiss Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-zinc-300 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
