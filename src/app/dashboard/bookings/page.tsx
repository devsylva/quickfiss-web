import { DashboardShell } from "@/components/layout/DashboardShell";
import { EmptyState } from "@/components/ui/EmptyState";

export default function BookingsPage() {
  return (
    <DashboardShell>
      <div className="px-6 py-6">
        <h1 className="text-2xl font-extrabold text-foreground">My Bookings</h1>
        <EmptyState message="You have no bookings yet." />
      </div>
    </DashboardShell>
  );
}
