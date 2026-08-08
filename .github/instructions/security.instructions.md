# Security — Always-On Rules

These rules apply to ALL code. Never violate them.

---

## Dependency And Package Hygiene

- **No evidence, no claim** — Never make security claims without manifests, lockfiles, scanner output, or other concrete package evidence
- **Audit every audit unit** — Check each service, app, package, library, or deployable component independently
- **Prefer native security tooling** — Use the strongest available ecosystem-native audit and license tools before inventing custom checks
- **Check direct and transitive dependencies** — Review both first-order and pulled-in packages for known vulnerabilities
- **Treat stale security packages as risk** — Prioritize materially outdated security-sensitive dependencies, not trivial patch drift
- **Missing lockfiles are findings** — Treat absent or incomplete lockfiles and manifests as dependency-hygiene failures
- **Pin dependencies** — Use exact versions or lockfiles. Don't float on ranges for security-critical packages
- **Audit weekly** — Run `npm audit` / `dotnet list package --vulnerable` / `pip-audit` as part of regular workflow

---

## Code-Level Security

- **Validate all external input** — Never trust data from users, APIs, files, or environment without validation and sanitization
- **No secrets in source** — API keys, tokens, passwords, connection strings never in code. Use environment variables, vaults, or managed identity
- **Parameterize all queries** — Never concatenate user input into SQL, LDAP, shell commands, or any query language
- **Encode output contextually** — HTML-encode for HTML, URL-encode for URLs, JSON-encode for JSON. No raw interpolation of user data into output
- **Use HTTPS everywhere** — No HTTP endpoints in production. Redirect HTTP to HTTPS
- **Set security headers** — CSP, X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security at minimum
- **Principle of least privilege** — Services, tokens, IAM roles, and database users get only the permissions they actually need
- **No hardcoded credentials in tests** — Even test credentials should come from env/config, not source code
- **Sensitive data in logs** — Never log passwords, tokens, PII, credit cards, or session IDs. Mask or omit

---

## Authentication And Authorization

- **Auth at the boundary** — Verify identity and permissions at the entry point (middleware/filter), not scattered through business logic
- **Fail closed** — If auth check fails or is ambiguous, deny access. Never default to allowing
- **Session management** — Use secure, HttpOnly, SameSite cookies. Regenerate session IDs after login. Set reasonable expiry
- **Rate limit auth endpoints** — Login, password reset, and token endpoints must have rate limiting and lockout
- **Don't roll your own crypto** — Use established libraries for hashing (bcrypt/argon2), encryption (AES-256), and JWT validation

---

## Remediation And Reporting

- **Use exact versions** — Record exact package names, versions, manifests, lockfiles, and advisory IDs in findings and fixes
- **License issues must be concrete** — Report incompatible, restricted, or unknown licenses only when the evidence is explicit
- **Do not guess blocked checks** — If a scanner or audit cannot run, say exactly why and lower confidence instead of inferring a result
- **Separate observed from inferred risk** — Distinguish scanner-confirmed findings from broader hygiene concerns
- **Rank by severity and confidence** — Fix the highest-severity, highest-confidence package risks first
- **Call out clean surfaces explicitly** — Mark services or packages with no findings instead of leaving coverage ambiguous
- **Every finding needs a fix** — Don't just report problems. Propose the specific remediation (upgrade to version X, replace with Y, add validation at Z)
