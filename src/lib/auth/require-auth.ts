
import { User } from "next-auth";
import { auth } from "./auth";

export async function requireAuth(): Promise<User> {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("UNAUTHORIZED");
  }

  return session.user;
}
