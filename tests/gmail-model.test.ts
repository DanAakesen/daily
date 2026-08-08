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

test("constrains classifier timestamps to exact source message timestamps", async () => {
  const originalFetch = globalThis.fetch;
  const sourceTimestamp = "2026-08-08T12:34:56.000Z";
  let requestBody: Record<string, unknown> | undefined;
  globalThis.fetch = async (_input, init) => {
    requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
    return new Response(JSON.stringify({
      output_text: JSON.stringify({
        semanticState: "deferral",
        semanticEvidence: "The sender promised a later reply.",
        senderIsHuman: true,
        excludedCategory: null,
        sentRequestAt: null,
        waitingSince: sourceTimestamp,
      }),
    }), { status: 200, headers: { "content-type": "application/json" } });
  };

  try {
    const classification = await classifyThread(
      { endpoint: "https://api.openai.test/v1/responses", apiKey: "test-key", model: "test-model" },
      { threadId: "thread-one", subject: "Follow-up", messages: [{ messageId: "message-one", direction: "incoming", sentAt: sourceTimestamp, sender: "person@example.com", body: "I will reply later." }] },
    );

    assert.equal(classification.waitingSince, sourceTimestamp);
    const text = requestBody?.text as { format?: { schema?: { properties?: { waitingSince?: { anyOf?: Array<{ enum?: string[] }> } } } } } | undefined;
    assert.deepEqual(text?.format?.schema?.properties?.waitingSince?.anyOf?.[0]?.enum, [sourceTimestamp]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
