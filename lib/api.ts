export function getApiBaseUrl(): string {
  const env = (process.env.NEXT_PUBLIC_API_URL || "").trim();
  if (typeof window !== "undefined") {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    // If running in browser on Vercel or any live domain, never allow localhost/127.0.0.1 URL
    if (!isLocalhost && (env.includes("localhost") || env.includes("127.0.0.1") || env.includes("0.0.0.0"))) {
      return "";
    }
  }
  return env;
}

export const API_URL = getApiBaseUrl();

const TOKEN_KEY = "excelupai_token";
const USER_KEY = "excelupai_user";

export type Role =
  | "trainee"
  | "trainer"
  | "employer"
  | "provider"
  | "officer"
  | "admin";

export type SessionUser = {
  id: number;
  role: Role;
  email: string;
  name: string;
  headline?: string;
  provider_id?: number | null;
  company_id?: number | null;
  provider?: { name: string; kind: string; city: string } | null;
  company?: { name: string; verified: boolean } | null;
  profile?: Record<string, unknown>;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function setSession(token: string, user: SessionUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function api<T = unknown>(
  path: string,
  options: { method?: string; body?: unknown; formData?: FormData } = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!options.formData) headers["Content-Type"] = "application/json";

  const baseUrl = getApiBaseUrl();
  const cleanPath =
    path.startsWith("/api/") || path === "/api"
      ? path
      : `/api${path.startsWith("/") ? path : `/${path}`}`;

  let res: Response;
  try {
    res = await fetch(`${baseUrl}${cleanPath}`, {
      method: options.method ?? "GET",
      headers,
      body: options.formData ?? (options.body !== undefined ? JSON.stringify(options.body) : undefined),
    });
  } catch (err: any) {
    throw new ApiError(0, err?.message || "Network request failed. Please check your connection.");
  }

  if (!res.ok) {
    let detail = "";
    try {
      const j = await res.json();
      detail = typeof j.detail === "string" ? j.detail : JSON.stringify(j.detail ?? j);
    } catch {
      detail = res.statusText;
    }
    if (!detail) {
      detail = res.status === 401 ? "Invalid email or password" : `Request failed (HTTP ${res.status})`;
    }
    if (res.status === 401) clearSession();
    throw new ApiError(res.status, detail);
  }

  return res.json() as Promise<T>;
}
