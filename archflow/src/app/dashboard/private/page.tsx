import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function DashboardPrivatePage() {
  return (
    <AuthGuard>
      <DashboardShell />
    </AuthGuard>
  );
}
