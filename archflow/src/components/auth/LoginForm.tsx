"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  callbackUrl?: string;
}

export function LoginForm({ callbackUrl = "/dashboard" }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const devCredentialsEnabled = process.env.NEXT_PUBLIC_AUTH_DEV_CREDENTIALS === "true";

  const handleEmailSignIn = async () => {
    setError(null);
    setMessage(null);
    setPending(true);

    const result = await signIn("email", {
      email: email.trim(),
      callbackUrl,
      redirect: false,
    });

    setPending(false);

    if (result?.error) {
      setError("Could not send magic link. Check your email and try again.");
      return;
    }

    setMessage("Check your email for a sign-in link. In dev, see the server console.");
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    await signIn("google", { callbackUrl });
  };

  const handleDevSignIn = async () => {
    setError(null);
    setPending(true);

    const result = await signIn("dev-credentials", {
      email: email.trim() || "dev@archflow.local",
      password: password || "dev",
      callbackUrl,
      redirect: false,
    });

    setPending(false);

    if (result?.error) {
      setError("Dev sign-in failed. Use dev@archflow.local / dev");
      return;
    }

    if (result?.url) {
      window.location.href = result.url;
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Save diagrams to your account and sync across devices.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
        </div>

        {devCredentialsEnabled ? (
          <div className="space-y-2">
            <Label htmlFor="password">Password (dev only)</Label>
            <Input
              id="password"
              type="password"
              placeholder="dev"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
        ) : null}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}

        <Button
          type="button"
          className="w-full"
          disabled={pending || !email.trim()}
          onClick={handleEmailSignIn}
        >
          Send magic link
        </Button>

        {devCredentialsEnabled ? (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={pending}
            onClick={handleDevSignIn}
          >
            Dev sign-in
          </Button>
        ) : null}

        <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn}>
          Continue with Google
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        No account needed to try the editor.{" "}
        <Link href="/editor" className="font-medium text-primary hover:underline">
          Continue as guest
        </Link>
      </p>
    </div>
  );
}
