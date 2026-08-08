import assert from "node:assert/strict";
import test from "node:test";
import { classifyThread } from "../src/clients/gmail-model.js";
import { ExternalServiceError } from "../src/lib/http.js";

test("fails explicitly when the semantic classifier credential is unavailable", async () => {
  await assert.rejects(
    classifyThread({}, { threadId: "thread-one", subject: "Question", messages: [] }),
    (error: unknown) => error instanceof ExternalServiceError && error.code === "gmail_classifier_not_configured",
  );
});
