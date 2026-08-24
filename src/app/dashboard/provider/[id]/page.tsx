import { notFound } from "next/navigation";
import { getProviderById } from "@/lib/sampleProviders";
import { ProviderDetailContent } from "./ProviderDetailContent";

export default async function ProviderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const provider = getProviderById(id);
  if (!provider) notFound();
  return <ProviderDetailContent provider={provider} />;
}
