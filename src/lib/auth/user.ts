// lib/user.ts
import { prisma } from "../database";

export const getUsername = async (username: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { username },
    });
    return user;
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  } catch (error) {
    console.error("Failed to get user by ID:", error);
    return null;
  }
};
