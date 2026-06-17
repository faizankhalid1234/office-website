import "@/lib/auth-env";
import type { NextAuthConfig } from "next-auth";
import { APP_PATHS } from "@/lib/app-urls";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth-cookies";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: ADMIN_SESSION_COOKIE,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: APP_PATHS.adminLogin,
  },
  providers: [],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user?.role && auth.user.role === "ADMIN";
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.role = user.role;
        if (user.accessToken) token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "EMPLOYEE";
      }
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
};
