import { getPcPartsApiBaseUrl } from "@/lib/pc-parts-api";
import { getStoredToken } from "@/lib/auth-storage";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
};

export async function pcPartsRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, auth = false } = options;
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getStoredToken();
    if (!token) {
      throw new Error("Нэвтрэх шаардлагатай");
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${getPcPartsApiBaseUrl()}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const text = await res.text();
  let parsed: unknown;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`PC Parts API: invalid JSON (${res.status})`);
  }

  const envelope = parsed as ApiEnvelope<T>;
  if (!res.ok) {
    const msg =
      envelope?.message ||
      (typeof envelope === "object" &&
      envelope !== null &&
      "error" in envelope &&
      typeof (envelope as { error?: string }).error === "string"
        ? (envelope as { error: string }).error
        : text) ||
      res.statusText;
    throw new Error(`PC Parts API ${res.status}: ${msg}`);
  }

  if (
    envelope &&
    typeof envelope === "object" &&
    "success" in envelope &&
    envelope.success === false
  ) {
    throw new Error(envelope.message || "Request failed");
  }

  return parsed as T;
}
