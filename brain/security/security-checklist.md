# LifeHealth ID Security Checklist

This checklist is specific to the current implementation. `[x]` means evidenced in reviewed code, `[ ]` means not evidenced or not yet implemented, and `[?]` requires runtime/provider verification. Do not treat an unchecked item as proof of a vulnerability without validating the relevant flow.

## Authentication

- [x] Better Auth email/password authentication is enabled in `lib/auth.ts`.
- [x] Password/auth requests are handled by Better Auth rather than custom password hashing.
- [ ] Verify `BETTER_AUTH_SECRET` is present, strong, and explicitly validated at startup.
- [ ] Add production authentication integration tests for sign-up, sign-in, invalid credentials, and session expiration.
- [ ] Decide and implement MFA/step-up authentication for clinician and administrative actions.

## Authorization and RBAC

- [x] `/dashboard` and `/api/messages/send` require a Better Auth session.
- [ ] Persist and enforce server-side patient/doctor/admin roles.
- [ ] Implement organization membership and clinician verification before clinician access exists.
- [ ] Add consent, purpose, expiry, and revocation predicates to every future health-record query.
- [ ] Add negative tests for IDOR, cross-user reads, cross-organization reads, and revoked consent.

## Session and token security

- [x] Sessions have a seven-day expiration and daily update age in `lib/auth.ts`.
- [x] Auth routes are server-backed through Better Auth.
- [?] Verify actual production cookie flags, secret signing, domain, and trusted-origin behavior for the installed Better Auth version.
- [ ] Add explicit production cookie configuration and startup checks where supported.
- [ ] Define session revocation and account-recovery procedures.

## Input validation

- [x] OTP routes validate email shape and six-digit code format.
- [x] Message route validates recipient shape and message length.
- [ ] Use a shared schema validator for all JSON route bodies.
- [ ] Enforce request-body size limits at the edge/runtime.
- [ ] Normalize and validate recipient authorization, role, and future record identifiers server-side.

## Injection and XSS

- [x] Message HTML escapes `&`, `<`, `>`, and newlines before placing the message in HTML.
- [x] React renders user-controlled text through normal escaped JSX in reviewed UI.
- [ ] Add a security header policy, beginning with report-only CSP and an inventory of required origins.
- [ ] Keep database queries parameterized and allowlist future sort/filter fields.
- [ ] Add XSS tests for message content, names, emails, filenames, and future record metadata.

## CSRF and API security

- [x] Mutating dashboard email route requires an authenticated Better Auth session.
- [ ] Verify Better Auth's origin/CSRF behavior for the installed version and deployment mode.
- [ ] Add explicit origin checks for custom mutating routes where appropriate.
- [ ] Return generic auth/OTP responses to reduce account enumeration.
- [ ] Add consistent content-type, method, body-size, and error handling across routes.

## Rate limiting and abuse

- [x] A `rate_limit_bucket` table exists in the schema.
- [ ] Apply rate limits to OTP send, OTP verify, auth attempts, and outbound messages; no usage is visible in current routes.
- [ ] Add per-IP and per-email failed-attempt limits and resend cooldowns.
- [ ] Add abuse alerts, quotas, and Resend delivery monitoring.
- [ ] Test exhaustion and recovery behavior.

## File uploads

- [x] Current dashboard file input restricts its browser accept hint to PDF/JPG/JPEG/PNG.
- [ ] Add a server upload route before accepting real files.
- [ ] Validate size, MIME by content, extension, filename, and archive/polyglot behavior server-side.
- [ ] Quarantine and malware-scan uploads before availability.
- [ ] Store objects privately under opaque random keys; authorize every download with a short-lived URL.
- [ ] Set safe download headers and never execute or render untrusted content inline without review.

## Database security

- [x] Drizzle uses parameterized query builders in current OTP routes.
- [x] Foreign keys and ownership indexes exist in the migration.
- [ ] Use separate least-privilege runtime/migration/reporting roles.
- [ ] Add mandatory user/organization predicates and authorization helpers for future queries.
- [ ] Decide whether deployment-supported RLS is appropriate; application checks remain mandatory.
- [ ] Encrypt backups, test restore, and document retention/deletion behavior.

## Secrets

