import "@/lib/auth-env";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { loginUser } from "@/lib/auth-service";
import { loginSchema } from "@/lib/validations";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const parsed = loginSchema.safeParse({
            email: String(credentials?.email ?? "").trim().toLowerCase(),
            password: credentials?.password,
          });
          if (!parsed.success) return null;

          const result = await loginUser(parsed.data.email, parsed.data.password);
          if ("error" in result) return null;

          return {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
          };
        } catch (error) {
          console.error("[auth] Login failed:", error);
          return null;
        }
      },
    }),
  ],
});
