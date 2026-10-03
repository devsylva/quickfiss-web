"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home2,
  Calendar,
  Wallet2,
  Sms,
  Profile,
  Notification,
  Location,
  ArrowDown2,
  ArrowRight2,
  ArrowLeft2,
} from "iconsax-react";

import { useAuthStore } from "@/store/useAuthStore";
import { useRoleSwitcher } from "@/hooks/useRoleSwitcher";
import { useProviderOnline } from "@/hooks/useProviderOnline";

interface DashboardShellProps {
  children: React.ReactNode;
  address?: string;
}

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home2 },
  { href: "/dashboard/bookings", label: "My Bookings", icon: Calendar },
  { href: "/dashboard/wallet", label: "Wallet", icon: Wallet2 },
  { href: "/dashboard/chats", label: "Chats", icon: Sms },
  { href: "/dashboard/profile", label: "Profile", icon: Profile },
];

export const DashboardShell: React.FC<DashboardShellProps> = ({ children, address }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const { activeRole } = useAuthStore();
  const switchRole = useRoleSwitcher();
  const { isOnline, setOnline } = useProviderOnline();

  const NavButton = ({
    href,
    label,
    icon: Icon,
    expanded: rowLayout,
  }: (typeof navItems)[number] & { expanded: boolean }) => {
    const active = pathname === href;
    return (
      <button
        type="button"
        onClick={() => router.push(href)}
        title={!rowLayout ? label : undefined}
        className={`group relative flex shrink-0 items-center transition-all duration-200 ${
          rowLayout
            ? `w-full justify-start gap-3 rounded-input px-3.5 py-3 ${
                active
                  ? "bg-primary-light text-primary font-semibold"
                  : "text-muted hover:bg-zinc-100 hover:text-foreground"
              }`
            : `flex-col gap-1 rounded-xl px-2 py-2 lg:w-full lg:py-2.5 ${
                active
                  ? "bg-primary-light text-primary font-semibold"
                  : "text-muted hover:bg-zinc-100 hover:text-foreground"
              }`
        }`}
      >
        <Icon
          size={22}
          color={active ? "#3d5afe" : "#71717a"}
          variant={active ? "Bold" : "Linear"}
          className="transition-transform duration-200 group-hover:scale-105"
        />
        <span
          className={`whitespace-nowrap ${rowLayout ? "text-sm" : "text-xs"} ${
            active ? "font-semibold text-primary" : "text-muted group-hover:text-foreground"
          }`}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-white lg:flex-row">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden shrink-0 flex-col justify-between border-r border-border bg-white py-6 transition-[width] duration-300 lg:flex ${
          expanded ? "lg:w-60 lg:px-4" : "lg:w-22 lg:items-center lg:px-2"
        }`}
      >
        <div className="flex w-full flex-col gap-2">
          <div className={`mb-6 flex items-center ${expanded ? "justify-between px-2" : "justify-center"}`}>
            <span
              className={`overflow-hidden whitespace-nowrap text-xl font-extrabold tracking-tight text-primary transition-all duration-300 ${
                expanded ? "max-w-[140px] opacity-100" : "max-w-0 opacity-0"
              }`}
            >
              Quickfiss
            </span>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-input text-zinc-400 hover:bg-zinc-100 hover:text-foreground transition-colors"
            >
              {expanded ? (
                <ArrowLeft2 size={18} color="#71717a" variant="Linear" />
              ) : (
                <ArrowRight2 size={18} color="#71717a" variant="Linear" />
              )}
            </button>
          </div>

          <nav className="flex flex-col gap-1.5 w-full">
            {navItems.map((item) => (
              <NavButton key={item.href} {...item} expanded={expanded} />
            ))}
          </nav>
        </div>

        {/* Sidebar bottom profile shortcut on desktop */}
        <div className="w-full border-t border-border pt-4">
          {/* Role switcher pill in expanded sidebar */}
          {expanded && (
            <div className="mb-3 px-2">
              <div className="flex items-center rounded-xl bg-zinc-100 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => switchRole("customer")}
                  className={`flex-1 rounded-lg py-1.5 text-center font-bold transition-all ${
                    activeRole === "customer"
                      ? "bg-white text-foreground shadow-2xs"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => switchRole("provider")}
                  className={`flex-1 rounded-lg py-1.5 text-center font-bold transition-all ${
                    activeRole === "provider"
                      ? "bg-primary text-white shadow-2xs"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  Provider
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => router.push("/dashboard/profile")}
            className={`flex w-full items-center rounded-input transition-colors hover:bg-zinc-100 ${
              expanded ? "gap-3 px-3 py-2.5 text-left" : "justify-center p-2"
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary">
              {activeRole === "provider" ? "P" : "Q"}
            </div>
            {expanded && (
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-xs font-semibold text-foreground">
                  {activeRole === "provider" ? "Provider Account" : "My Profile"}
                </span>
                <span className="truncate text-[11px] text-muted">
                  {activeRole === "provider" ? (isOnline ? "Online · Ready" : "Offline") : "View account"}
                </span>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-white px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => {
              if (activeRole === "provider") {
                router.push("/dashboard/location");
              }
            }}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-100"
          >
            <Location size={18} color="#3d5afe" variant="Bold" />
            <span className="max-w-[140px] truncate sm:max-w-[240px] lg:max-w-[280px]">
              {address || (activeRole === "provider" ? "Set your service area" : "Set your location")}
            </span>
            <ArrowDown2 size={14} color="#a1a1aa" />
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Header Role Switcher Pill */}
            <div className="flex items-center rounded-xl bg-zinc-100 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => switchRole("customer")}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all sm:text-xs ${
                  activeRole === "customer"
                    ? "bg-white text-foreground shadow-2xs"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => switchRole("provider")}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all sm:text-xs ${
                  activeRole === "provider"
                    ? "bg-primary text-white shadow-2xs"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Provider
              </button>
            </div>

            {/* Provider Online/Offline Toggle in Header */}
            {activeRole === "provider" && (
              <div className="hidden items-center gap-2 rounded-xl border border-border/80 bg-zinc-50/70 px-2.5 py-1 md:flex">
                <button
                  type="button"
                  onClick={() => setOnline(!isOnline)}
                  title={isOnline ? "Switch to Offline" : "Switch to Online"}
                  className={`relative flex h-5 w-9 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ${
                    isOnline ? "bg-primary" : "bg-zinc-300"
                  }`}
                >
                  <span
                    className={`h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform duration-200 ${
                      isOnline ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-[11px] font-bold text-foreground">
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            )}

            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-foreground"
            >
              <Notification size={19} color="#171717" variant="Linear" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </button>

            <div className="hidden items-center gap-2 border-l border-border pl-3 sm:flex">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                {activeRole === "provider" ? "P" : "Q"}
                {activeRole === "provider" && (
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                      isOnline ? "bg-emerald-500" : "bg-zinc-400"
                    }`}
                  />
                )}
              </div>
              <span className="text-xs font-bold text-foreground capitalize">
                {activeRole === "provider" ? "Provider" : "Customer"}
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Mobile Bottom Navigation */}
        <nav className="flex items-center justify-around border-t border-border bg-white py-2 lg:hidden">
          {navItems.map((item) => (
            <NavButton key={item.href} {...item} expanded={false} />
          ))}
        </nav>
      </div>
    </div>
  );
};
