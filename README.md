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
