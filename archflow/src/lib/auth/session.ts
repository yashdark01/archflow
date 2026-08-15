import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import type { AuthUser } from "@/types/auth";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireAuthUser(): Promise<AuthUser | null> {
  const session = await getSession();
  if (!session?.user?.id) {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };
}
