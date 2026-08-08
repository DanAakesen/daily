# Daily

Private cloud refresh service for [Dan's Daily Overview](https://dan-daily-overview.danaakesen.chatgpt.site).

The service reads Gmail, Google Calendar, and TickTick without modifying them, validates a normalized snapshot, and submits it to the existing dashboard. GitHub Actions runs the refresh at 06:00 and 15:00 Europe/Copenhagen and also supports manual execution.

## Safety

- Source connectors are read-only.
- Each source fails independently.
- Secrets are GitHub Actions environment secrets and are never committed.
- The current local refresh remains active until cloud parity and scheduled acceptance pass.

## Local validation

```text
npm ci
npm test
npm run typecheck
npm run build
```

See `.azure/deployment-plan.md` for rollout gates, `docs/ingestion-contract.md` for the payload contract, and `docs/action-acceptance.md` for the reversible action tests planned for 2026-08-09.

## Current rollout state

- GitHub `production` environment and scheduled workflow are configured.
- TickTick read-only OAuth is connected and live cloud ingestion has passed with 28 records.
- Google read-only OAuth is connected for Gmail and Calendar through project `dan-daily-2026`.
- The OpenAI Responses classifier uses a dedicated restricted project key.
- Manual production acceptance passed on 2026-08-08 with Gmail 47, TickTick 28, and Google Calendar 27 records.
- The current local refresh stays enabled until two scheduled cloud runs succeed.

See `docs/credentials.md` for the credential boundary and rotation dates.
