# LifeHealth ID

LifeHealth ID is a privacy-first health identity experience for securely organizing and sharing a person’s health records.

## Environment setup

Generate a strong Better Auth secret locally:

```bash
openssl rand -base64 32
```

Set the generated value as `BETTER_AUTH_SECRET` in `.env.local` for local development. Set it separately in the Vercel project’s **Preview** and **Production** environments. Each environment must use a different secret; never commit secret values or place them in client-side code.

Rotating `BETTER_AUTH_SECRET` invalidates existing sessions, so users will need to sign in again after a rotation.

The repository includes `.env.example` as a variable reference. Copy its placeholders into `.env.local`, then replace them with environment-specific values.

## Development

```bash
pnpm install
pnpm dev
```

Run the checks with the project environment loaded:

```bash
pnpm test
pnpm build
```
