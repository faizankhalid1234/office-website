/** Admin portal paths (this app runs on port 4000) */
export const APP_PATHS = {
  adminLogin: "/login",
  adminDashboard: "/",
  adminUsers: "/users",
  adminBudget: "/budget",
} as const;

function ensureHttpsUrl(value: string): string {
  const trimmed = value.trim().replace(/\/$/, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function getAdminBaseUrl(): string {
  const url =
    process.env.NEXTAUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_ADMIN_URL?.trim() ||
    "http://localhost:4000";
  return ensureHttpsUrl(url);
}

export function getWebsiteBaseUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_WEBSITE_URL?.trim() ||
    process.env.WEBSITE_URL?.trim() ||
    "http://localhost:3000";
  if (url.includes("localhost")) return url.replace(/\/$/, "");
  return ensureHttpsUrl(url);
}

export function appUrl(path: string, baseUrl?: string): string {
  const base = (baseUrl ?? getAdminBaseUrl()).replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const APP_LINKS = {
  adminLogin: (base?: string) => appUrl(APP_PATHS.adminLogin, base),
  adminUsers: (base?: string) => appUrl(APP_PATHS.adminUsers, base),
  adminBudget: (base?: string) => appUrl(APP_PATHS.adminBudget, base),
  websiteLogin: () => `${getWebsiteBaseUrl()}/auth/login`,
  websiteDashboard: () => `${getWebsiteBaseUrl()}/dashboard`,
} as const;
