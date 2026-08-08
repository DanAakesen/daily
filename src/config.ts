import { z } from "zod";

const optionalSecret = z.string().min(1).optional();

const ConfigSchema = z.object({
  DAILY_OVERVIEW_URL: z.string().url().default("https://dan-daily-overview.danaakesen.chatgpt.site"),
  ATTENTION_INGEST_BEARER_TOKEN: z.string().min(32),
  TICKTICK_ACCESS_TOKEN: optionalSecret,
  GOOGLE_CLIENT_ID: optionalSecret,
  GOOGLE_CLIENT_SECRET: optionalSecret,
  GOOGLE_REFRESH_TOKEN: optionalSecret,
  GOOGLE_ACCOUNT_EMAIL: z.string().email().optional(),
  GMAIL_CLASSIFIER_ENDPOINT: z.string().url().optional(),
  GMAIL_CLASSIFIER_API_KEY: optionalSecret,
  GMAIL_CLASSIFIER_MODEL: optionalSecret,
});

export type Config = z.infer<typeof ConfigSchema>;

export function loadConfig(values: NodeJS.ProcessEnv = process.env): Config {
  return ConfigSchema.parse(values);
}

export function isScheduledRefreshTime(now = new Date()): boolean {
  const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Copenhagen", hour: "2-digit", hourCycle: "h23" }).format(now));
  return hour === 6 || hour === 15;
}
