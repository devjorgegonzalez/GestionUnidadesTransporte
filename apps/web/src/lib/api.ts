const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:10102/api/v1";

export class ApiError extends Error {
  statusCode: number;
  data?: unknown;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ut_access_token");
}

export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("ut_access_token", token);
}

export function removeStoredToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("ut_access_token");
  localStorage.removeItem("ut_user_profile");
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const text = await response.text();
  let json: Record<string, unknown> | null = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!response.ok) {
    let errorMsg = `Error HTTP ${response.status}`;
    if (json && typeof json.message === "string") {
      errorMsg = json.message;
    } else if (json && Array.isArray(json.message)) {
      errorMsg = json.message.join(", ");
    }
    throw new ApiError(errorMsg, response.status, json);
  }

  // Desempaquetar { data: ... } si viene del interceptor estándar
  if (json && "data" in json) {
    return json.data as T;
  }

  return (json as T) ?? ({} as T);
}
