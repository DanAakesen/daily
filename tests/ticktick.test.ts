import assert from "node:assert/strict";
import test from "node:test";
import { fetchTickTick } from "../src/clients/ticktick.js";

const responses = new Map<string, unknown>([
  ["POST https://api.ticktick.com/open/v1/task/filter", [{ id: "inbox-task", projectId: null, title: "Inbox item", content: "", startDate: null, dueDate: null, isAllDay: false, priority: 0, status: 0 }]],
  ["GET https://api.ticktick.com/open/v1/project", [{ id: "project-one", name: "Personal" }]],
  ["GET https://api.ticktick.com/open/v1/project/project-one/data", { tasks: [{ id: "project-task", projectId: "project-one", title: "Dated item", content: "Details", startDate: "2026-08-08T08:00:00+0000", dueDate: "2026-08-08T09:00:00+0000", isAllDay: false, priority: 5, status: 0 }] }],
  ["GET https://api.ticktick.com/open/v1/habit", [
    { id: "6a75ac6cbb03d10776b0775d", name: "Gym", status: 0, goal: 1, repeatRule: "RRULE:FREQ=WEEKLY;TT_TIMES=4", targetStartDate: 20260808 },
    { id: "6a75adfe8f08fd84160ae427", name: "Run", status: 0, goal: 1, repeatRule: "RRULE:FREQ=WEEKLY;TT_TIMES=1", targetStartDate: 20260808 },
  ]],
  ["GET https://api.ticktick.com/open/v1/habit/checkins?habitIds=6a75ac6cbb03d10776b0775d%2C6a75adfe8f08fd84160ae427&from=20260709&to=20260808", [{ habitId: "6a75ac6cbb03d10776b0775d", checkins: [{ id: "checkin-one", stamp: 20260808, value: 1 }] }]],
]);

test("preserves Inbox and unscheduled tasks while deriving both workout targets", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    const key = `${init?.method ?? "GET"} ${String(input)}`;
    const body = responses.get(key);
    assert.notEqual(body, undefined, `Unexpected request: ${key}`);
    return new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } });
  };
  try {
    const items = await fetchTickTick("token", new Date("2026-08-08T12:00:00.000Z"));
    const tasks = items.filter((item) => item.type === "task");
    const targets = items.filter((item) => item.type === "workout_target");
    assert.equal(tasks.length, 2);
    assert.equal(tasks.find((task) => task.id === "inbox-task")?.projectId, null);
    assert.equal(tasks.find((task) => task.id === "inbox-task")?.dueAt, null);
    assert.deepEqual(targets.map((target) => [target.workoutClass, target.target]), [["gym", 4], ["run", 1]]);
    assert.equal(items.filter((item) => item.type === "habit_checkin").length, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
