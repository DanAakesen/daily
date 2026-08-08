# Daily cloud refresh deployment plan

Status: Deployed

## Objective

Move the Daily Overview Gmail, Google Calendar, and TickTick refresh from Dan's Windows Codex automation to a private cloud workflow while preserving the existing dashboard ingestion contract and read-only source behavior.

## Confirmed decisions

- Repository: private `DanAakesen/daily`.
- Local checkout: `C:\Repo\daily`.
- Scheduler/runtime: GitHub Actions.
- Runtime secrets: encrypted GitHub Actions environment secrets; never committed.
- Azure subscription: `Dan Aakesen`.
- Azure resource group: `rg-daily` in Denmark East.
- Existing Daily Overview site remains the storage and presentation backend.
- Existing local automation remains enabled until cloud parity and scheduled acceptance pass.
- TickTick countdown parity is desirable but non-blocking.

## Planned components

- TypeScript/Node refresh engine with strict normalized payload validation.
- Read-only TickTick Open API adapter.
- Read-only Gmail and Google Calendar API adapters.
- Existing semantic email attention rules.
- GitHub Actions scheduled and manual workflows.
- Idempotent ingestion into the existing Daily Overview endpoint.
- Per-source error isolation and stale-snapshot preservation.
- Automated tests, parity reporting, and observable run summaries.
- Optional Azure resources only where they add value; no Key Vault.

## Security boundary

- No source mutation in refresh workflows.
- No credentials in source files, logs, artifacts, or build output.
- GitHub `production` environment holds external OAuth and ingestion secrets.
- Least-privilege OAuth scopes.
- Azure access uses federated identity where applicable rather than stored Azure credentials.

## Execution gates

1. Repository and local project initialization.
2. Connector contract and source adapter implementation.
3. TickTick OAuth and live parity test.
4. Google OAuth and live parity test.
5. Manual cloud refresh acceptance.
6. Two successful scheduled cloud refreshes.
7. Disable the duplicate local automation.

## Validation checks

- [x] Bicep compilation succeeds.
- [x] Subscription-scope template validation succeeds.
- [x] Subscription-scope what-if shows only `rg-daily` creation.
- [x] Azure CLI authentication targets the confirmed subscription.
- [x] Bicep linting succeeds.
- [x] Applicable Azure policy assignments are reviewed.
- [x] Application tests, type-check, build, and dependency audit pass.

## Role assignment verification

- Status: Verified.
- Identities checked: none; the template creates no managed identity.
- Roles confirmed: none; the template creates no role assignments.
- Issues: none expected because the refresh runtime is GitHub Actions and no Azure data-plane resource is used.

## Validation proof

- Date: 2026-08-08.
- Subscription: `Dan Aakesen` (`0ac7d719-89bc-4100-be87-a79d33e953a7`), state `Enabled`.
- `az bicep build --file ./infra/main.bicep`: passed.
- `az bicep lint --file ./infra/main.bicep`: passed.
- `az deployment sub validate`: `Succeeded`.
- `az deployment sub what-if`: only `rg-daily` creation in `denmarkeast`.
- Subscription policy assignments: none returned.
- `npm test`: 7/7 passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm audit --audit-level=high`: zero vulnerabilities.

## Deployment proof

- Date: 2026-08-08.
- Subscription deployment `daily-infra-20260808`: `Succeeded`.
- `rg-daily`: provisioned in `denmarkeast` with state `Succeeded`.
- Deployed resources inside `rg-daily`: zero; GitHub Actions is the runtime.
- Live role verification: not applicable; no managed identities or role assignments were deployed.
- Previous empty group `rg-personal-assistant`: deleted after a zero-resource check; verified absent.

## Known risks

- TickTick countdowns are not present in the documented Open API.
- TickTick Inbox coverage and token longevity require live verification.
- Google and TickTick OAuth consent may require Dan's interaction.
- GitHub scheduled workflows may start later than their nominal minute; ingestion remains idempotent.

## Rollback

- Keep the current local refresh enabled throughout acceptance.
- Cloud failures submit source-level errors or no payload; they never mutate Gmail, Calendar, or TickTick.
- Disable the GitHub schedule to revert immediately to the current local process.
