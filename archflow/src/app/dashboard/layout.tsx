import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Files",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex h-full min-h-0 flex-1 flex-col">{children}</div>;
}
