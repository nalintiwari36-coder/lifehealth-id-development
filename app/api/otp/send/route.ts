import { randomInt } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import { verification } from '@/lib/db/schema'
import { env } from '@/lib/env'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email || !email.includes('@')) return Response.json({ error: 'Enter a valid email address.' }, { status: 400 })

  if (!env.RESEND_EMAIL_DOMAIN) {
    return Response.json({ error: 'Email delivery is not configured.' }, { status: 503 })
  }

  const code = String(randomInt(100000, 1000000))
  const id = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
  const identifier = `otp:${email}`
  await db.delete(verification).where(eq(verification.identifier, identifier))
  await db.insert(verification).values({ id, identifier, value: code, expiresAt, createdAt: new Date(), updatedAt: new Date() })

  try {
    const resend = new Resend(env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: `LifeHealth ID <no-reply@${env.RESEND_EMAIL_DOMAIN}>`,
      to: [email],
      subject: 'Your LifeHealth ID verification code',
      html: `<p>Your LifeHealth ID verification code is <strong>${code}</strong>.</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>`,
    }, { idempotencyKey: `otp/${id}` })
    if (error) {
      await db.delete(verification).where(eq(verification.id, id))
      console.error('[otp] Resend rejected verification email', {
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
        recipient: email,
        senderDomain: env.RESEND_EMAIL_DOMAIN,
      })
      return Response.json({ error: 'We could not send the verification email.' }, { status: error.statusCode === 429 ? 429 : 502 })
    }
  } catch (error) {
    await db.delete(verification).where(eq(verification.id, id))
    console.error('[otp] Unexpected email delivery failure', { message: error instanceof Error ? error.message : 'unknown error' })
    return Response.json({ error: 'We could not send the verification email.' }, { status: 502 })
  }

  return Response.json({ ok: true })
}
