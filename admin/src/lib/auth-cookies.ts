/** Admin-only session cookie (separate from employee website on port 3000). */
export const ADMIN_SESSION_COOKIE = "admin-auth.session-token";

/** Default Auth.js cookies shared across localhost ports — not used by admin. */
const SHARED_AUTH_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
] as const;

export function clearSharedAuthCookies(response: {
  cookies: {
    set: (
      name: string,
      value: string,
      options?: { path?: string; maxAge?: number }
    ) => void;
  };
}) {
  for (const name of SHARED_AUTH_COOKIES) {
    response.cookies.set(name, "", { path: "/", maxAge: 0 });
  }
}

export function isValidAdminToken(
  token: { role?: string; accessToken?: unknown } | null
): token is { role: "ADMIN"; accessToken: string } {
  return token?.role === "ADMIN" && typeof token.accessToken === "string";
}
