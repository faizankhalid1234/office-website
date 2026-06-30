import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { apiPath } from "./api-config";

const SESSION_EXPIRED_CALLBACK = encodeURIComponent("/auth/login?error=session_expired");
const SIGN_OUT_URL = `/api/auth/signout?callbackUrl=${SESSION_EXPIRED_CALLBACK}`;

export async function serverApi<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const session = await auth();

  if (!session?.accessToken) {
    redirect(SIGN_OUT_URL);
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${session.accessToken}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const res = await fetch(apiPath(path), {
      ...init,
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const errorMessage = (body as { error?: string }).error ?? `API error ${res.status}`;

      if (res.status === 401 || res.status === 403) {
        redirect(SIGN_OUT_URL);
      }

      throw new Error(errorMessage);
    }

    return res.json() as Promise<T>;
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("[serverApi] Backend error:", apiPath(path), error);
    throw error;
  }
}

export async function serverApiPublic<T>(path: string): Promise<T> {
  try {
    const res = await fetch(apiPath(path), { cache: "no-store" });
    if (!res.ok) throw new Error("API request failed");
    return res.json() as Promise<T>;
  } catch (error) {
    console.error("[serverApiPublic] Backend unreachable:", apiPath(path), error);
    throw new Error(
      "Cannot connect to backend API. Start it with: npm run dev:backend (port 5000)"
    );
  }
}