- [x] Local `.env*.local` files are ignored by Git.
- [x] Server code reads database, auth, and Resend configuration through `process.env`.
- [ ] Run a repository and history secret scan before release.
- [ ] Add startup validation without printing values.
- [ ] Document owners, rotation, revocation, and incident response for database, auth, and Resend credentials.
- [ ] Ensure no secret is prefixed `NEXT_PUBLIC_` or passed to client components.

## Encryption

- [x] The deployment architecture is expected to use platform TLS, but source does not configure it.
- [?] Verify TLS, database encryption, backup encryption, and provider regions in deployment/provider settings.
- [ ] Define managed KMS/key ownership and rotation for future medical objects and backups.
- [ ] Do not claim application-level encryption until implemented and tested.

## CORS

- [x] No custom CORS handler or permissive `Access-Control-Allow-Origin` header was found.
- [?] Verify hosting/framework defaults for cross-origin requests to Better Auth and custom routes.
- [ ] Add an explicit origin policy if any API must be called cross-origin; never reflect arbitrary origins.

## Dependency security

- [x] `pnpm-lock.yaml` is committed.
- [ ] Run dependency audit/SCA and review high/critical findings.
- [ ] Keep Next.js, Better Auth, Resend, Drizzle, and `pg` patched.
- [ ] Review third-party scripts and analytics data collection before production health data.
- [ ] Add CI checks for lockfile integrity and known vulnerabilities.

## Logging and monitoring

- [x] Current email routes return generic provider failure messages rather than raw provider objects.
- [ ] Add structured security events without OTPs, tokens, message bodies, or secret values.
- [ ] Add audit events for auth, consent, record access, exports, and admin actions.
- [ ] Monitor OTP abuse, auth failures, Resend failures, database errors, and unusual access.
- [ ] Protect audit sinks and define retention/alerting.

## Admin security

- [ ] No admin surface or server-side admin role exists today.
- [ ] Define separate admin roles, least privilege, step-up MFA, approval, and support-impersonation rules before adding admin features.
- [ ] Audit every role change, verification decision, export, deletion, and break-glass action.

## Deployment and infrastructure

- [x] Next.js deployment configuration is minimal and does not expose custom security headers.
- [ ] Add baseline headers appropriate to the deployment: nosniff, referrer policy, HSTS, frame policy where appropriate, permissions policy, and an evaluated CSP.
- [ ] Verify trusted origins and cookie behavior for preview and production domains.
- [ ] Configure WAF/rate limiting, alerting, backups, restore drills, and incident response.
- [ ] Confirm database/storage/AI/email regions and contractual requirements.

## Data privacy

- [x] Landing page privacy copy states that demo data is synthetic and the project does not sell health data.
- [x] Current landing-page records are hardcoded sample data, not real patient records.
- [ ] Define data minimization, retention, deletion, correction, export, legal hold, and user support procedures.
- [ ] Define notification policy that avoids medical details in email subjects/bodies by default.
- [ ] Complete privacy/legal review for applicable jurisdictions before real health data.

## Error handling

- [x] JSON parsing failures are handled in OTP/message routes.
- [x] Current user-facing email failure is generic.
- [ ] Add a global error boundary and server-side redaction policy for production diagnostics.
- [ ] Ensure database, provider, and auth errors never expose credentials, SQL, tokens, or sensitive record content.
- [ ] Test malformed JSON, missing fields, oversized bodies, provider failure, and database outage behavior.

## Backup and recovery

- [ ] No backup, restore, retention, or disaster-recovery implementation is visible in the application repository.
- [ ] Configure encrypted backups and an immutable retention window through the database/storage provider.
- [ ] Define RPO/RTO and run documented restore drills.
- [ ] Separate backup credentials from application credentials.
- [ ] Test provider outage behavior for auth, database, email, and future object storage.

## Release gate

Before the product accepts real health information, require evidence for all high-impact unchecked items: secret validation, OTP abuse controls, server-side roles and authorization, consent enforcement, private storage, security headers, dependency scanning, audit/monitoring, encrypted backups, restore testing, privacy/legal review, and independent security testing.

### Finding format used by this project

For important findings, record: **Severity → Evidence → Risk → Affected location → Why it matters → Recommended fix**. Each item must be labeled as a confirmed vulnerability, security weakness, missing control, potential risk requiring verification, or recommendation. This checklist intentionally does not claim that unchecked controls exist.
