---
name: "hone:automation-opportunities"
description: >-
  Finds manual processes that could be automated: manual deploy steps
  in READMEs, setup instructions that could be scripts, repetitive git
  workflows, manual testing procedures, and undocumented tribal
  knowledge. Also checks for artifacts not in source control. Use
  monthly to surface automation ROI. Do NOT use for code quality or
  style audits.
compatibility: >-
  Requires a local repository checkout with documentation, scripts, CI
  config, and source files accessible on disk. Works with any
  technology stack.
metadata:
  short-description: Finds manual processes ripe for automation
---

# Automation Opportunities

## What This Skill Does

Audits the repository for manual processes, undocumented workflows,
and artifacts that should be in source control. Produces a prioritized
list of automation opportunities with estimated effort and impact.

Detection categories:

- **Manual deploy steps**: multi-step deployment instructions in
  READMEs, wikis, or runbooks that could be a single script or CI
  pipeline.
- **Setup scripts missing**: setup instructions that list manual
  commands instead of providing a bootstrap script.
- **Repetitive git workflows**: branching, tagging, or release
  processes described as manual steps.
- **Manual testing procedures**: test plans or checklists that could
  be automated test suites or CI checks.
- **Tribal knowledge in comments**: comments explaining "how to do X"
  that should be executable scripts or documented runbooks.
- **Missing from source control**: referenced config files, env
  templates, tool configs, database migrations, or infrastructure
  definitions that are mentioned but not checked in.

## When To Use

- Monthly scheduled audit to surface high-ROI automation.
- When onboarding is slow and you suspect undocumented manual steps.
- After an incident caused by a manual process failure.
- When planning a DevEx improvement sprint.

## Do Not Use

- For code quality, style, or naming audits (use other hone skills).
- For security scanning.
- For performance analysis.
- As a replacement for a full DevOps maturity assessment.

## Inputs To Confirm

1. **Scope** -- which directories and doc files to scan
   (default: entire repo including docs, READMEs, CI configs, and
   Makefiles).
2. **Focus areas** -- whether to prioritize deploy automation, setup
   automation, or all categories (default: all).
3. **Team size context** -- rough team size to help estimate
   automation ROI (default: not specified, omit ROI estimates).

## Instructions

1. Identify the repository root and enumerate all files, including
   documentation (README, CONTRIBUTING, docs/), CI/CD configs
   (.github/workflows, .gitlab-ci.yml, Jenkinsfile, etc.), scripts
   directories, Makefiles, Dockerfiles, and package manager configs.
2. **Manual deploy steps**: scan READMEs, docs, and runbooks for
   deployment instructions. Flag when:
   - There are 3+ sequential manual shell commands for deploying.
   - Instructions include "SSH into" or "run on the server" steps.
   - The deploy process references manual environment variable
     setting, config file copying, or service restarts.
   - There is no CI/CD pipeline config, or the pipeline does not
     cover the documented deploy steps.
3. **Setup scripts missing**: scan for setup or getting-started
   instructions. Flag when:
   - README lists 5+ manual commands to get the project running.
   - There is no `setup.sh`, `bootstrap`, `make setup`, `init`
     script, or equivalent.
   - Instructions reference manual tool installation without a
     version manager or Dockerfile.
4. **Repetitive git workflows**: scan for branching, release, or
   versioning documentation. Flag when:
   - Release steps involve manual version bumping, changelog editing,
     and tag creation.
   - There is no release automation (semantic-release, standard-version,
     etc.).
   - Branch naming conventions are documented but not enforced by
     hooks or CI.
5. **Manual testing procedures**: scan for test plans, QA checklists,
   or manual verification steps. Flag when:
   - There are documented manual test cases that could be automated.
   - README or CONTRIBUTING mentions manual browser testing without
     an E2E test suite.
   - There are "before deploying, verify that..." checklists.
6. **Tribal knowledge in comments**: scan source files for comments
   that describe operational procedures:
   - "To regenerate this file, run..."
   - "This must be updated whenever..."
   - "Ask [person] about how to..."
   - "The trick is to..."
   Flag these as candidates for executable scripts or runbooks.
7. **Missing from source control**: check for references to files or
   configs that should exist but do not:
   - `.env.example` or `.env.template` referenced but missing.
   - Config files mentioned in docs but not in the repo.
   - Infrastructure-as-code references without corresponding files.
   - Database migration or seed files mentioned but absent.
   - Tool config files (`.editorconfig`, linter configs) mentioned
     in CONTRIBUTING but not present.
8. For each finding, record:
   - Category (one of the six above).
   - Location: file path and line number or section reference.
   - Description of the manual process or missing artifact.
   - Impact estimate: `high` (repeated frequently, error-prone, or
     blocks onboarding), `medium` (done occasionally, moderate risk),
     `low` (rare but worth automating eventually).
   - Effort estimate: `small` (< 1 day), `medium` (1-3 days),
     `large` (> 3 days).
   - Suggested automation approach (e.g., "add a Makefile target",
     "create a GitHub Action", "write a bootstrap script").
9. Produce the output report.

## Output Requirements

Produce a Markdown report with:

- **Summary**: total findings, breakdown by category and impact,
  and a one-paragraph assessment of the repo's automation maturity.
- **Findings by category**: one section per category with a table of
  findings (location, description, impact, effort, suggested
  approach).
- **ROI ranking**: findings sorted by impact/effort ratio -- high
  impact and small effort first.
- **Quick wins**: the top 3-5 findings that deliver the most value
  for the least effort.
- **Missing artifacts checklist**: a simple checklist of files that
  should be added to source control.

## Quality Bar

- Every finding must cite a specific file, line, or documentation
  section -- not a vague "you should automate deploys."
- Impact and effort estimates must be grounded in observable evidence
  (e.g., "the deploy doc has 12 manual steps" justifies high impact).
- The report must distinguish between missing automation and
  automation that exists but is incomplete.
- Suggestions must be concrete (name a specific tool, script type, or
  CI feature) rather than generic advice.
- The missing artifacts checklist must reference the document or
  comment that mentions the missing file.
