# LifeHealth ID Secrets Assessment

## Scope and handling rule

This document identifies secret locations and handling risks without reproducing any secret values. The project is a Next.js app with server routes, Better Auth, Postgres/Neon, and Resend.

## Where secrets are expected

| Secret/configuration | Evidence | Runtime exposure |
| --- | --- | --- |
| `DATABASE_URL` and related Postgres variables | `lib/db/index.ts` reads `process.env.DATABASE_URL`; project environment inventory includes database connection variables | Server-only; must never be imported into client code |
| Better Auth secret | Project environment inventory includes `BETTER_AUTH_SECRET`; `lib/auth.ts` initializes Better Auth | Server-only; validate presence and strength at startup |
| `RESEND_API_KEY` | `/api/otp/send`, `/api/messages/send` instantiate `Resend` from it | Server-only; never return to browser |
| `RESEND_EMAIL_DOMAIN` | Both email routes use it to construct the sender | Non-secret configuration, but deployment-controlled |
| Vercel/runtime origin variables | `lib/auth.ts` reads Vercel and v0 origin variables | Configuration; must be allowlisted and not client-controlled |
| `.env.development.local` | Present in the project and ignored by `.gitignore` | Local development only; values must not enter logs or Git |

The project environment inventory also contains provider-generated database aliases and redirect/configuration variables. Their presence is not evidence that every variable is consumed by this application.

## Environment/configuration handling

- Server routes and `lib/auth.ts` read secrets with `process.env`, which keeps them out of client bundles when those modules remain server-only.
- `lib/auth-client.ts` is a client module and imports only `better-auth/react`; it does not read server secret variables.
- `next.config.mjs` has no custom environment inlining or public runtime configuration.
- `.gitignore` excludes `.env*.local`, including the local development file.
- The application does not perform explicit startup validation for required secrets. A missing `DATABASE_URL` can reach `new Pool({ connectionString: undefined })`; missing Resend or auth configuration is also not checked explicitly.

## Hardcoded-secret risks

No hardcoded API key, password, token, or private key was found in the reviewed source files. The code contains identifiers and fallback sender configuration such as `onboarding@resend.dev`, but those are not credentials.

Risk remains if secrets are added to:

- Source files or test fixtures.
- `NEXT_PUBLIC_*` variables or client components.
- URLs, query strings, screenshots, or browser storage.
- Error messages, structured logs, or email bodies.

## Client-side exposure risks

Current reviewed client code does not reference `DATABASE_URL`, `RESEND_API_KEY`, or `BETTER_AUTH_SECRET`. The landing page uses synthetic data and local React state. The main exposure boundary to preserve is the server route boundary: secrets must remain in `lib/auth.ts`, `lib/db/index.ts`, and route handlers only.

Do not pass provider clients, database URLs, auth secrets, or unrestricted signed credentials as props to `app/page.tsx`, `components/*`, or `lib/auth-client.ts`.

## Git/history exposure risks

- `.env*.local` is ignored, which reduces accidental tracking of local environment files.
- Ignore rules do not prevent a secret from being committed under another filename, copied into Markdown, or added to Git history before the ignore rule existed.
- The reviewed repository files do not contain visible secret values.
- A complete repository secret scan is still a recommendation before production release, including Git history and deployment logs.

## Logging and error exposure

- The route handlers return generic error messages for failed email operations and do not return provider error objects.
- No explicit application logger was found in the reviewed source.
- The main residual risk is framework/provider logs or future debugging output capturing request bodies, email addresses, database errors, or environment values. Request bodies to OTP/message routes can contain personal data and must not be logged by default.

## Rotation requirements

- Rotate `RESEND_API_KEY` immediately after suspected disclosure and verify old credentials are revoked.
- Rotate the Better Auth secret according to the provider/library-supported session invalidation procedure; changing signing material can invalidate existing sessions.
- Rotate database credentials through the provider and redeploy all server runtimes; verify pooled and unpooled connection settings.
- Review origin/configuration variables when preview or production domains change.
- Do not rotate by editing source files or committing replacement values.
- Record rotation date, owner, affected environments, revocation status, and validation result in an operational system rather than this repository.

## Findings

### S1 — Missing explicit secret/configuration validation

- **Classification:** Missing control
- **Severity:** Medium
- **Evidence:** `lib/db/index.ts`, `lib/auth.ts`, and both Resend routes read environment variables without explicit presence/format validation.
- **Risk:** Misconfiguration can produce runtime failures or unsafe library defaults that are discovered only after deployment.
- **Affected location:** `lib/db/index.ts`, `lib/auth.ts`, `app/api/otp/send/route.ts`, `app/api/messages/send/route.ts`.
- **Why it matters:** Auth, persistence, and outbound email are security boundaries; silent configuration drift is difficult to detect.
- **Recommended fix:** Add server-only startup/config validation and deployment checks for required variables, without exposing values in errors.

### S2 — Local environment file is correctly ignored, but history scanning is not evidenced

- **Classification:** Recommendation / potential risk requiring verification
- **Severity:** Low to High depending on history findings
- **Evidence:** `.gitignore` contains `.env*.local`; no source scan or history scan result is stored in the project.
- **Risk:** A secret committed before the ignore rule or embedded in an unrelated file would remain recoverable from Git history.
- **Affected location:** Repository history and deployment logs.
- **Why it matters:** Revoking a current variable does not remove historical copies.
- **Recommended fix:** Run an approved secret scanner against the working tree, Git history, CI logs, and deployment logs; rotate any finding.

### S3 — Auth secret usage is implicit in source

- **Classification:** Potential risk requiring verification
- **Severity:** High if the runtime does not provide the required Better Auth secret
- **Evidence:** `BETTER_AUTH_SECRET` is listed in the project environment inventory, but `lib/auth.ts` does not explicitly validate or pass it to Better Auth.
- **Risk:** Library-version defaults or deployment omissions could weaken or break session signing.
- **Affected location:** `lib/auth.ts` and deployment environment configuration.
- **Why it matters:** Session signing is a critical trust root.
- **Recommended fix:** Verify the installed Better Auth version's secret behavior, add a non-secret presence check, and test deployment startup.

## Do not place in this document

Actual values, token strings, passwords, private keys, full connection URLs, or copied environment-file contents.
