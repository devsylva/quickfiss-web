import { notFound } from "next/navigation";
import { getProviderById } from "@/lib/sampleProviders";
import { BookingStep4Content } from "./BookingStep4Content";

export default async function BookingStep4Page({ params }: { params: Promise<{ providerId: string }> }) {
  const { providerId } = await params;
  const provider = getProviderById(providerId);
  if (!provider) notFound();
  return <BookingStep4Content provider={provider} />;
}
