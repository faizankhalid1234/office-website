import { prisma } from "@/lib/prisma";
import type { DjangoUser } from "@/lib/django-auth";

/**
 * Sync Django user into Prisma so expenses can link to userId.
 * Django owns passwords — Prisma stores a placeholder password.
 */
export async function syncUserToPrisma(djangoUser: DjangoUser) {
  const email = djangoUser.email.trim().toLowerCase();

  return prisma.user.upsert({
    where: { email },
    update: {
      name: djangoUser.name,
      role: djangoUser.role,
    },
    create: {
      email,
      name: djangoUser.name,
      role: djangoUser.role,
      password: "django-managed",
    },
  });
}
