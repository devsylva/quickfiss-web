"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@/components/icons";
import { DashboardShell } from "@/components/layout/DashboardShell";

interface ProfileFrameProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  backHref?: string;
  maxWidth?: string;
  headerRight?: React.ReactNode;
  hideHeaderOnDesktop?: boolean;
}

/** Responsive frame layout for profile screens supporting mobile, tablet, and desktop viewports */
export function ProfileFrame({
  title,
  subtitle,
  children,
  backHref = "/dashboard/profile",
  maxWidth = "max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl",
  headerRight,
  hideHeaderOnDesktop = false,
}: ProfileFrameProps) {
  const router = useRouter();

  return (
    <DashboardShell>
      <div className={`mx-auto w-full ${maxWidth} px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8`}>
        {/* Mobile Header (< md) */}
        <div className={`relative flex h-11 items-center justify-between md:hidden ${hideHeaderOnDesktop ? "" : "mb-4"}`}>
          <button
            type="button"
            onClick={() => router.push(backHref)}
            aria-label="Go back"
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-zinc-100 transition-colors"
          >
            <ChevronLeftIcon />
          </button>
          <h1 className="text-base font-bold text-foreground text-center line-clamp-1">{title}</h1>
          <div className="flex h-9 w-9 items-center justify-end">
            {headerRight || <span className="w-4" />}
          </div>
        </div>

        {/* Desktop / Tablet Header (>= md) */}
        {!hideHeaderOnDesktop && (
          <div className="hidden md:flex md:items-center md:justify-between mb-8 pb-5 border-b border-border/60">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push(backHref)}
                className="group flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-white text-muted hover:border-primary hover:text-primary transition-all shadow-2xs"
                aria-label="Back"
                title="Back"
              >
                <ChevronLeftIcon />
              </button>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">{title}</h1>
                {subtitle && <p className="mt-0.5 text-xs text-muted lg:text-sm">{subtitle}</p>}
              </div>
            </div>
            {headerRight && <div>{headerRight}</div>}
          </div>
        )}

        {children}
      </div>
    </DashboardShell>
  );
}

export function Avatar({ src, name, size = 80 }: { src?: string | null; name: string; size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-light font-extrabold text-primary shadow-2xs"
    >
      {src ? (
        <Image src={src} alt="" fill sizes={`${size}px`} className="object-cover" unoptimized />
      ) : (
        <span style={{ fontSize: size / 2.6 }}>{name.charAt(0).toUpperCase() || "Q"}</span>
      )}
    </div>
  );
}
