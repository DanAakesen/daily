import { z } from "zod";
import type { GmailOrderUpdate } from "../domain/attention.js";
import { ExternalServiceError, fetchJson } from "../lib/http.js";
import type { ClassifierConfig, ClassificationInput } from "./gmail-model.js";

const ACTIVE = new Set(["received", "processing", "shipped", "ready_for_pickup", "delayed"]);
const orderSchema = z.object({
  isOrder: z.boolean(),
  company: z.string().max(300).nullable(),
  orderNumber: z.string().max(200).nullable(),
  status: z.enum(["received", "processing", "shipped", "ready_for_pickup", "delayed", "delivered", "cancelled", "refunded", "unknown"]),
  statusLabel: z.string().max(120).nullable(),
  deliveryDetail: z.string().max(300).nullable(),
  updatedAt: z.string().datetime({ offset: true }).nullable(),
});
const responseSchema = z.object({ output_text: z.string().optional(), output: z.array(z.object({ content: z.array(z.object({ type: z.string(), text: z.string().optional() }).passthrough()).optional() }).passthrough()).optional() }).passthrough();

export type OrderClassification = z.infer<typeof orderSchema>;

function outputText(response: z.infer<typeof responseSchema>): string {
  if (response.output_text) return response.output_text;
  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) if (content.type === "output_text" && content.text) return content.text;
  }
  throw new ExternalServiceError("gmail_order_classifier_empty", "Gmail order classifier returned no structured output");
}

export function isOrderCandidate(input: ClassificationInput, now: Date): boolean {
  const latest = input.messages.at(-1);
  if (!latest || now.getTime() - Date.parse(latest.sentAt) > 60 * 86_400_000) return false;
  if (/\b(order|ordre|ordrenr|forsendelse|shipment|shipped|afsendt|levering|delivery|pakke|tracking|spor(?:ing|ingsnummer)?)\b/i.test(input.subject)) return true;
  const body = input.messages.map((message) => message.body).join("\n");
  const hasOrderReference = /\b(ordrenr|ordernummer|order number|order no\.?|ordre\s*#)\b/i.test(body);
  const hasLifecycleState = /\b(modtaget|received|processing|behandler|pakket|shipped|afsendt|på vej|levering|delivery|klar til afhentning|ready for pickup|forsinket|delayed)\b/i.test(body);
  return hasOrderReference && hasLifecycleState;
}

export async function classifyOrder(config: ClassifierConfig, input: ClassificationInput): Promise<OrderClassification> {
  if (!config.endpoint || !config.apiKey || !config.model) throw new ExternalServiceError("gmail_classifier_not_configured", "Gmail semantic classifier is not configured");
  const timestamps = [...new Set(input.messages.map((message) => message.sentAt))];
  const timestampSchema = timestamps.length ? { anyOf: [{ type: "string", enum: timestamps }, { type: "null" }] } : { type: "null" };
  const prompt = [
    "Extract the latest lifecycle state of one physical purchase order for a read-only personal dashboard.",
    "An order requires a merchant/company and an order number. Exclude marketing, calendar notices, reservations, digital-only purchases, and payment receipts without fulfillment information.",
    "Use the latest factual state in the thread: received, processing, shipped, ready_for_pickup, delayed, delivered, cancelled, refunded, or unknown.",
    "statusLabel and deliveryDetail must be concise, factual, and based only on the messages. Never invent a date or estimate.",
    "For updatedAt copy exactly the timestamp of the message that proves the latest state, including timezone, or null.",
  ].join("\n");
  const body = {
    model: config.model,
    reasoning: { effort: "low" },
    input: [
      { role: "system", content: [{ type: "input_text", text: prompt }] },
      { role: "user", content: [{ type: "input_text", text: JSON.stringify(input) }] },
    ],
    text: {
      verbosity: "low",
      format: {
        type: "json_schema",
        name: "gmail_order",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["isOrder", "company", "orderNumber", "status", "statusLabel", "deliveryDetail", "updatedAt"],
          properties: {
            isOrder: { type: "boolean" },
            company: { anyOf: [{ type: "string", maxLength: 300 }, { type: "null" }] },
            orderNumber: { anyOf: [{ type: "string", maxLength: 200 }, { type: "null" }] },
            status: { type: "string", enum: ["received", "processing", "shipped", "ready_for_pickup", "delayed", "delivered", "cancelled", "refunded", "unknown"] },
            statusLabel: { anyOf: [{ type: "string", maxLength: 120 }, { type: "null" }] },
            deliveryDetail: { anyOf: [{ type: "string", maxLength: 300 }, { type: "null" }] },
            updatedAt: timestampSchema,
          },
        },
      },
    },
  };
  const response = await fetchJson(config.endpoint, { method: "POST", headers: { authorization: `Bearer ${config.apiKey}`, "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(body) }, responseSchema, "gmail_order_classifier");
  let value: unknown;
  try { value = JSON.parse(outputText(response)); } catch { throw new ExternalServiceError("gmail_order_classifier_invalid_json", "Gmail order classifier returned invalid structured JSON"); }
  const parsed = orderSchema.safeParse(value);
  if (!parsed.success) throw new ExternalServiceError("gmail_order_classifier_invalid_output", "Gmail order classifier returned an unsupported result");
  return parsed.data;
}

function companyKey(value: string): string {
  return value.toLowerCase().replace(/\b(?:ab|aps|a\/s|as|ltd|limited|inc|gmbh)\b/g, "").replace(/[^a-z0-9]+/g, "");
}

function orderKey(value: string): string {
  const normalized = value.toLowerCase().replace(/[^a-z0-9]+/g, "");
  return /^[a-z]{2}\d{5,}$/.test(normalized) ? normalized.slice(2) : normalized;
}

export function activeOrderUpdates(classifications: OrderClassification[]): GmailOrderUpdate[] {
  const byOrder = new Map<string, OrderClassification>();
  for (const item of classifications) {
    if (!item.isOrder || !item.company?.trim() || !item.orderNumber?.trim() || !item.updatedAt) continue;
    const id = `${companyKey(item.company)}:${orderKey(item.orderNumber)}`;
    const previous = byOrder.get(id);
    if (!previous || Date.parse(item.updatedAt) >= Date.parse(previous.updatedAt ?? "")) {
      byOrder.set(id, { ...item, deliveryDetail: item.deliveryDetail || previous?.deliveryDetail || null });
    }
  }
  return [...byOrder.entries()].flatMap(([id, item]) => {
    if (!ACTIVE.has(item.status) || !item.company || !item.orderNumber || !item.statusLabel || !item.updatedAt) return [];
    return [{ type: "order_update" as const, id: `order:${id}`, title: `${item.company} order ${item.orderNumber}`, company: item.company, orderNumber: item.orderNumber, status: item.status as GmailOrderUpdate["status"], statusLabel: item.statusLabel, deliveryDetail: item.deliveryDetail, updatedAt: item.updatedAt }];
  }).sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));
}
