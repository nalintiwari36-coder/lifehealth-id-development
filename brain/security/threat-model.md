# LifeHealth ID Threat Model

## Assessment scope

This assessment covers the current Next.js 16 application, its landing page, sign-in flow, dashboard, Better Auth integration, Drizzle/Postgres schema, OTP and email routes, deployment configuration, and declared dependencies. The existing `SECURITY_ARCHITECTURE.md` is treated as design intent; only controls visible in the implementation are described as existing.

The landing page uses synthetic sample data. The authenticated dashboard currently renders sample records and does not expose database-backed medical records.

## Assets

| Asset | Evidence | Security need |
| --- | --- | --- |
| User credentials and sessions | Better Auth in `lib/auth.ts`; auth tables in `lib/db/schema.ts` | Confidentiality, integrity, expiration, revocation |
| Email addresses and names | Auth form, Better Auth user table, OTP routes | Minimize exposure and prevent account takeover |
| OTP verification records | `verification` table; `/api/otp/send` and `/api/otp/verify` | Confidentiality, expiration, one-time use, abuse resistance |
| Future health records and consent data | `healthRecord`, `consentGrant`, and `auditEvent` schema tables | Strict subject authorization and auditability |
| Outbound email content | Resend calls in `/api/otp/send` and `/api/messages/send` | Prevent sensitive data leakage and abuse |
| Database connection and auth secrets | Environment variables consumed by `lib/db/index.ts`, Better Auth, and Resend | Never expose to browser, logs, or Git |

## Actors

- Anonymous visitor using the landing page and its synthetic demos.
- Registered patient using email/password authentication.
- Registered doctor account; the UI describes pending verification, but no server-side doctor verification or role persistence is implemented.
- Authenticated user sending a care message through `/api/messages/send`.
- Resend, the outbound email processor.
- Neon/Postgres provider, accessed through `pg` and Drizzle.
- Vercel/Next.js runtime and deployment edge.
- Attacker with no account, stolen credentials, a valid session, or control of a recipient mailbox.

## Trust boundaries and entry points

1. Browser to Next.js page and client-side JavaScript.
2. Browser to Better Auth at `/api/auth/[...all]`.
3. Browser to OTP routes: `POST /api/otp/send` and `POST /api/otp/verify`.
4. Browser to authenticated `POST /api/messages/send`.
5. Server runtime to Postgres through `DATABASE_URL`.
6. Server runtime to Resend through `RESEND_API_KEY`.
7. Deployment configuration and environment variables to the runtime.

There is no implemented upload API, clinician portal, private object storage adapter, webhook route, admin route, or AI route in the current codebase.

## Threats and findings

### T1 — OTP abuse and account-enumeration pressure

- **Classification:** Missing control / potential risk requiring verification
- **Severity:** High if OTP is used as an account-access factor in production
- **Evidence:** `/api/otp/send` accepts an email, writes a six-digit value to `verification`, and sends mail. `/api/otp/verify` accepts the email and code. Neither route authenticates callers or applies a rate limit, attempt counter, lockout, or resend cooldown. `rateLimitBucket` exists in the schema but is not used by these routes.
- **Attack scenario:** An attacker repeatedly requests codes to abuse email delivery or guesses codes against a target email.
- **Impact:** Email-provider cost, denial of service, account takeover risk if OTP is treated as sufficient proof, and privacy leakage through timing or delivery behavior.
- **Likelihood:** Medium.
- **Existing mitigations:** Six-digit random code, ten-minute expiration, deletion after successful verification, basic email and code validation.
- **Missing mitigations:** Per-IP/email rate limits, failed-attempt limits, generic responses, audit events, and a clear binding between verified OTP and the subsequent auth transaction.
- **Recommended fix:** Add server-side throttling and attempt limits, make verification responses uniform, bind a successful challenge to a short-lived server-side transaction, and require review before using OTP as an authentication factor.

### T2 — Client-controlled account role is not persisted or enforced

- **Classification:** Security weakness / missing control
- **Severity:** Medium
- **Evidence:** `components/auth-form.tsx` exposes `patient` and `doctor` choices, but `role` is only client state and is never sent to Better Auth or stored. `lib/db/schema.ts` has no role, organization membership, or doctor-verification table.
- **Attack scenario:** A caller assumes the visible doctor choice grants clinician capabilities, or a future endpoint trusts the client-provided role.
- **Impact:** Privilege confusion and possible unauthorized clinician access when protected features are added.
- **Likelihood:** Medium for future expansion; no current clinician endpoint grants access.
- **Existing mitigations:** No current doctor-only endpoint is present; dashboard access only checks for an authenticated user.
- **Missing mitigations:** Server-side role model, verification state, organization scope, and authorization middleware/policy.
- **Recommended fix:** Add server-owned roles and verification records before implementing clinician capabilities; derive authority only from the session and database.

