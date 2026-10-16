import { headers } from 'next/headers'
import { Resend } from 'resend'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => null)
  const recipientEmail = typeof body?.recipientEmail === 'string' ? body.recipientEmail.trim().toLowerCase() : ''
  const recipientRole = body?.recipientRole === 'doctor' ? 'doctor' : 'patient'
  const message = typeof body?.message === 'string' ? body.message.trim() : ''
  if (!recipientEmail || !recipientEmail.includes('@') || message.length < 3 || message.length > 2000) return Response.json({ error: 'Add a valid recipient and a message.' }, { status: 400 })
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: `LifeHealth ID <${process.env.RESEND_EMAIL_DOMAIN ? `no-reply@${process.env.RESEND_EMAIL_DOMAIN}` : 'onboarding@resend.dev'}>`,
    to: [recipientEmail],
    subject: `Secure message from ${session.user.name}`,
    html: `<p>You have a new secure message from <strong>${session.user.name}</strong> on LifeHealth ID.</p><p>${message.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('\n', '<br />')}</p><p>Recipient type: ${recipientRole}</p>`,
  }, { idempotencyKey: `message/${session.user.id}/${crypto.randomUUID()}` })
  if (error) return Response.json({ error: 'We could not deliver the message.' }, { status: 502 })
  return Response.json({ ok: true })
}
