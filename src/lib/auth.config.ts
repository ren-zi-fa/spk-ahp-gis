// lib/auth/auth.config.ts
import { getUsername } from "@/lib/user";
import { LoginSchema } from "@/schema";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  pages: {
    signIn: "/",
    error: "/auth-error",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) return null;

        const { username, password } = validatedFields.data;
        const user = await getUsername(username);

        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        return passwordsMatch ? user : null;
      },
    }),
  ],
} satisfies NextAuthConfig;
