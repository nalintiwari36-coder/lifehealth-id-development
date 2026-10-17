import { put } from '@vercel/blob'
import { randomUUID } from 'node:crypto'
import { requireSession } from '@/lib/authz'
import { db } from '@/lib/db'
import { auditEvent, healthRecord } from '@/lib/db/schema'

const allowedTypes = new Set(['application/pdf', 'image/jpeg', 'image/png'])
const maxFileSize = 10 * 1024 * 1024

export async function POST(request: Request) {
  const session = await requireSession()
  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return Response.json({ error: 'Choose a medical report file.' }, { status: 400 })
  }
  if (!allowedTypes.has(file.type) || file.size === 0 || file.size > maxFileSize) {
    return Response.json({ error: 'Use a non-empty PDF, JPG, or PNG file up to 10 MB.' }, { status: 400 })
  }

  const recordId = randomUUID()
  const pathname = `medical-records/${session.user.id}/${recordId}/${file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120)}`
  const blob = await put(pathname, file, { access: 'private', addRandomSuffix: false })

  await db.insert(healthRecord).values({
    id: recordId,
    userId: session.user.id,
    title: file.name.replace(/\.[^.]+$/, '').slice(0, 160) || 'Medical report',
    recordType: file.type === 'application/pdf' ? 'PDF report' : 'Image report',
    storagePath: blob.pathname,
  })
  await db.insert(auditEvent).values({
    id: randomUUID(),
    userId: session.user.id,
    action: 'record.uploaded',
    resourceType: 'health_record',
    resourceId: recordId,
  })

  return Response.json({ ok: true, recordId })
}
