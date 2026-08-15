"use client";

import { useEffect, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/dashboard");
    }
  }, [router, status]);

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  return children;
}
