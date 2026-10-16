import 'server-only'

const required = (name: string, value: string | undefined) => {
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

const positiveInteger = (name: string, value: string | undefined, fallback: number) => {
  const parsed = Number(value ?? fallback)
  if (!Number.isInteger(parsed) || parsed <= 0) throw new Error(`Invalid ${name}: expected a positive integer`)
  return parsed
}

const databaseUrl = required('DATABASE_URL', process.env.DATABASE_URL)
const betterAuthSecret = required('BETTER_AUTH_SECRET', process.env.BETTER_AUTH_SECRET)
const betterAuthUrl = process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` :
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.V0_RUNTIME_URL)

export const env = {
  DATABASE_URL: databaseUrl,
  BETTER_AUTH_SECRET: betterAuthSecret,
  BETTER_AUTH_URL: betterAuthUrl,
  RESEND_API_KEY: required('RESEND_API_KEY', process.env.RESEND_API_KEY),
  RESEND_EMAIL_DOMAIN: process.env.RESEND_EMAIL_DOMAIN,
  OTP_LENGTH: positiveInteger('OTP_LENGTH', process.env.OTP_LENGTH, 6),
  OTP_TTL_SECONDS: positiveInteger('OTP_TTL_SECONDS', process.env.OTP_TTL_SECONDS, 600),
  OTP_MAX_ATTEMPTS: positiveInteger('OTP_MAX_ATTEMPTS', process.env.OTP_MAX_ATTEMPTS, 5),
} as const

export const getPublicEnv = () => ({ BETTER_AUTH_URL: env.BETTER_AUTH_URL })
