import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { apiPath } from "./api-config";
import { APP_PATHS } from "./app-urls";

export async function serverApi<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const session = await auth();

  if (!session?.accessToken || session.user?.role !== "ADMIN") {
    redirect(`${APP_PATHS.adminLogin}?error=session_expired`);
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
        redirect(`${APP_PATHS.adminLogin}?error=session_expired`);
      }
      throw new Error(errorMessage);
    }

    return res.json() as Promise<T>;
  } catch (error) {
    console.error("[serverApi] Backend error:", apiPath(path), error);
    throw error;
  }
}
