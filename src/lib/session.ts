import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type UserRole = "Developer" | "Tester";

export type AppSessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role: UserRole;
};

export type AppSession = Awaited<ReturnType<typeof getServerSession>> & {
  user: AppSessionUser;
};

export async function getAppSession() {
  const session = await getServerSession(authOptions);
  return session as AppSession | null;
}

export async function requireRole(role: UserRole) {
  const session = await getAppSession();

  if (!session || session.user.role !== role) {
    throw new Error("Unauthorized");
  }

  return session;
}
