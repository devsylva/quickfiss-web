import { notFound } from "next/navigation";
import { getProviderById } from "@/lib/sampleProviders";
import { BookingStep1Content } from "./BookingStep1Content";

export default async function BookingStep1Page({ params }: { params: Promise<{ providerId: string }> }) {
  const { providerId } = await params;
  const provider = getProviderById(providerId);
  if (!provider) notFound();
  return <BookingStep1Content provider={provider} />;
}
