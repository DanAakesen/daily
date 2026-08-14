import { randomUUID } from "node:crypto";
import { z } from "zod";
import type { Config } from "./config.js";
import { fetchGmail } from "./clients/gmail.js";
import { googleAccessToken } from "./clients/google-auth.js";
import { fetchGoogleCalendar } from "./clients/google-calendar.js";
import { fetchTickTick } from "./clients/ticktick.js";
import { AttentionPayloadSchema, type AttentionPayload, type CalendarEvent, type GmailItem, type TickTickItem } from "./domain/attention.js";
import { fetchJson, safeError } from "./lib/http.js";

type SourceOk<T> = { status: "ok"; capturedAt: string; items: T[] };
type SourceError = { status: "error"; capturedAt: string; errorCode: string; errorMessage: string };
export type SourceResult<T> = SourceOk<T> | SourceError;

const ingestResponseSchema = z.object({ accepted: z.boolean(), duplicate: z.boolean().optional(), runId: z.string().optional() }).passthrough();

export type RefreshDependencies = {
  gmail: (now: Date) => Promise<GmailItem[]>;
  ticktick: (now: Date) => Promise<TickTickItem[]>;
  calendar: (now: Date) => Promise<CalendarEvent[]>;
};

export async function captureSource<T>(capturedAt: string, fallbackCode: string, operation: () => Promise<T[]>): Promise<SourceResult<T>> {
  try {
    return { status: "ok", capturedAt, items: await operation() };
  } catch (error) {
    return { status: "error", capturedAt, ...safeError(error, fallbackCode) };
  }
}

export async function buildRefreshPayload(dependencies: RefreshDependencies, now = new Date(), requestedRunId?: string): Promise<AttentionPayload> {
  const capturedAt = now.toISOString();
  const runId = requestedRunId || `refresh-${capturedAt}-${randomUUID()}`;
  const [gmail, ticktick, googleCalendar] = await Promise.all([
    captureSource(capturedAt, "gmail_refresh_failed", () => dependencies.gmail(now)),
    captureSource(capturedAt, "ticktick_refresh_failed", () => dependencies.ticktick(now)),
    captureSource(capturedAt, "google_calendar_refresh_failed", () => dependencies.calendar(now)),
  ]);
  return AttentionPayloadSchema.parse({ schemaVersion: 1, runId, idempotencyKey: runId, mode: "refresh", capturedAt, sources: { gmail, ticktick, google_calendar: googleCalendar } });
}

export function productionDependencies(config: Config): RefreshDependencies {
  const googleToken = googleAccessToken({ clientId: config.GOOGLE_CLIENT_ID, clientSecret: config.GOOGLE_CLIENT_SECRET, refreshToken: config.GOOGLE_REFRESH_TOKEN });
  return {
    gmail: async (now) => fetchGmail(await googleToken, config.GOOGLE_ACCOUNT_EMAIL, { endpoint: config.GMAIL_CLASSIFIER_ENDPOINT, apiKey: config.GMAIL_CLASSIFIER_API_KEY, model: config.GMAIL_CLASSIFIER_MODEL }, now),
    ticktick: async (now) => fetchTickTick(config.TICKTICK_ACCESS_TOKEN, now),
    calendar: async (now) => fetchGoogleCalendar(await googleToken, now),
  };
}

export async function submitRefresh(config: Config, payload: AttentionPayload) {
  const endpoint = new URL("/api/attention/ingest", config.DAILY_OVERVIEW_URL);
  return fetchJson(endpoint, { method: "POST", headers: { authorization: `Bearer ${config.ATTENTION_INGEST_BEARER_TOKEN}`, "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(payload) }, ingestResponseSchema, "daily_overview");
}
