import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma/client";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export async function prismaLogin(
  email: string,
  password: string
): Promise<{ user: AuthUser } | { error: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!user || user.password === "django-managed") {
    return { error: "Invalid email or password" };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { error: "Invalid email or password" };
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function prismaRegister(data: {
  name: string;
  email: string;
  password: string;
}): Promise<{ user: AuthUser } | { error: string }> {
  const email = data.email.trim().toLowerCase();
  const name = data.name.trim();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Email already registered" };
  }

  const hashed = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: "EMPLOYEE",
    },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
