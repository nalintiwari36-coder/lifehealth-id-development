import { and, eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { db } from '@/lib/db'
import { auditEvent, consentGrant } from '@/lib/db/schema'
import { requireApiSession } from '@/lib/consent'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireApiSession()
  if (!session) return Response.json({ error: 'Authentication required.' }, { status: 401 })
  const { id } = await params
  const [grant] = await db.select().from(consentGrant).where(and(eq(consentGrant.id, id), eq(consentGrant.patientId, session.user.id))).limit(1)
  if (!grant) return Response.json({ error: 'Consent grant not found.' }, { status: 404 })
  return Response.json({ ...grant, viewer: 'patient', expired: Boolean(grant.expiresAt && grant.expiresAt <= new Date()) })
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireApiSession()
  if (!session) return Response.json({ error: 'Authentication required.' }, { status: 401 })
  const { id } = await params
  const now = new Date()
  const result = await db.transaction(async (tx) => {
    const [grant] = await tx.update(consentGrant).set({ status: 'revoked', revokedAt: now }).where(and(eq(consentGrant.id, id), eq(consentGrant.patientId, session.user.id), eq(consentGrant.status, 'active'))).returning({ id: consentGrant.id })
    if (!grant) return null
    await tx.insert(auditEvent).values({ id: randomUUID(), userId: session.user.id, action: 'consent.revoked', resourceType: 'consent_grant', resourceId: id })
    return grant
  })
  if (!result) return Response.json({ error: 'Active consent grant not found.' }, { status: 404 })
  return Response.json({ ok: true, revokedAt: now.toISOString() })
}
