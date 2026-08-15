import { RegisterForm } from "@/components/auth/RegisterForm";

interface RegisterPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { callbackUrl } = await searchParams;

  return <RegisterForm callbackUrl={callbackUrl ?? "/dashboard"} />;
}
