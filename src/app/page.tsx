"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => router.push("/onboarding"), 1600);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-primary-light">
      <h1 className="font-sans text-3xl font-extrabold text-primary lg:text-5xl">Quickfiss</h1>
    </div>
  );
}
