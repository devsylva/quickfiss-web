"use client";

import { useState } from "react";
import Link from "next/link";
import { HambergerMenu, CloseCircle, Flash } from "iconsax-react";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Services", href: "/#categories" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Why Quickfiss", href: "/#features" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/30 transition-transform duration-300 group-hover:scale-105">
            <Flash size={22} color="#ffffff" variant="Bold" />
          </div>
          <span className="font-sans text-2xl font-extrabold tracking-tight text-foreground transition-colors group-hover:text-primary">
            Quickfiss
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-muted transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Action CTAs */}
        <div className="hidden items-center gap-3.5 md:flex">
          <Link
            href="/sign-in"
            className="rounded-btn px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-zinc-100 hover:text-primary"
          >
            Sign In
          </Link>
          <Link
            href="/choose-role"
            className="flex items-center gap-2 rounded-btn bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all duration-300 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/35 active:scale-[0.98]"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-foreground transition-colors hover:bg-zinc-100 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <CloseCircle size={26} color="#101828" variant="Linear" />
          ) : (
            <HambergerMenu size={26} color="#101828" variant="Linear" />
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-border/80 bg-white px-6 py-6 shadow-xl md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-base font-semibold text-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-btn border border-border bg-white py-3 text-sm font-semibold text-foreground hover:bg-zinc-50"
              >
                Sign In
              </Link>
              <Link
                href="/choose-role"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-btn bg-primary py-3 text-sm font-semibold text-white shadow-md shadow-primary/25 hover:bg-primary-dark"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
