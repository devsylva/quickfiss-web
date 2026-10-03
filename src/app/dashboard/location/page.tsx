"use client";

import { useRouter } from "next/navigation";
import { ProviderLocationModal } from "@/components/dashboard/ProviderLocationModal";
import { saveServiceArea } from "@/lib/serviceArea";

export default function ProviderLocationPage() {
  const router = useRouter();

  return (
    <ProviderLocationModal
      isOpen={true}
      onClose={() => router.push("/dashboard")}
      onSaveLocation={async (address, coords) => {
        try {
          await saveServiceArea(address, coords);
        } catch {
          // the dashboard shows the saved value; if saving failed it keeps the old one
        }
        router.push(`/dashboard?address=${encodeURIComponent(address)}`);
      }}
    />
  );
}
