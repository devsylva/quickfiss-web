"use client";

import { useEffect } from "react";
import { Heart } from "iconsax-react";
import { useSavedProvidersStore } from "@/store/useSavedProvidersStore";

/** Heart that bookmarks a provider for the signed-in customer. Safe inside a link. */
export function SaveButton({ providerId, size = 20, className = "" }: { providerId: string | number; size?: number; className?: string }) {
  const id = Number(providerId);
  const saved = useSavedProvidersStore((s) => s.ids.has(id));
  const load = useSavedProvidersStore((s) => s.load);
  const toggle = useSavedProvidersStore((s) => s.toggle);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <button
      type="button"
      aria-label={saved ? "Remove from saved" : "Save provider"}
      aria-pressed={saved}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      className={`flex items-center justify-center ${className}`}
    >
      <Heart size={size} color={saved ? "#ef4444" : "#a1a1aa"} variant={saved ? "Bold" : "Linear"} />
    </button>
  );
}
