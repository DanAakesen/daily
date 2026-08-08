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

See `.azure/deployment-plan.md` for rollout gates and `docs/ingestion-contract.md` for the payload contract.

## Current rollout state

- GitHub `production` environment and scheduled workflow are configured.
- TickTick read-only OAuth is connected and live cloud ingestion has passed with 28 records.
- Google Cloud project `dan-daily-2026` exists; Gmail and Calendar APIs are enabled. OAuth consent and client creation remain pending.
- The OpenAI classifier endpoint and model are configured; its API key remains pending.
- The current local refresh stays enabled until all three sources pass manually and two scheduled cloud runs succeed.

See `docs/credentials.md` for the credential boundary and rotation dates.
