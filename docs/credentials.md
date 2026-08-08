# Credential operations

All production credentials are encrypted GitHub Actions environment secrets in `production`. No credential value is committed to this repository.

## Current status

| Connector | Status | Access | Rotation |
|---|---|---|---|
| Dashboard ingestion | Configured | Write only to the normalized ingestion endpoint | Rotate on suspected exposure |
| TickTick | Configured and live-tested | `tasks:read` | Expires 2027-02-04 16:12 UTC |
| Google Calendar | Configured and live-tested | `calendar.readonly` | Valid until revoked or invalidated by Google |
| Gmail | Configured and live-tested | `gmail.readonly` | Valid until revoked or invalidated by Google |
| OpenAI classifier | Configured and live-tested | Responses model requests only | Rotate on suspected exposure |

## Rules

- Keep source connectors read-only.
- Never print, commit, upload as artifacts, or place credentials in GitHub variables.
- Keep the local refresh enabled until manual parity and two scheduled cloud successes pass.
- TickTick does not document a refresh-token flow. Reauthorize before the recorded expiry.
- Google OAuth uses offline access and a refresh token. The consent app is in production for private self-use; Google still shows an unverified-app warning during reauthorization.
