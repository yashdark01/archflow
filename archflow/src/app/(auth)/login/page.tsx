import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="text-sm text-muted">Authentication is coming in Phase 3.</p>
        <Link href="/editor" className="text-sm font-medium text-primary hover:underline">
          Continue as guest
        </Link>
      </div>
    </div>
  );
}
