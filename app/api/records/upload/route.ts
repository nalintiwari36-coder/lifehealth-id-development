import { del, put } from '@vercel/blob'
import { createHash, randomUUID } from 'node:crypto'
import { requireSession } from '@/lib/authz'
import { db } from '@/lib/db'
import { auditEvent, healthRecord } from '@/lib/db/schema'

const allowedTypes = new Set(['application/pdf', 'image/jpeg', 'image/png'])
const maxFileSize = 10 * 1024 * 1024

function sanitizeFileName(name: string) {
  return name.normalize('NFKC').replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120) || 'medical-report'
}

function hasExpectedSignature(type: string, bytes: Uint8Array) {
  if (type === 'application/pdf') return new TextDecoder().decode(bytes.slice(0, 5)) === '%PDF-'
  if (type === 'image/png') return bytes.length >= 8 && bytes.slice(0, 8).every((value, index) => value === [137, 80, 78, 71, 13, 10, 26, 10][index])
  if (type === 'image/jpeg') return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  return false
}

export async function POST(request: Request) {
  const session = await requireSession()
  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) return Response.json({ error: 'Choose a medical report file.' }, { status: 400 })
  if (!allowedTypes.has(file.type) || file.size === 0 || file.size > maxFileSize) {
    return Response.json({ error: 'Use a non-empty PDF, JPG, or PNG file up to 10 MB.' }, { status: 400 })
  }

  const bytes = new Uint8Array(await file.arrayBuffer())
  if (!hasExpectedSignature(file.type, bytes)) return Response.json({ error: 'The file content does not match its declared type.' }, { status: 400 })

  const recordId = randomUUID()
  const fileName = sanitizeFileName(file.name)
  const pathname = `medical-records/${session.user.id}/${recordId}/${fileName}`
  const sha256 = createHash('sha256').update(bytes).digest('hex')
  let blobPath: string | undefined

  try {
    const blob = await put(pathname, new Blob([bytes], { type: file.type }), { access: 'private', addRandomSuffix: false })
    blobPath = blob.pathname
    await db.insert(healthRecord).values({
      id: recordId,
      userId: session.user.id,
      title: fileName.replace(/\.[^.]+$/, '').slice(0, 160) || 'Medical report',
      recordType: file.type === 'application/pdf' ? 'PDF report' : 'Image report',
      storagePath: blob.pathname,
      originalFileName: fileName,
      mimeType: file.type,
      byteSize: bytes.byteLength,
      sha256,
      storageProvider: 'vercel-blob',
      status: 'available',
      uploadedAt: new Date(),
    })
    await db.insert(auditEvent).values({
      id: randomUUID(),
      userId: session.user.id,
      action: 'record.uploaded',
      resourceType: 'health_record',
      resourceId: recordId,
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
      userAgent: request.headers.get('user-agent'),
    })
    return Response.json({ ok: true, recordId })
  } catch (error) {
    if (blobPath) await del(blobPath).catch((cleanupError) => console.error('Upload cleanup failed:', cleanupError))
    console.error('Medical record upload failed:', error)
    return Response.json({ error: 'The medical report could not be stored.' }, { status: 500 })
  }
}
