import { randomInt } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import { verification } from '@/lib/db/schema'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email || !email.includes('@')) return Response.json({ error: 'Enter a valid email address.' }, { status: 400 })

  const code = String(randomInt(100000, 1000000))
  const id = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
  await db.delete(verification).where(eq(verification.identifier, `otp:${email}`))
  await db.insert(verification).values({ id, identifier: `otp:${email}`, value: code, expiresAt, createdAt: new Date(), updatedAt: new Date() })

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: `LifeHealth ID <${process.env.RESEND_EMAIL_DOMAIN ? `no-reply@${process.env.RESEND_EMAIL_DOMAIN}` : 'onboarding@resend.dev'}>`,
    to: [email],
    subject: 'Your LifeHealth ID verification code',
    html: `<p>Your LifeHealth ID verification code is <strong>${code}</strong>.</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>`,
  }, { idempotencyKey: `otp/${email}/${id}` })
  if (error) return Response.json({ error: 'We could not send the verification email.' }, { status: 502 })
  return Response.json({ ok: true })
}
