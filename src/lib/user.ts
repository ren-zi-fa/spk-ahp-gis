import { prisma } from "./database";

export const getUsername = async (username: string) => {
  try {
    const user = await prisma.user.findFirst({ where: { username } });
    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
};
