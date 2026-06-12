import { djangoLogin, djangoRegister } from "@/lib/django-auth";
import { prismaLogin, prismaRegister, type AuthUser } from "@/lib/prisma-auth";
import { syncUserToPrisma } from "@/lib/sync-user";

function normalizeUrl(url: string) {
  return url.replace(/\/$/, "");
}

function getDjangoApiUrl() {
  return normalizeUrl(process.env.DJANGO_API_URL ?? "http://localhost:8000");
}

function getAppUrl() {
  const url =
    process.env.NEXTAUTH_URL ??
    process.env.AUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return normalizeUrl(url);
}

/** Django runs separately on localhost in dev; production uses Prisma + PostgreSQL. */
export function usesDjangoAuth() {
  const django = getDjangoApiUrl();
  const app = getAppUrl();
  if (django === app) return false;
  return django.includes("localhost") || django.includes("127.0.0.1");
}

export function getDjangoAdminUrl() {
  return `${getDjangoApiUrl()}/admin`;
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