### T3 — Database rows do not consistently encode or enforce ownership

- **Classification:** Missing control / potential risk requiring verification
- **Severity:** High once health data APIs are added
- **Evidence:** `healthRecord.userId`, `auditEvent.userId`, and notification user IDs exist, but the current code has no record or consent route and no query policy layer. `lib/db/index.ts` creates a general Drizzle client from `DATABASE_URL`; application code would be responsible for every ownership predicate.
- **Attack scenario:** A future handler reads a record by ID without constraining it to the authenticated session user, creating an IDOR.
- **Impact:** Cross-user disclosure of health records or audit data.
- **Likelihood:** Medium during future API development.
- **Existing mitigations:** Foreign keys in the migration preserve references; the dashboard itself uses sample in-memory records.
- **Missing mitigations:** Centralized authorization helpers, mandatory user-scoped query patterns, tests for cross-user access, and role/consent predicates.
- **Recommended fix:** Implement deny-by-default policy functions and tests before exposing database-backed records; require session subject predicates in every protected query.

### T4 — Email route sends user-controlled message content

- **Classification:** Security weakness / potential risk requiring verification
- **Severity:** Medium
- **Evidence:** `/api/messages/send` accepts `recipientEmail`, `recipientRole`, and a message up to 2,000 characters. The message is HTML-escaped, but recipient authorization, relationship/consent checks, outbound quotas, and audit logging are absent.
- **Attack scenario:** An authenticated user uses the route for spam or sends sensitive content to an unintended address.
- **Impact:** Privacy disclosure, abuse of the service, and email reputation damage.
- **Likelihood:** Medium.
- **Existing mitigations:** Session authentication, basic validation, lowercasing of email, message length cap, HTML escaping, Resend idempotency key.
- **Missing mitigations:** Verified recipient relationship, consent/purpose check, rate limiting, PHI-minimizing templates, and audit events.
- **Recommended fix:** Add authorization and destination verification, rate limits and abuse monitoring, content policy, and an audit record that excludes message bodies.

### T5 — Authentication security configuration is environment-dependent

- **Classification:** Potential risk requiring verification
- **Severity:** High if production secrets/origins are misconfigured
- **Evidence:** `lib/auth.ts` derives `baseURL` and trusted origins from environment variables. Development sets `sameSite: 'none'` and `secure: true`; production does not explicitly set cookie attributes. `BETTER_AUTH_SECRET` is present in the project environment inventory but is not explicitly referenced in source.
- **Attack scenario:** A deployment has an incorrect base URL, missing secret, or incomplete trusted-origin configuration, causing auth failure or unsafe cross-origin behavior.
- **Impact:** Login loops, session exposure, or acceptance of unintended origins depending on library defaults and deployment state.
- **Likelihood:** Medium.
- **Existing mitigations:** Better Auth manages password hashing/session behavior; production origins are derived from Vercel variables; session lifetime is seven days with daily update age.
- **Missing mitigations:** Startup validation for required auth configuration, explicit production cookie policy, and automated trusted-origin tests.
- **Recommended fix:** Verify Better Auth's required secret and cookie defaults for the installed version, fail deployment on missing/invalid values, and test exact preview/production origin behavior.

## Risk summary

The current landing page is a synthetic demo and is not evidence of production health-data protection. The most important implementation risks before accepting real health information are OTP abuse controls, server-owned roles and authorization, user-scoped database access, private object storage authorization, and explicit production auth configuration.

## Out of scope / not evidenced

No claim is made about malware scanning, encryption-at-rest configuration, RLS, CSP enforcement, WAF/rate limiting, backups, clinician verification, consent enforcement, webhooks, or production monitoring because those controls are not visible in the current implementation.

## Recommended validation order

1. Verify Better Auth secret, cookie, and trusted-origin behavior in a deployed environment.
2. Add and test rate limiting for OTP and email routes.
3. Establish server-side roles and ownership/consent policy helpers before adding health-record handlers.
4. Add negative integration tests for anonymous, cross-user, revoked, expired, and malformed requests.
5. Define storage, backup, audit-sink, and operational controls before production data onboarding.

---

**Classification key:** Confirmed vulnerability means the current code demonstrably permits a harmful condition. Security weakness means a control exists only partially. Missing control means the code does not implement the expected control. Potential risk requiring verification means the result depends on runtime/provider configuration not visible in source. Recommendation means a proposed next step, not an implemented control.
