import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { djangoLogin } from "@/lib/django-auth";
import { syncUserToPrisma } from "@/lib/sync-user";
import { loginSchema } from "@/lib/validations";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse({
          email: String(credentials?.email ?? "").trim().toLowerCase(),
          password: credentials?.password,
        });
        if (!parsed.success) return null;

        const result = await djangoLogin({
          email: parsed.data.email,
          password: parsed.data.password,
        });

        if ("error" in result) return null;

        const prismaUser = await syncUserToPrisma(result.user);

        return {
          id: prismaUser.id,
          name: prismaUser.name,
          email: prismaUser.email,
          role: prismaUser.role,
        };
      },
    }),
  ],
});
