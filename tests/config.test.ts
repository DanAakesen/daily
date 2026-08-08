import assert from "node:assert/strict";
import test from "node:test";
import { isScheduledRefreshTime, loadConfig } from "../src/config.js";

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

test("treats unset GitHub secrets as optional connector configuration", () => {
  const config = loadConfig({
    ATTENTION_INGEST_BEARER_TOKEN: "a".repeat(32),
    GOOGLE_CLIENT_ID: "",
    GOOGLE_CLIENT_SECRET: "",
    GOOGLE_REFRESH_TOKEN: "",
    GOOGLE_ACCOUNT_EMAIL: "",
    GMAIL_CLASSIFIER_API_KEY: "",
  });

  assert.equal(config.GOOGLE_CLIENT_ID, undefined);
  assert.equal(config.GOOGLE_ACCOUNT_EMAIL, undefined);
  assert.equal(config.GMAIL_CLASSIFIER_API_KEY, undefined);
});
