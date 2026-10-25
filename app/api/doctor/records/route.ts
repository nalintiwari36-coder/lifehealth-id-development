import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { healthRecord } from '@/lib/db/schema'
import { getDoctorRecordIds, isVerifiedDoctor, requireApiSession } from '@/lib/consent'

export async function GET() {
  const session = await requireApiSession()
  if (!session) return Response.json({ error: 'Authentication required.' }, { status: 401 })
  if (!(await isVerifiedDoctor(session.user.id))) return Response.json({ error: 'Verified doctor access is required.' }, { status: 403 })
  const ids = await getDoctorRecordIds(session.user.id)
  if (!ids.length) return Response.json({ records: [] })
  const records = await db.select({ id: healthRecord.id, title: healthRecord.title, recordType: healthRecord.recordType, uploadedAt: healthRecord.uploadedAt }).from(healthRecord).where(and(inArray(healthRecord.id, ids), eq(healthRecord.status, 'available')))
  return Response.json({ records })
}
