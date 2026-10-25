import { createHash } from 'node:crypto'
import { and, eq, gt } from 'drizzle-orm'
import { db } from '@/lib/db'
import { verification } from '@/lib/db/schema'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const code = typeof body?.code === 'string' ? body.code.trim() : ''
  if (!email || !/^\d{6}$/.test(code)) return Response.json({ error: 'Enter the six-digit code.' }, { status: 400 })
  const hashedCode = createHash('sha256').update(code).digest('hex')
  const rows = await db.select({ id: verification.id }).from(verification).where(and(eq(verification.identifier, `otp:${email}`), eq(verification.value, hashedCode), gt(verification.expiresAt, new Date()))).limit(1)
  if (!rows[0]) return Response.json({ error: 'That code is invalid or expired.' }, { status: 400 })
  await db.delete(verification).where(eq(verification.id, rows[0].id))
  return Response.json({ ok: true })
}
