import { and, desc, eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { db } from '@/lib/db'
import { auditEvent, consentGrant, healthRecord } from '@/lib/db/schema'
import { doctorExistsAndVerified, parseScope, requireApiSession, serializeScope } from '@/lib/consent'

function jsonError(error: string, status: number) { return Response.json({ error }, { status }) }

export async function GET() {
  const session = await requireApiSession()
  if (!session) return jsonError('Authentication required.', 401)
  const grants = await db.select().from(consentGrant).where(eq(consentGrant.patientId, session.user.id)).orderBy(desc(consentGrant.createdAt))
  return Response.json({ grants: grants.map((grant) => ({ ...grant, recordIds: parseScope(grant.scope).recordIds })) })
}

export async function POST(request: Request) {
  const session = await requireApiSession()
  if (!session) return jsonError('Authentication required.', 401)
  let body: { doctorId?: unknown; recordIds?: unknown; expiresAt?: unknown }
  try { body = await request.json() } catch { return jsonError('Invalid JSON.', 400) }
  const doctorId = typeof body.doctorId === 'string' ? body.doctorId : ''
  const recordIds = Array.isArray(body.recordIds) && body.recordIds.every((id) => typeof id === 'string') ? [...new Set(body.recordIds as string[])] : []
  if (!doctorId || !recordIds.length || recordIds.length > 100) return jsonError('A doctor and one to 100 records are required.', 400)
  if (doctorId === session.user.id || !(await doctorExistsAndVerified(doctorId))) return jsonError('The selected doctor is not verified.', 403)
  const expiresAt = body.expiresAt == null || body.expiresAt === '' ? null : new Date(String(body.expiresAt))
  if (expiresAt && (Number.isNaN(expiresAt.getTime()) || expiresAt <= new Date())) return jsonError('Expiration must be a future date.', 400)
  const owned = await db.select({ id: healthRecord.id }).from(healthRecord).where(and(eq(healthRecord.userId, session.user.id), eq(healthRecord.status, 'available')))
  const ownedIds = new Set(owned.map((record) => record.id))
  if (recordIds.some((id) => !ownedIds.has(id))) return jsonError('Consent can only cover your available records.', 403)
  const grantId = randomUUID()
  await db.transaction(async (tx) => {
    await tx.insert(consentGrant).values({ id: grantId, patientId: session.user.id, doctorId, scope: serializeScope({ recordIds }), expiresAt })
    await tx.insert(auditEvent).values({ id: randomUUID(), userId: session.user.id, action: 'consent.granted', resourceType: 'consent_grant', resourceId: grantId })
  })
  return Response.json({ ok: true, grantId }, { status: 201 })
}
