const DJANGO_API_URL = (
  process.env.DJANGO_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");
const FETCH_TIMEOUT = 8000;

async function fetchWithTimeout(url: string, options: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export interface DjangoUser {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
}

export async function djangoRegister(data: {
  name: string;
  email: string;
  password: string;
}): Promise<{ user: DjangoUser } | { error: string }> {
  try {
    const res = await fetchWithTimeout(`${DJANGO_API_URL}/api/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      }),
    });

    const body = await res.json();
    if (!res.ok) {
      return { error: body.error ?? "Registration failed" };
    }
    return { user: body.user };
  } catch {
    return { error: "Cannot connect to auth server. Is Django running?" };
  }
}

export async function djangoLogin(data: {
  email: string;
  password: string;
}): Promise<{ user: DjangoUser } | { error: string }> {
  try {
    const res = await fetchWithTimeout(`${DJANGO_API_URL}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      }),
    });

    const body = await res.json();
    if (!res.ok) {
      return { error: body.error ?? "Invalid email or password" };
    }
    return { user: body.user };
  } catch {
    return { error: "Cannot connect to auth server. Is Django running?" };
  }
}
