# Daily Overview ingestion contract

The cloud refresh submits schema version 1 to:

`POST https://dan-daily-overview.danaakesen.chatgpt.site/api/attention/ingest`

Authentication uses `Authorization: Bearer <ATTENTION_INGEST_BEARER_TOKEN>`.

Every payload contains the three sources `gmail`, `ticktick`, and `google_calendar`. Each source is either:

- `ok`, with a complete `items` array; or
- `error`, with a stable error code and non-sensitive message.

A failed source never reuses partial items. The site retains its previous successful snapshot and marks it stale. Retries reuse the identical body and idempotency key.

The authoritative validation remains in the deployed Daily Overview worker. This repository mirrors that schema and tests compatibility before submission.
