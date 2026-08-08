import { z } from "zod";
import type { GmailThread } from "../domain/attention.js";
import { ExternalServiceError, fetchJson } from "../lib/http.js";
import { classifyThread, type ClassifierConfig } from "./gmail-model.js";

type GmailPart = { mimeType?: string; headers?: Array<{ name: string; value: string }>; body?: { data?: string }; parts?: GmailPart[] };
const threadListSchema = z.object({ threads: z.array(z.object({ id: z.string() })).default([]), nextPageToken: z.string().optional() }).passthrough();
const messageSchema = z.object({ id: z.string(), internalDate: z.string(), labelIds: z.array(z.string()).default([]), payload: z.unknown() }).passthrough();
const threadSchema = z.object({ id: z.string(), messages: z.array(messageSchema) }).passthrough();

function auth(token: string): HeadersInit {
  return { authorization: `Bearer ${token}`, accept: "application/json" };
}

function header(part: GmailPart, name: string): string {
  return part.headers?.find((item) => item.name.toLowerCase() === name.toLowerCase())?.value ?? "";
}

function part(value: unknown): GmailPart {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as GmailPart;
}

function decode(value: string): string {
  try {
    return Buffer.from(value.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
  } catch {
    return "";
  }
}

function bodyText(root: GmailPart): string {
  const pieces: string[] = [];
  const visit = (item: GmailPart) => {
    if (item.mimeType === "text/plain" && item.body?.data) pieces.push(decode(item.body.data));
    else if (item.mimeType === "text/html" && item.body?.data && !pieces.length) pieces.push(decode(item.body.data).replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "));
    for (const child of item.parts ?? []) visit(child);
  };
  visit(root);
  return pieces.join("\n").replace(/\s+/g, " ").trim().slice(0, 5000);
}

function address(value: string): { name: string | null; email: string } {
  const email = value.match(/<([^>]+)>/)?.[1] ?? value;
  const name = value.includes("<") ? value.slice(0, value.indexOf("<")).replace(/^"|"$/g, "").trim() : "";
  return { name: name || null, email: email.trim().toLowerCase() };
}

function automated(root: GmailPart, senderEmail: string, labels: string[]): string | null {
  if (labels.some((label) => ["CATEGORY_PROMOTIONS", "CATEGORY_SOCIAL"].includes(label))) return "marketing";
  if (/^(no-?reply|do-?not-?reply|notifications?|mailer-daemon)@/i.test(senderEmail)) return "automated";
  if (header(root, "list-unsubscribe") || /^(bulk|list|junk)$/i.test(header(root, "precedence"))) return "newsletter";
  return null;
}

async function threadIds(token: string): Promise<string[]> {
  const ids: string[] = [];
  let pageToken: string | undefined;
  do {
    const url = new URL("https://gmail.googleapis.com/gmail/v1/users/me/threads");
    url.searchParams.set("q", "in:anywhere newer_than:180d -category:promotions -category:social");
    url.searchParams.set("maxResults", "100");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const page = await fetchJson(url, { method: "GET", headers: auth(token) }, threadListSchema, "gmail");
    ids.push(...page.threads.map((item) => item.id));
    pageToken = page.nextPageToken;
  } while (pageToken);
  return [...new Set(ids)];
}

export async function fetchGmail(token: string, accountEmail: string | undefined, classifier: ClassifierConfig, now: Date): Promise<GmailThread[]> {
  if (!accountEmail) throw new ExternalServiceError("gmail_account_not_configured", "Google account email is not configured");
  const self = accountEmail.toLowerCase();
  const ids = await threadIds(token);
  const threads = await Promise.all(ids.map((id) => fetchJson(`https://gmail.googleapis.com/gmail/v1/users/me/threads/${encodeURIComponent(id)}?format=full`, { method: "GET", headers: auth(token) }, threadSchema, "gmail")));
  const results: GmailThread[] = [];
  for (const thread of threads) {
    const messages = [...thread.messages].sort((a, b) => Number(a.internalDate) - Number(b.internalDate));
    const parsed = messages.map((message) => {
      const root = part(message.payload);
      const from = address(header(root, "from"));
      return { message, root, from, direction: from.email === self ? "outgoing" as const : "incoming" as const, sentAt: new Date(Number(message.internalDate)).toISOString(), body: bodyText(root) };
    });
    const latest = parsed.at(-1);
    if (!latest) continue;
    const ageHours = (now.getTime() - Date.parse(latest.sentAt)) / 3_600_000;
    if (ageHours < 24) continue;
    const excludedCategory = automated(latest.root, latest.from.email, latest.message.labelIds);
    if (excludedCategory) continue;
    const classification = await classifyThread(classifier, { threadId: thread.id, subject: header(latest.root, "subject") || "Untitled email", messages: parsed.map((item) => ({ messageId: item.message.id, direction: item.direction, sentAt: item.sentAt, sender: item.from.email, body: item.body })) });
    if (classification.excludedCategory || !classification.senderIsHuman || ["resolved", "none"].includes(classification.semanticState)) continue;
    results.push({ type: "thread", id: thread.id, threadId: thread.id, title: header(latest.root, "subject") || "Untitled email", latestMessageId: latest.message.id, latestMessageAt: latest.sentAt, latestIncomingAt: [...parsed].reverse().find((item) => item.direction === "incoming")?.sentAt ?? null, latestDirection: latest.direction, senderName: latest.from.name, senderEmail: latest.from.email || null, senderIsHuman: classification.senderIsHuman, excludedCategory: classification.excludedCategory, semanticState: classification.semanticState, semanticEvidence: classification.semanticEvidence, sentRequestAt: classification.sentRequestAt, waitingSince: classification.waitingSince, snippet: latest.body.slice(0, 2000) || null, labels: latest.message.labelIds.slice(0, 30) });
  }
  return results;
}
