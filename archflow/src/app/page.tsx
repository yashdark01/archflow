import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Layers, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="glass-nav sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-lg font-bold tracking-tight">
            ArchFlow
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Login
            </Link>
            <Button size="sm" render={<Link href="/dashboard" />}>
              Open Dashboard
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-12 sm:px-6 sm:py-24">
        <section className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="space-y-6">
            <Badge variant="outline" className="border-primary/30 text-primary">
              Eraser-inspired · Open source
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Design architecture{" "}
              <span className="text-primary">the way you think</span>
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
              A fast, keyboard-friendly diagram editor for developers. Infinite canvas,
              diagram-as-code, and AI — built for system design workflows.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" render={<Link href="/dashboard" />}>
                Open Dashboard
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                render={
                  <a
                    href="https://github.com/Yash-Patidar"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <Code2 className="size-4" />
                GitHub
              </Button>
            </div>
          </div>

          <div className="card-surface p-6 shadow-md">
            <p className="section-label mb-4">Features</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureCard
                icon={<Layers className="size-4 text-yash-cyan" />}
                title="Visual canvas"
                description="Drag services, databases, queues, and more onto an infinite canvas."
              />
              <FeatureCard
                icon={<Sparkles className="size-4 text-yash-violet" />}
                title="Diagram-as-code"
                description="Two-way Mermaid sync for Git-friendly architecture docs."
                badge="Phase 2"
              />
              <FeatureCard
                title="Keyboard-first"
                description="Undo, copy, paste, export — all without touching the mouse."
              />
              <FeatureCard
                title="AI generation"
                description="Describe your system and get a diagram in seconds."
                badge="Coming soon"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>ArchFlow — MIT License · by Yash Patidar</p>
          <a
            href="https://yashpatidar.vercel.app"
            className="transition hover:text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            yashpatidar.vercel.app
          </a>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  badge,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background/50 p-4 transition hover:border-border-strong">
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <h2 className="font-semibold">{title}</h2>
        {badge ? (
          <Badge variant="secondary" className="text-yash-amber">
            {badge}
          </Badge>
        ) : null}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
