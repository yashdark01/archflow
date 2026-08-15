import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function DashboardArchivePage() {
  return (
    <AuthGuard>
      <DashboardShell />
    </AuthGuard>
  );
}
