import { AuthGuard } from "@/components/auth/AuthGuard";
import { GuestDiagramMigration } from "@/components/auth/GuestDiagramMigration";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <GuestDiagramMigration />
      <DashboardShell />
    </AuthGuard>
  );
}
