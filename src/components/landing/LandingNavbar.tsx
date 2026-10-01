"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HambergerMenu, CloseCircle, Flash, ShieldTick } from "iconsax-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { label: "Services", href: "/#categories" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Why Quickfiss", href: "/#features" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  // Lock body scroll only while menu is actively visible
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
    setMobileMenuOpen(false);

    if (href.startsWith("/#") || href.startsWith("#")) {
      const id = href.replace(/^\/?#/, "");
      if (pathname === "/" || pathname === "") {
        e.preventDefault();
        // Give a slight frame delay for the overlay exit to unblock and smooth scroll to exact position
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            const navOffset = 84;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
            window.history.pushState(null, "", `#${id}`);
          }
        }, 80);
      } else {
        // Navigating from another page back to anchor on homepage
        e.preventDefault();
        router.push(href);
      }
    } else if (href === pathname || (href === "/" && pathname === "/")) {
      e.preventDefault();
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 80);
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false);
    if (pathname === "/" || pathname === "") {
      e.preventDefault();
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
    }
  };

  // Sentinel Circular Reveal Variants (Clean White Background)
  const overlayVariants: Variants = {
    closed: {
      clipPath: "circle(0px at calc(100% - 36px) 40px)",
      transition: {
        duration: 0.4,
        ease: [0.77, 0, 0.175, 1],
      },
    },
    open: {
      clipPath: "circle(160% at calc(100% - 36px) 40px)",
      transition: {
        duration: 0.6,
        ease: [0.77, 0, 0.175, 1],
      },
    },
  };

  const menuContainerVariants: Variants = {
    closed: {
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1,
      },
    },
    open: {
      transition: {
        delayChildren: 0.15,
        staggerChildren: 0.06,
      },
    },
  };

  const menuItemVariants: Variants = {
    closed: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
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
      {/* SENTINEL-STYLE CIRCULAR EXPANSION FULLSCREEN MOBILE OVERLAY (CLEAN WHITE) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="sentinel-mobile-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-white text-foreground md:hidden"
          >
            {/* Top Bar inside Circular Overlay */}
            <div className="relative z-10 flex h-20 shrink-0 items-center justify-between px-6 border-b border-border/60">
              <Link
                href="/"
                onClick={handleLogoClick}
                className="flex items-center gap-2.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/30">
                  <Flash size={22} color="#ffffff" variant="Bold" />
                </div>
                <span className="font-sans text-2xl font-extrabold tracking-tight text-foreground">
                  Quickfiss
                </span>
              </Link>

              {/* Close Button positioned at circular origin */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.08, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-zinc-100 text-foreground transition-colors hover:bg-zinc-200"
                aria-label="Close navigation menu"
              >
                <CloseCircle size={24} color="#101828" variant="Linear" />
              </motion.button>
            </div>

            {/* Main Navigation: Centered on screen, No numbers */}
            <div className="relative z-10 my-auto flex flex-1 flex-col items-center justify-center px-6 py-8">
              <motion.nav
                variants={menuContainerVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="flex w-full flex-col items-center justify-center text-center gap-6"
              >
                {navLinks.map((link) => (
                  <motion.div key={link.label} variants={menuItemVariants}>
                    <Link
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="group block text-2xl font-extrabold tracking-tight text-foreground transition-colors hover:text-primary sm:text-3xl"
                    >
                      <span>{link.label}</span>
                    </Link>
                  </motion.div>
                ))}

                {/* Additional Legal & Safety Links (Centered) */}
                <motion.div
                  variants={menuItemVariants}
                  className="mt-4 flex items-center justify-center gap-6 border-t border-border/60 pt-6 text-xs font-semibold text-muted"
                >
                  <Link
                    href="/privacy"
                    onClick={(e) => handleNavClick(e, "/privacy")}
                    className="hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
                  <Link
                    href="/terms"
                    onClick={(e) => handleNavClick(e, "/terms")}
                    className="hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </Link>
                </motion.div>
              </motion.nav>
            </div>

            {/* Bottom Actions & Trust Banner */}
            <div className="relative z-10 shrink-0 border-t border-border/60 bg-zinc-50/80 p-6">
              <div className="flex flex-col gap-3">
                <Link
                  href="/choose-role"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-btn bg-primary py-3.5 text-sm font-bold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark"
                >
                  Get Started
                </Link>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-btn border border-border bg-white py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-zinc-100"
                >
                  Sign In
                </Link>
              </div>

              {/* Trust Badge Indicator */}
              <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted">
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
