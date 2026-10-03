"use client";

import { useRouter } from "next/navigation";
import { ProviderLocationModal } from "@/components/dashboard/ProviderLocationModal";

export default function ProviderLocationPage() {
  const router = useRouter();

  return (
    <ProviderLocationModal
      isOpen={true}
      onClose={() => router.push("/dashboard")}
      onSaveLocation={(address) => {
        router.push(`/dashboard?address=${encodeURIComponent(address)}`);
      }}
    />
  );
}
