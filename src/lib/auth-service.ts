import { djangoLogin, djangoRegister } from "@/lib/django-auth";
import { prismaLogin, prismaRegister, type AuthUser } from "@/lib/prisma-auth";
import { syncUserToPrisma } from "@/lib/sync-user";

/** Set USE_DJANGO_AUTH=true only when Django runs on localhost:8000 */
export function usesDjangoAuth() {
  return process.env.USE_DJANGO_AUTH === "true";
}

export function getDjangoAdminUrl() {
  const base = (process.env.DJANGO_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
  return `${base}/admin`;
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: AuthUser } | { error: string }> {
  if (usesDjangoAuth()) {
    const result = await djangoLogin({ email, password });
    if ("error" in result) return result;

    const prismaUser = await syncUserToPrisma(result.user);
    return {
      user: {
        id: prismaUser.id,
        name: prismaUser.name,
        email: prismaUser.email,
        role: prismaUser.role,
      },
    };
  }

  return prismaLogin(email, password);
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<{ user: AuthUser } | { error: string }> {
  if (usesDjangoAuth()) {
    const result = await djangoRegister(data);
    if ("error" in result) return result;

    const prismaUser = await syncUserToPrisma(result.user);
    return {
      user: {
        id: prismaUser.id,
        name: prismaUser.name,
        email: prismaUser.email,
        role: prismaUser.role,
      },
    };
  }

  return prismaRegister(data);
}
