import { notFound } from "next/navigation";
import { getProviderById } from "@/lib/sampleProviders";
import { BookingStep3Content } from "./BookingStep3Content";

export default async function BookingStep3Page({ params }: { params: Promise<{ providerId: string }> }) {
  const { providerId } = await params;
  const provider = getProviderById(providerId);
  if (!provider) notFound();
  return <BookingStep3Content provider={provider} />;
}
