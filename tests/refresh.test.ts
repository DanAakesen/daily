import assert from "node:assert/strict";
import test from "node:test";
import { buildRefreshPayload } from "../src/refresh.js";

test("records one failed source without discarding successful source snapshots", async () => {
  const payload = await buildRefreshPayload({
    gmail: async () => { throw new Error("Classifier unavailable"); },
    ticktick: async () => [{ type: "task", id: "task-one", title: "Task", projectId: null, priority: 0, dueAt: null, startAt: null, allDay: false, status: "open", content: null }],
    calendar: async () => [{ type: "event", id: "calendar:event-one", title: "Event", calendarId: "calendar", calendarName: "Personal", startsAt: "2026-08-08T08:00:00.000Z", endsAt: "2026-08-08T09:00:00.000Z", allDay: false, location: null, status: "confirmed" }],
  }, new Date("2026-08-08T06:00:00.000Z"), "refresh-test-one");
  assert.equal(payload.sources.gmail.status, "error");
  assert.equal(payload.sources.ticktick.status, "ok");
  assert.equal(payload.sources.google_calendar.status, "ok");
  assert.equal(payload.sources.ticktick.status === "ok" ? payload.sources.ticktick.items.length : 0, 1);
});

test("reuses the requested run identifier as the ingestion idempotency key", async () => {
  const payload = await buildRefreshPayload({ gmail: async () => [], ticktick: async () => [], calendar: async () => [] }, new Date("2026-08-08T06:00:00.000Z"), "refresh-test-two");
  assert.equal(payload.runId, "refresh-test-two");
  assert.equal(payload.idempotencyKey, "refresh-test-two");
});
