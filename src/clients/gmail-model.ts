import { z } from "zod";
import { ExternalServiceError, fetchJson } from "../lib/http.js";

export type ClassifierConfig = { endpoint?: string | undefined; apiKey?: string | undefined; model?: string | undefined };
export type ClassificationInput = { threadId: string; subject: string; messages: Array<{ messageId: string; direction: "incoming" | "outgoing"; sentAt: string; sender: string; body: string }> };

const classificationSchema = z.object({
  semanticState: z.enum(["new_question", "direct_request", "ambiguous", "awaiting_reply", "deferral", "resolved", "none"]),
  semanticEvidence: z.string().min(1).max(2000),
  senderIsHuman: z.boolean(),
  excludedCategory: z.string().max(80).nullable(),
  sentRequestAt: z.string().datetime({ offset: true }).nullable(),
  waitingSince: z.string().datetime({ offset: true }).nullable(),
});

const responseSchema = z.object({ output_text: z.string().optional(), output: z.array(z.object({ content: z.array(z.object({ type: z.string(), text: z.string().optional() }).passthrough()).optional() }).passthrough()).optional() }).passthrough();

function outputText(response: z.infer<typeof responseSchema>): string {
  if (response.output_text) return response.output_text;
  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) if (content.type === "output_text" && content.text) return content.text;
  }
  throw new ExternalServiceError("gmail_classifier_empty", "Gmail classifier returned no structured output");
}

export async function classifyThread(config: ClassifierConfig, input: ClassificationInput) {
  if (!config.endpoint || !config.apiKey || !config.model) throw new ExternalServiceError("gmail_classifier_not_configured", "Gmail semantic classifier is not configured");
  const prompt = [
    "Classify one private email thread for a read-only personal attention dashboard.",
    "Exclude newsletters, marketing, receipts, automated alerts, calendar notifications, and non-human senders.",
    "new_question: latest incoming human message asks a new factual question.",
    "direct_request: latest incoming human message requests an action or reply.",
    "ambiguous: human attention may be needed but intent is unclear.",
    "awaiting_reply: the user sent a meaningful request and no adequate answer followed.",
    "deferral: the other person promised a later answer; waitingSince is that promise.",
    "resolved: the thread contains an adequate response or the user closed it.",
    "none: no attention state applies.",
    "Use only message timestamps supplied below. Evidence must be concise and factual.",
  ].join("\n");
  const body = {
    model: config.model,
    input: [
      { role: "system", content: [{ type: "input_text", text: prompt }] },
      { role: "user", content: [{ type: "input_text", text: JSON.stringify(input) }] },
    ],
    text: { format: { type: "json_schema", name: "gmail_attention", strict: true, schema: { type: "object", additionalProperties: false, required: ["semanticState", "semanticEvidence", "senderIsHuman", "excludedCategory", "sentRequestAt", "waitingSince"], properties: { semanticState: { type: "string", enum: ["new_question", "direct_request", "ambiguous", "awaiting_reply", "deferral", "resolved", "none"] }, semanticEvidence: { type: "string" }, senderIsHuman: { type: "boolean" }, excludedCategory: { type: ["string", "null"] }, sentRequestAt: { type: ["string", "null"] }, waitingSince: { type: ["string", "null"] } } } } },
  };
  const response = await fetchJson(config.endpoint, { method: "POST", headers: { authorization: `Bearer ${config.apiKey}`, "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(body) }, responseSchema, "gmail_classifier");
  let value: unknown;
  try {
    value = JSON.parse(outputText(response));
  } catch {
    throw new ExternalServiceError("gmail_classifier_invalid_json", "Gmail classifier returned invalid structured JSON");
  }
  const parsed = classificationSchema.safeParse(value);
  if (!parsed.success) throw new ExternalServiceError("gmail_classifier_invalid_output", "Gmail classifier returned an unsupported classification");
  return parsed.data;
}
