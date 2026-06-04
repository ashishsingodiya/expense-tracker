import { getSessionCookie, verifySession } from "./session";

export async function getCurrentUserId(): Promise<string | null> {
  const token = await getSessionCookie();
  if (!token) return null;

  const session = await verifySession(token);
  return session?.userId || null;
}

export async function getCurrentUser() {
  const token = await getSessionCookie();
  if (!token) return null;

  const session = await verifySession(token);
  if (!session) return null;

  return {
    userId: session.userId,
    email: session.email,
  };
}
