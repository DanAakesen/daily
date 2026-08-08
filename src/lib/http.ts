import type { z } from "zod";

const HTTP_TIMEOUT_MS = 30_000;
const MAX_HTTP_ATTEMPTS = 3;

export class ExternalServiceError extends Error {
  constructor(public readonly code: string, message: string, public readonly status?: number) {
    super(message);
    this.name = "ExternalServiceError";
  }
}

export async function fetchJson<T>(url: string | URL, init: RequestInit, schema: z.ZodType<T>, service: string): Promise<T> {
  const response = await requestWithRetry(url, init, service);
  const body = await response.text();
  if (!response.ok) throw new ExternalServiceError(`${service}_http_${response.status}`, `${service} returned HTTP ${response.status}`, response.status);
  let value: unknown;
  try {
    value = JSON.parse(body);
  } catch {
    throw new ExternalServiceError(`${service}_invalid_json`, `${service} returned invalid JSON`);
  }
  const parsed = schema.safeParse(value);
  if (!parsed.success) throw new ExternalServiceError(`${service}_invalid_response`, `${service} returned an unsupported response shape`);
  return parsed.data;
}

async function requestWithRetry(url: string | URL, init: RequestInit, service: string): Promise<Response> {
  for (let attempt = 1; attempt <= MAX_HTTP_ATTEMPTS; attempt += 1) {
    const timeout = AbortSignal.timeout(HTTP_TIMEOUT_MS);
    const signal = init.signal ? AbortSignal.any([init.signal, timeout]) : timeout;
    try {
      const response = await fetch(url, { ...init, signal });
      const retryable = response.status === 429 || response.status >= 500;
      if (!retryable || attempt === MAX_HTTP_ATTEMPTS) return response;
    } catch (error) {
      if (attempt === MAX_HTTP_ATTEMPTS) throw new ExternalServiceError(`${service}_network_error`, `${service} request failed after ${MAX_HTTP_ATTEMPTS} attempts`);
      if (error instanceof Error && error.name !== "AbortError" && error.name !== "TimeoutError") throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** (attempt - 1) + Math.floor(Math.random() * 100)));
  }
  throw new ExternalServiceError(`${service}_retry_exhausted`, `${service} request retries were exhausted`);
}

export function safeError(error: unknown, fallbackCode: string): { errorCode: string; errorMessage: string } {
  if (error instanceof ExternalServiceError) return { errorCode: error.code, errorMessage: error.message };
  if (error instanceof Error) return { errorCode: fallbackCode, errorMessage: error.message.slice(0, 1000) };
  return { errorCode: fallbackCode, errorMessage: "Unknown source failure" };
}
