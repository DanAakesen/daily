import { z } from "zod";

const iso = z.string().datetime({ offset: true });
const nullableIso = iso.nullable();

const baseItem = z.object({
  type: z.string().min(1).max(40),
  id: z.string().min(1).max(500),
  title: z.string().min(1).max(1000),
});

export const GmailThreadSchema = baseItem.extend({
  type: z.literal("thread"),
  threadId: z.string().min(1).max(500),
  latestMessageId: z.string().min(1).max(500),
  latestMessageAt: iso,
  latestIncomingAt: nullableIso,
  latestDirection: z.enum(["incoming", "outgoing"]),
  senderName: z.string().max(300).nullable(),
  senderEmail: z.string().max(500).nullable(),
  senderIsHuman: z.boolean(),
  excludedCategory: z.string().max(80).nullable(),
  semanticState: z.enum(["new_question", "direct_request", "ambiguous", "awaiting_reply", "deferral", "resolved", "none"]),
  semanticEvidence: z.string().min(1).max(2000),
  sentRequestAt: nullableIso,
  waitingSince: nullableIso,
  snippet: z.string().max(2000).nullable(),
  labels: z.array(z.string().min(1).max(100)).max(30),
});

export const TickTickItemSchema = z.discriminatedUnion("type", [
  baseItem.extend({ type: z.literal("task"), projectId: z.string().max(500).nullable(), priority: z.number().int().min(0).max(5), dueAt: nullableIso, startAt: nullableIso, allDay: z.boolean(), status: z.string().max(60), content: z.string().max(4000).nullable() }),
  baseItem.extend({ type: z.literal("habit"), active: z.boolean(), target: z.number().int().min(1).max(1000), repeatRule: z.string().max(1000).nullable(), startDate: z.string().max(20).nullable() }),
  baseItem.extend({ type: z.literal("habit_checkin"), habitId: z.string().min(1).max(500), checkinAt: iso, value: z.number().finite() }),
  baseItem.extend({ type: z.literal("countdown"), dueAt: iso, repeatRule: z.string().max(1000).nullable() }),
  baseItem.extend({ type: z.literal("workout_target"), habitId: z.string().min(1).max(500), active: z.boolean(), target: z.number().int().min(1).max(100), repeatRule: z.string().max(1000).nullable(), startDate: z.string().max(20).nullable(), workoutClass: z.enum(["gym", "run"]) }),
]);

export const CalendarEventSchema = baseItem.extend({
  type: z.literal("event"),
  calendarId: z.string().min(1).max(500),
  calendarName: z.string().min(1).max(500),
  startsAt: iso,
  endsAt: iso,
  allDay: z.boolean(),
  location: z.string().max(1000).nullable(),
  status: z.string().max(60),
});

const sourceError = z.object({ status: z.literal("error"), capturedAt: iso, errorCode: z.string().min(1).max(100), errorMessage: z.string().min(1).max(1000) });
const sourceOk = <T extends z.ZodType>(item: T) => z.object({ status: z.literal("ok"), capturedAt: iso, items: z.array(item).max(20_000) });

export const AttentionPayloadSchema = z.object({
  schemaVersion: z.literal(1),
  runId: z.string().min(1).max(200),
  idempotencyKey: z.string().min(1).max(200),
  mode: z.literal("refresh"),
  capturedAt: iso,
  sources: z.object({
    gmail: z.union([sourceOk(GmailThreadSchema), sourceError]),
    ticktick: z.union([sourceOk(TickTickItemSchema), sourceError]),
    google_calendar: z.union([sourceOk(CalendarEventSchema), sourceError]),
  }),
});

export type GmailThread = z.infer<typeof GmailThreadSchema>;
export type TickTickItem = z.infer<typeof TickTickItemSchema>;
export type CalendarEvent = z.infer<typeof CalendarEventSchema>;
export type AttentionPayload = z.infer<typeof AttentionPayloadSchema>;
export type SourceName = keyof AttentionPayload["sources"];
