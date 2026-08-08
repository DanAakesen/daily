import { z } from "zod";
import type { CalendarEvent } from "../domain/attention.js";
import { fetchJson } from "../lib/http.js";

const calendarListSchema = z.object({ items: z.array(z.object({ id: z.string(), summary: z.string().nullish(), deleted: z.boolean().nullish() }).passthrough()).default([]), nextPageToken: z.string().optional() }).passthrough();
const eventSchema = z.object({ id: z.string(), summary: z.string().nullish(), status: z.string().nullish(), location: z.string().nullish(), start: z.object({ date: z.string().optional(), dateTime: z.string().optional() }).passthrough(), end: z.object({ date: z.string().optional(), dateTime: z.string().optional() }).passthrough() }).passthrough();
const eventListSchema = z.object({ items: z.array(eventSchema).default([]), nextPageToken: z.string().optional() }).passthrough();

function auth(token: string): HeadersInit {
  return { authorization: `Bearer ${token}`, accept: "application/json" };
}

function localDate(now: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Copenhagen", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function eventTime(value: { date?: string | undefined; dateTime?: string | undefined }): string {
  const raw = value.dateTime ?? (value.date ? `${value.date}T00:00:00.000Z` : null);
  if (!raw || !Number.isFinite(Date.parse(raw))) throw new Error("Google Calendar event has an invalid time");
  return new Date(raw).toISOString();
}

async function calendars(token: string) {
  const result: z.infer<typeof calendarListSchema>["items"] = [];
  let pageToken: string | undefined;
  do {
    const url = new URL("https://www.googleapis.com/calendar/v3/users/me/calendarList");
    url.searchParams.set("maxResults", "250");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const page = await fetchJson(url, { method: "GET", headers: auth(token) }, calendarListSchema, "google_calendar");
    result.push(...page.items.filter((calendar) => !calendar.deleted));
    pageToken = page.nextPageToken;
  } while (pageToken);
  return result;
}

export async function fetchGoogleCalendar(token: string, now: Date): Promise<CalendarEvent[]> {
  const visible = await calendars(token);
  const startDate = localDate(now);
  const endDate = localDate(new Date(now.getTime() + 32 * 86_400_000));
  const pages = await Promise.all(visible.map(async (calendar) => {
    const events: CalendarEvent[] = [];
    let pageToken: string | undefined;
    do {
      const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar.id)}/events`);
      url.searchParams.set("singleEvents", "true");
      url.searchParams.set("showDeleted", "true");
      url.searchParams.set("maxResults", "2500");
      url.searchParams.set("timeMin", `${startDate}T00:00:00.000Z`);
      url.searchParams.set("timeMax", `${endDate}T00:00:00.000Z`);
      url.searchParams.set("timeZone", "Europe/Copenhagen");
      if (pageToken) url.searchParams.set("pageToken", pageToken);
      const page = await fetchJson(url, { method: "GET", headers: auth(token) }, eventListSchema, "google_calendar");
      events.push(...page.items.map((event) => ({
        type: "event" as const,
        id: `${calendar.id}:${event.id}`,
        title: event.summary?.trim() || "Untitled event",
        calendarId: calendar.id,
        calendarName: calendar.summary?.trim() || calendar.id,
        startsAt: eventTime(event.start),
        endsAt: eventTime(event.end),
        allDay: Boolean(event.start.date),
        location: event.location?.trim() || null,
        status: event.status ?? "confirmed",
      })));
      pageToken = page.nextPageToken;
    } while (pageToken);
    return events;
  }));
  return pages.flat();
}
