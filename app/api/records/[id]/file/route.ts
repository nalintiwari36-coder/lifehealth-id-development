import { get } from '@vercel/blob'
import { and, eq } from 'drizzle-orm'
import { requireApiSession } from '@/lib/consent'
import { db } from '@/lib/db'
import { auditEvent, healthRecord } from '@/lib/db/schema'
import { canAccessRecord } from '@/lib/consent'
import { randomUUID } from 'node:crypto'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireApiSession()
  if (!session) return Response.json({ error: 'Authentication required.' }, { status: 401 })
  const { id } = await params
  const access = await canAccessRecord(session.user.id, id)
  if (!access) return Response.json({ error: 'File unavailable.' }, { status: 404 })
  const [record] = await db
    .select({ id: healthRecord.id, storagePath: healthRecord.storagePath, originalFileName: healthRecord.originalFileName, mimeType: healthRecord.mimeType, status: healthRecord.status })
    .from(healthRecord)
    .where(and(eq(healthRecord.id, id), eq(healthRecord.status, 'available')))
    .limit(1)

  if (!record?.storagePath) return Response.json({ error: 'File unavailable.' }, { status: 404 })

  const result = await get(record.storagePath, {
    access: 'private',
    ifNoneMatch: request.headers.get('if-none-match') ?? undefined,
  })
  if (!result) return Response.json({ error: 'File unavailable.' }, { status: 404 })

  await db.insert(auditEvent).values({
    id: randomUUID(),
    userId: session.user.id,
    action: 'record.downloaded',
    resourceType: 'health_record',
    resourceId: record.id,
    ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
    userAgent: request.headers.get('user-agent'),
  })

  const headers = {
    'Cache-Control': 'private, no-store',
    ETag: result.blob.etag,
    'Content-Disposition': `attachment; filename="${(record.originalFileName ?? 'medical-record').replace(/["\\\r\n]/g, '_') }"`,
    'Content-Type': record.mimeType ?? result.blob.contentType ?? 'application/octet-stream',
  }
  if (result.statusCode === 304) return new Response(null, { status: 304, headers })
  return new Response(result.stream, { headers })
}
