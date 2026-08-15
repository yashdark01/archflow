import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ArchFlow — Architecture Diagram Editor",
    template: "%s · ArchFlow",
  },
  description:
    "Design system architecture on an infinite canvas. Diagram-as-code, keyboard shortcuts, and AI — built for developers.",
  keywords: ["architecture", "diagram", "mermaid", "react flow", "system design"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex h-screen min-h-0 flex-col overflow-hidden bg-background text-foreground">
        <TooltipProvider>
          <StoreProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </StoreProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
