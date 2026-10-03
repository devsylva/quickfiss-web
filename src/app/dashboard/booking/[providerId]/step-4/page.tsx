import { BookingFlow } from "../BookingFlow";

export default async function BookingPage({ params }: { params: Promise<{ providerId: string }> }) {
  const { providerId } = await params;
  return <BookingFlow providerId={providerId} step="step-4" />;
}
