// lib/require-auth.ts
import { auth } from "@/lib/auth";
import { User } from "next-auth";

export async function requireAuth(): Promise<User> {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("UNAUTHORIZED");
  }

  return session.user;
}
