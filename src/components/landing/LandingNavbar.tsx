"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HambergerMenu, CloseCircle, Flash, ArrowRight, ShieldTick } from "iconsax-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { number: "01", label: "Services", href: "/#categories" },
    { number: "02", label: "How It Works", href: "/#how-it-works" },
    { number: "03", label: "Why Quickfiss", href: "/#features" },
    { number: "04", label: "About Us", href: "/about" },
    { number: "05", label: "Contact", href: "/contact" },
  ];

  // Lock body scroll when Sentinel mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Handle smooth scroll for navigation clicks
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") || href.startsWith("#")) {
      const id = href.replace(/^\/?#/, "");
      if (pathname === "/" || pathname === "") {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", `#${id}`);
        }
      } else {
        // Navigating from another page back to anchor on homepage
        e.preventDefault();
        router.push(href);
      }
    } else if (href === pathname || (href === "/" && pathname === "/")) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/" || pathname === "") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  // Sentinel Circular Reveal Variants
  const overlayVariants: Variants = {
    closed: {
      clipPath: "circle(0px at calc(100% - 36px) 40px)",
      transition: {
        duration: 0.5,
        ease: [0.77, 0, 0.175, 1],
      },
    },
    open: {
      clipPath: "circle(160% at calc(100% - 36px) 40px)",
      transition: {
        duration: 0.65,
        ease: [0.77, 0, 0.175, 1],
      },
    },
  };

  const menuContainerVariants: Variants = {
    closed: {
      transition: {
        staggerChildren: 0.04,
        staggerDirection: -1,
      },
    },
    open: {
      transition: {
        delayChildren: 0.18,
        staggerChildren: 0.07,
      },
    },
  };

  const menuItemVariants: Variants = {
    closed: {
      opacity: 0,
      y: 28,
      transition: { duration: 0.25 },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-white/90 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
          {/* Brand Logo */}
          <Link href="/" onClick={handleLogoClick} className="group flex items-center gap-2.5">
            <motion.div
              whileHover={{ scale: 1.08, rotate: [0, -5, 5, 0] }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/30"
            >
              <Flash size={22} color="#ffffff" variant="Bold" />
            </motion.div>
            <span className="font-sans text-2xl font-extrabold tracking-tight text-foreground transition-colors group-hover:text-primary">
              Quickfiss
            </span>
          </Link>

          {/* Desktop Navigation Links with Smooth Scroll */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="group relative text-sm font-semibold text-muted transition-colors hover:text-primary"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
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
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/choose-role"
                className="flex items-center gap-2 rounded-btn bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all duration-300 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/35"
              >
                Get Started
              </Link>
            </motion.div>
          </div>

          {/* Mobile Hamburger Toggle */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/80 bg-zinc-50 text-foreground transition-colors hover:bg-zinc-100 md:hidden"
            aria-label="Open navigation menu"
          >
            <HambergerMenu size={24} color="#101828" variant="Linear" />
          </motion.button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SENTINEL-STYLE CIRCULAR EXPANSION FULLSCREEN MOBILE OVERLAY */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="sentinel-mobile-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-zinc-950 text-white md:hidden"
          >
            {/* Background glowing ambiences */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />

            {/* Top Bar inside Circular Overlay */}
            <div className="relative z-10 flex h-20 items-center justify-between px-6 border-b border-zinc-800/60">
              <Link
                href="/"
                onClick={handleLogoClick}
                className="flex items-center gap-2.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/40">
                  <Flash size={22} color="#ffffff" variant="Bold" />
                </div>
                <span className="font-sans text-2xl font-extrabold tracking-tight text-white">
                  Quickfiss
                </span>
              </Link>

              {/* Close Button positioned at the circular origin */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.08, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
                aria-label="Close navigation menu"
              >
                <CloseCircle size={24} color="#ffffff" variant="Linear" />
              </motion.button>
            </div>

            {/* Main Navigation Link Stack with Sentinel Stagger */}
            <div className="relative z-10 flex flex-col justify-center px-6 py-8">
              <motion.nav
                variants={menuContainerVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="flex flex-col gap-4"
              >
                {navLinks.map((link) => (
                  <motion.div key={link.label} variants={menuItemVariants}>
                    <Link
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="group flex items-center justify-between border-b border-zinc-800/80 py-3 transition-colors hover:border-primary/50"
                    >
                      <div className="flex items-baseline gap-4">
                        <span className="font-mono text-xs font-bold text-primary">
                          {link.number}
                        </span>
                        <span className="text-2xl font-extrabold tracking-tight text-white transition-transform duration-200 group-hover:translate-x-2 group-hover:text-primary sm:text-3xl">
                          {link.label}
                        </span>
                      </div>
                      <ArrowRight
                        size={20}
                        color="#3d5afe"
                        variant="Linear"
                        className="opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
                      />
                    </Link>
                  </motion.div>
                ))}

                {/* Additional Legal & Safety Links in Mobile Menu */}
                <motion.div variants={menuItemVariants} className="pt-2 flex items-center gap-6 text-xs text-zinc-400">
                  <Link
                    href="/privacy"
                    onClick={(e) => handleNavClick(e, "/privacy")}
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <span className="h-1 w-1 rounded-full bg-zinc-600" />
                  <Link
                    href="/terms"
                    onClick={(e) => handleNavClick(e, "/terms")}
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </motion.div>
              </motion.nav>
            </div>

            {/* Bottom Actions & Trust Banner */}
            <div className="relative z-10 border-t border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-md">
              <div className="flex flex-col gap-3">
                <Link
                  href="/choose-role"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-btn bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-dark"
                >
                  Get Started
                </Link>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-btn border border-zinc-700 bg-white/5 py-3.5 text-sm font-semibold text-white backdrop-blur-xs transition-colors hover:bg-white/10"
                >
                  Sign In
                </Link>
              </div>

              {/* Trust Badge Indicator */}
              <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-zinc-400">
                <ShieldTick size={16} color="#059669" variant="Bold" />
                <span>100% KYC Verified & Paystack Escrow Protected</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
