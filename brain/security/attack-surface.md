# LifeHealth ID Attack Surface

## Scope

The current application is a Next.js 16 App Router project. The landing page is public and uses synthetic sample data. Authenticated server functionality currently consists of Better Auth, OTP routes, and a secure-message email route.

## Public endpoints and pages

| Surface | Evidence | Notes |
| --- | --- | --- |
| `/` | `app/page.tsx` | Public landing page; interactive demos are local state and synthetic records. |
| `/privacy` | `app/privacy/page.tsx` | Public static privacy/transparency page. |
| `/sign-in` | `app/sign-in/page.tsx` | Public sign-in/sign-up UI; calls OTP and Better Auth. |
| `/api/auth/[...all]` | `app/api/auth/[...all]/route.ts` | Better Auth GET/POST catch-all handler. Exact subroutes are library-defined. |
| `POST /api/otp/send` | `app/api/otp/send/route.ts` | Unauthenticated email OTP generation and delivery. |
| `POST /api/otp/verify` | `app/api/otp/verify/route.ts` | Unauthenticated OTP verification. |
| `POST /api/messages/send` | `app/api/messages/send/route.ts` | Authenticated Resend email delivery. |
| `/dashboard` | `app/dashboard/page.tsx` | Server page redirects unauthenticated visitors to `/sign-in`. |

No other route handlers were found in the reviewed project.

## Authentication and authorization surfaces

- Better Auth is configured in `lib/auth.ts` with email/password enabled, automatic sign-in, seven-day sessions, and daily session update age.
- The auth catch-all uses `toNextJsHandler(auth)`.
- The dashboard checks `auth.api.getSession({ headers: await headers() })` before rendering.
- The message route performs the same authenticated-session check.
- OTP routes do not authenticate callers; they are challenge endpoints.
- The sign-up UI collects a patient/doctor choice, but that role is local React state and is not sent or persisted.
- No server-side role, doctor verification, organization membership, consent policy, admin route, or break-glass route is implemented.

## User inputs

- Auth form: name, email, password, and six-digit OTP.
- OTP send/verify JSON request bodies.
- Message route JSON: recipient email, recipient role, message.
- Public landing-page search, filter, term selection, sharing simulator, question checkboxes, language selector, and file input are demo-only client state.
- Authenticated dashboard message form and file input are interactive; the dashboard upload input closes the modal and increments a sample counter but does not upload to a server.

Current validation includes basic email shape checks, six-digit OTP format, password minimum length in the browser, and message length bounds. Server-side authentication validation is delegated to Better Auth.

## File uploads

- `components/health-dashboard.tsx` has a file input accepting PDF/JPG/JPEG/PNG and displays a local demo result.
- No upload route, server-side MIME sniffing, size enforcement, malware scanning, private object storage, quarantine, or download authorization exists in the current code.
- The landing-page upload simulator is explicitly sample-data UI.

Therefore, real medical file upload is not currently implemented. Any future upload endpoint will be a new high-value attack surface.

## Database access

- `lib/db/index.ts` creates a `pg` Pool from `DATABASE_URL` and passes it to Drizzle with the schema.
- `lib/db/schema.ts` defines Better Auth tables plus audit events, health records, consent grants, notifications, and a rate-limit bucket.
- The migration adds foreign keys and several indexes.
- Current route handlers only use `verification`; no current route reads health records, consent grants, or audit events.
- No RLS policy, database runtime-role configuration, authorization helper, or transaction wrapper is visible in application code.

## Storage

No object storage integration or blob route was found. `healthRecord.storagePath` is a database field only; it is not connected to a storage provider.

## Webhooks

No webhook route or signature-verification implementation was found. Resend is used for outbound email only in the reviewed code.

## Third-party integrations

- Better Auth / `better-auth` for auth and sessions.
- Postgres/Neon-compatible database through `pg` and Drizzle.
- Resend for outbound OTP and secure-message email.
- Vercel Analytics is rendered in `app/layout.tsx` only when `NODE_ENV === 'production'`.
- Lucide React supplies icons; it is not a security boundary.

Provider configuration, data-processing terms, regions, retention, and account-level controls are outside the source code and require verification in the deployment/provider consoles.

## Admin surfaces

No admin page, admin API, role-management endpoint, clinician verification endpoint, support impersonation surface, or server-side administrative action was found.

## Network and deployment exposure

- `next.config.mjs` only configures the experimental typed routes flag; no response security headers are configured there.
- No `proxy.ts`, `middleware.ts`, or equivalent route-wide request policy was found.
- Origin trust is configured in `lib/auth.ts` using environment-derived Vercel/v0 URLs and localhost in development.
- The app relies on the hosting platform and framework for TLS/edge behavior; WAF, rate limiting, CSP, frame policy, and permissions policy are not configured in the reviewed source.
- Production analytics is an external client-facing integration and should remain free of health data; current landing-page content is synthetic.

## Dependencies and externally reachable surfaces

Dependencies include Next.js, React, Better Auth, Drizzle, `pg`, Resend, Vercel Analytics, Tailwind/shadcn packages, and Lucide React. The external security surface includes framework routing, Better Auth's generated routes and cookies, Postgres connectivity, Resend delivery, and any runtime-provided deployment configuration.

The lockfile is committed. A dependency vulnerability scan and review of transitive packages is recommended; no scan result is asserted here.

## Highest-priority surfaces

1. Better Auth catch-all and session cookie behavior.
2. Unauthenticated OTP generation and verification.
3. Authenticated outbound email route and recipient authorization.
4. Future database-backed health-record and consent handlers.
5. Any future real upload/storage implementation.
6. Deployment headers, origin configuration, provider regions, and secret lifecycle.
