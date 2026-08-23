import { DashboardShell } from "@/components/layout/DashboardShell";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ProfilePage() {
  return (
    <DashboardShell>
      <div className="px-6 py-6">
        <h1 className="text-2xl font-extrabold text-foreground">Profile</h1>
        <EmptyState message="Profile details coming soon." />
      </div>
    </DashboardShell>
  );
}
