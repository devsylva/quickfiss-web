import { notFound } from "next/navigation";
import { getProviderById } from "@/lib/sampleProviders";
import { BookingStep2Content } from "./BookingStep2Content";

export default async function BookingStep2Page({ params }: { params: Promise<{ providerId: string }> }) {
  const { providerId } = await params;
  const provider = getProviderById(providerId);
  if (!provider) notFound();
  return <BookingStep2Content provider={provider} />;
}
