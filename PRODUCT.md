# Daily

## Purpose

`daily` owns the cloud refresh and supporting infrastructure for Dan's private Daily Overview. It reads source systems, normalizes complete snapshots, and submits them to the existing dashboard.

## User

Dan is the sole user and operator.

## In scope

- Read every open TickTick task, including unscheduled and Inbox tasks.
- Read active habits, 30 days of habit check-ins, and the two configured workout targets.
- Read every visible Google calendar through 31 days.
- Read and semantically classify Gmail attention threads using the existing 24-hour and three-Danish-business-day rules.
- Run cloud refreshes at 06:00 and 15:00 Europe/Copenhagen.
- Preserve source-level failure isolation and the existing strict ingestion contract.

## Out of scope

- A second dashboard or UI.
- Source mutation during refresh.
- Apple Health ingestion, which already uploads from the iPhone.
- iCloud Calendar and nutrition, which remain later phases.
- Guaranteed TickTick countdown parity; countdowns are non-blocking until a documented API exists.

## Success criteria

- A manual cloud run matches the current connector snapshot for all required fields.
- Inbox and unscheduled TickTick tasks are proven against Dan's live account.
- Two scheduled cloud refreshes succeed before the local duplicate is disabled.
- A failed connector leaves the prior successful source snapshot available as stale.
- No credential appears in source, logs, artifacts, or Git history.

## Open questions

- TickTick access-token longevity and Inbox behavior require a live OAuth test.
- Gmail semantic classification needs an approved model endpoint and runtime identity or API secret.
