import assert from "node:assert/strict";
import test from "node:test";
import { activeOrderUpdates, classifyOrder, isOrderCandidate } from "../src/clients/gmail-orders.js";

test("recognizes recent fulfillment messages without treating old mail as active", () => {
  const now = new Date("2026-08-14T16:00:00.000Z");
  assert.equal(isOrderCandidate({ threadId: "one", subject: "Din ordre er på vej", messages: [{ messageId: "one", direction: "incoming", sentAt: "2026-08-14T12:00:00.000Z", sender: "shop@example.com", body: "Ordrenummer DK1392219 er afsendt" }] }, now), true);
  assert.equal(isOrderCandidate({ threadId: "footer", subject: "Your weekly account summary", messages: [{ messageId: "footer", direction: "incoming", sentAt: "2026-08-14T12:00:00.000Z", sender: "service@example.com", body: "See order history in your account." }] }, now), false);
  assert.equal(isOrderCandidate({ threadId: "two", subject: "Din ordre er på vej", messages: [{ messageId: "two", direction: "incoming", sentAt: "2026-05-01T12:00:00.000Z", sender: "shop@example.com", body: "Ordrenummer old" }] }, now), false);
});

test("deduplicates merchant and country-prefixed order numbers while retaining delivery detail", () => {
  const updates = activeOrderUpdates([
    { isOrder: true, company: "MM Sports AB", orderNumber: "1392219", status: "received", statusLabel: "Order received", deliveryDetail: "Expected in 1–3 business days", updatedAt: "2026-08-14T07:42:02.000Z" },
    { isOrder: true, company: "MM Sports", orderNumber: "DK1392219", status: "shipped", statusLabel: "On the way", deliveryDetail: null, updatedAt: "2026-08-14T12:46:04.000Z" },
  ]);
  assert.equal(updates.length, 1);
  assert.equal(updates[0]?.status, "shipped");
  assert.equal(updates[0]?.orderNumber, "DK1392219");
  assert.equal(updates[0]?.deliveryDetail, "Expected in 1–3 business days");
});

test("removes terminal orders from the active snapshot", () => {
  assert.deepEqual(activeOrderUpdates([{ isOrder: true, company: "Shop", orderNumber: "123456", status: "delivered", statusLabel: "Delivered", deliveryDetail: null, updatedAt: "2026-08-14T12:00:00.000Z" }]), []);
});

test("constrains order timestamps to source messages", async () => {
  const originalFetch = globalThis.fetch;
  const sourceTimestamp = "2026-08-14T12:46:04.000Z";
  let requestBody: Record<string, unknown> | undefined;
  globalThis.fetch = async (_input, init) => {
    requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
    return new Response(JSON.stringify({ output_text: JSON.stringify({ isOrder: true, company: "MM Sports", orderNumber: "DK1392219", status: "shipped", statusLabel: "On the way", deliveryDetail: null, updatedAt: sourceTimestamp }) }), { status: 200, headers: { "content-type": "application/json" } });
  };
  try {
    const result = await classifyOrder({ endpoint: "https://api.openai.test/v1/responses", apiKey: "test", model: "test" }, { threadId: "one", subject: "On the way", messages: [{ messageId: "one", direction: "incoming", sentAt: sourceTimestamp, sender: "shop@example.com", body: "Shipped" }] });
    assert.equal(result.updatedAt, sourceTimestamp);
    const updatedAt = requestBody?.text as { format?: { schema?: { properties?: { updatedAt?: { anyOf?: Array<{ enum?: string[] }> } } } } } | undefined;
    assert.deepEqual(updatedAt?.format?.schema?.properties?.updatedAt?.anyOf?.[0]?.enum, [sourceTimestamp]);
  } finally { globalThis.fetch = originalFetch; }
});
