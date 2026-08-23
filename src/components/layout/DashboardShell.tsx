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
        className={`flex shrink-0 items-center transition-colors ${
          rowLayout ? "w-full justify-start gap-3 rounded-input px-4 py-3" : "flex-col gap-1 px-3 py-1.5 lg:w-full lg:py-3"
        }`}
      >
        <Icon size={22} color={active ? "#3d5afe" : "#a1a1aa"} variant={active ? "Bold" : "Linear"} />
        <span
          className={`whitespace-nowrap ${rowLayout ? "text-sm" : "text-xs"} ${
            active ? "font-semibold text-primary" : "text-muted"
          }`}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-white lg:flex-row">
      <div
        className={`hidden shrink-0 flex-col border-r border-border py-6 transition-[width] duration-300 lg:flex lg:gap-2 ${
          expanded ? "lg:w-56 lg:items-stretch lg:px-3" : "lg:w-24 lg:items-center"
        }`}
      >
        <div className={`mb-4 flex items-center ${expanded ? "justify-between" : "justify-center"}`}>
          <span
            className={`overflow-hidden whitespace-nowrap text-lg font-extrabold text-primary transition-all duration-300 ${
              expanded ? "max-w-[140px] opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            Quickfiss
          </span>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-input text-zinc-400 hover:bg-zinc-100"
          >
            {expanded ? (
              <ArrowLeft2 size={18} color="#a1a1aa" variant="Linear" />
            ) : (
              <ArrowRight2 size={18} color="#a1a1aa" variant="Linear" />
            )}
          </button>
        </div>
        {navItems.map((item) => (
          <NavButton key={item.href} {...item} expanded={expanded} />
        ))}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <button type="button" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Location size={18} color="#3d5afe" variant="Bold" />
            <span className="max-w-[220px] truncate">{address || "Set your location"}</span>
            <ArrowDown2 size={14} color="#a1a1aa" />
          </button>
          <Notification size={22} color="#171717" variant="Linear" />
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>

        <div className="flex items-center justify-around border-t border-border py-2 lg:hidden">
          {navItems.map((item) => (
            <NavButton key={item.href} {...item} expanded={false} />
          ))}
        </div>
      </div>
    </div>
  );
};
