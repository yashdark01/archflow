"use client";

import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

interface RegisterFormProps {
  callbackUrl?: string;
}

export function RegisterForm({ callbackUrl = "/dashboard" }: RegisterFormProps) {
  return (
    <div className="w-full max-w-md space-y-4">
      <LoginForm callbackUrl={callbackUrl} />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
