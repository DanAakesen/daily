import { appendFile } from "node:fs/promises";
import { isScheduledRefreshTime, loadConfig } from "./config.js";
import { buildRefreshPayload, productionDependencies, submitRefresh } from "./refresh.js";

const scheduled = process.argv.includes("--scheduled");
const now = new Date();
if (scheduled && !isScheduledRefreshTime(now)) {
  process.stdout.write(`${JSON.stringify({ event: "refresh_skipped", reason: "not_copenhagen_refresh_hour", capturedAt: now.toISOString() })}\n`);
  process.exit(0);
}

const config = loadConfig();
const runId = process.env.GITHUB_RUN_ID ? `refresh-github-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT ?? "1"}` : undefined;
const payload = await buildRefreshPayload(productionDependencies(config), now, runId);
const response = await submitRefresh(config, payload);
const counts = Object.fromEntries(Object.entries(payload.sources).map(([source, snapshot]) => [source, snapshot.status === "ok" ? snapshot.items.length : 0]));
const statuses = Object.fromEntries(Object.entries(payload.sources).map(([source, snapshot]) => [source, snapshot.status]));
process.stdout.write(`${JSON.stringify({ event: "refresh_complete", runId: payload.runId, accepted: response.accepted, duplicate: response.duplicate ?? false, statuses, counts })}\n`);

if (process.env.GITHUB_STEP_SUMMARY) {
  const rows = Object.entries(payload.sources).map(([source, snapshot]) => `| ${source} | ${snapshot.status} | ${snapshot.status === "ok" ? snapshot.items.length : 0} |`).join("\n");
  await appendFile(process.env.GITHUB_STEP_SUMMARY, `## Daily refresh\n\nRun: \`${payload.runId}\`\n\n| Source | Status | Items |\n|---|---:|---:|\n${rows}\n`, "utf8");
}
