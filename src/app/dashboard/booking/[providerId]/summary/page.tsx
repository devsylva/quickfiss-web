import { notFound } from "next/navigation";
import { getProviderById } from "@/lib/sampleProviders";
import { BookingSummaryContent } from "./BookingSummaryContent";

export default async function BookingSummaryPage({ params }: { params: Promise<{ providerId: string }> }) {
  const { providerId } = await params;
  const provider = getProviderById(providerId);
  if (!provider) notFound();
  return <BookingSummaryContent provider={provider} />;
}
