import { get } from '@vercel/blob'
import { and, eq } from 'drizzle-orm'
import { requireSession } from '@/lib/authz'
import { db } from '@/lib/db'
import { auditEvent, healthRecord } from '@/lib/db/schema'
import { randomUUID } from 'node:crypto'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession()
  const { id } = await params
  const [record] = await db
    .select({ id: healthRecord.id, storagePath: healthRecord.storagePath, originalFileName: healthRecord.originalFileName, mimeType: healthRecord.mimeType, status: healthRecord.status })
    .from(healthRecord)
    .where(and(eq(healthRecord.id, id), eq(healthRecord.userId, session.user.id)))
    .limit(1)

  if (!record?.storagePath || record.status !== 'available') return Response.json({ error: 'File unavailable.' }, { status: 404 })

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
