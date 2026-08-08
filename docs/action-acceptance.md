# Explicit action acceptance plan

Status: planned for 2026-08-09.

These tests cover explicit user-requested actions only. The scheduled cloud refresh remains read-only and must never call an action endpoint.

## Preconditions

- Use disposable test records with the exact title `Daily action test`.
- Confirm the intended source and action before any externally visible write.
- Read the source back after every write; an API success response alone is not acceptance.
- Remove the disposable record after verification where deletion is supported.

## Acceptance tests

1. **Google Calendar:** Create a 15-minute `Daily action test` event in Dan's personal calendar, read it back, delete it, and confirm it is gone.
2. **Gmail:** Create an unsent `Daily action test` draft addressed to Dan, read it back in Gmail, then delete the draft. Never send it.
3. **TickTick:** Create a `Daily action test` task with the default one-hour reminder, read it back, complete it, and confirm the completed state.
4. **Voice:** From ChatGPT Voice, request one explicit action, confirm the correct source and parameters were selected, and verify the result in the source app.

## Pass criteria

- Every action is tied to an explicit request and the correct authenticated Dan account.
- The action appears exactly once in the intended source.
- The final source read-back matches the requested values.
- No scheduled refresh, background process, or read-only connector performs a write.

