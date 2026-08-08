# Credential operations

All production credentials are encrypted GitHub Actions environment secrets in `production`. No credential value is committed to this repository.

## Current status

| Connector | Status | Access | Rotation |
|---|---|---|---|
| Dashboard ingestion | Configured | Write only to the normalized ingestion endpoint | Rotate on suspected exposure |
| TickTick | Configured and live-tested | `tasks:read` | Expires 2027-02-04 16:12 UTC |
| Google Calendar | APIs enabled; OAuth pending | `calendar.readonly` planned | Google refresh token policy |
| Gmail | APIs enabled; OAuth pending | `gmail.readonly` planned | Google refresh token policy |
| OpenAI classifier | API key pending | Responses API only | Rotate on suspected exposure |

## Rules

- Keep source connectors read-only.
- Never print, commit, upload as artifacts, or place credentials in GitHub variables.
- Keep the local refresh enabled until manual parity and two scheduled cloud successes pass.
- TickTick does not document a refresh-token flow. Reauthorize before the recorded expiry.
- Google OAuth must use offline access and a refresh token. If the consent app remains in testing, verify whether Google applies a short refresh-token lifetime before accepting cloud cutover.
