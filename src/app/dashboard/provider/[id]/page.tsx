import { ProviderDetailContent } from "./ProviderDetailContent";

export default async function ProviderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProviderDetailContent providerId={id} />;
}
