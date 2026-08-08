import assert from "node:assert/strict";
import test from "node:test";
import { isScheduledRefreshTime } from "../src/config.js";

test("recognizes the Copenhagen morning slot during winter time", () => {
  assert.equal(isScheduledRefreshTime(new Date("2026-01-15T05:00:00.000Z")), true);
});

test("recognizes both Copenhagen refresh slots during summer time", () => {
  assert.equal(isScheduledRefreshTime(new Date("2026-08-08T04:00:00.000Z")), true);
  assert.equal(isScheduledRefreshTime(new Date("2026-08-08T13:00:00.000Z")), true);
});

test("rejects a UTC trigger that does not map to a Copenhagen refresh hour", () => {
  assert.equal(isScheduledRefreshTime(new Date("2026-08-08T12:00:00.000Z")), false);
});
