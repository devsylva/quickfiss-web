"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@/components/icons";

export const BackButton = () => {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Go back"
      className="mb-6 flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-zinc-100"
    >
      <ChevronLeftIcon />
    </button>
  );
};
