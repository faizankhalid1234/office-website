import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

/** Edge-safe middleware — do NOT import auth.ts here (it loads Prisma/bcrypt). */
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
