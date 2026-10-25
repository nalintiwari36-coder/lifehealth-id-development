import { generateText, gateway } from 'ai'
import { randomUUID } from 'node:crypto'
import { requireSession } from '@/lib/authz'
import { db } from '@/lib/db'
import { auditEvent } from '@/lib/db/schema'
import { extractReportFacts, factsPrompt } from '@/lib/ai/report-grounding'

const MAX_REPORT_CHARS = 24000

export async function POST(request: Request) {
  const session = await requireSession()
  const body = await request.json().catch(() => null)
  const reportText = typeof body?.reportText === 'string' ? body.reportText.trim() : ''
  const sourceDocument = typeof body?.sourceDocument === 'string' ? body.sourceDocument.trim().slice(0, 160) : 'Uploaded report'
  const reportDate = typeof body?.reportDate === 'string' ? body.reportDate.trim().slice(0, 40) : ''

  if (reportText.length < 40) return Response.json({ error: 'Paste at least 40 characters of report text so the assistant can review it.' }, { status: 400 })
  if (reportText.length > MAX_REPORT_CHARS) return Response.json({ error: 'Report text is too long. Please submit up to 24,000 characters at a time.' }, { status: 400 })

  const sourceFacts = extractReportFacts(reportText)

  try {
    const result = await generateText({
      model: gateway('nvidia/nemotron-3-nano-30b-a3b'),
      temperature: 0.1,
      system: `You are LifeHealth ID's medical-report education assistant. You are not a clinician and must not diagnose, prescribe, or invent facts. Use only the report text provided. Preserve exact test names, values, units, and reference ranges. If a value is outside the report's own range, say so; never use an external range. Clearly label extracted facts versus cautious interpretation. If information is missing or ambiguous, say that. Return markdown with these headings exactly: Report facts, Plain-language explanation, Questions for a clinician, Uncertainty and missing information. Keep it concise and patient-friendly. Include a one-sentence reminder that this is educational information, not medical advice.`,
      prompt: `Source document: ${sourceDocument}\nReport date: ${reportDate || 'Not provided'}\n\nStructured facts detected directly in the source (do not add or change values):\n${factsPrompt(sourceFacts)}\n\nReport text:\n${reportText}`,
    })

    await db.insert(auditEvent).values({
      id: randomUUID(),
      userId: session.user.id,
      action: 'record.ai_explanation_requested',
      resourceType: 'health_record',
      resourceId: null,
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
      userAgent: request.headers.get('user-agent'),
    })

    return Response.json({ explanation: result.text, sourceDocument, reportDate, model: 'NVIDIA Nemotron', sourceFacts })
  } catch (error) {
    console.error('Report explanation failed:', error)
    return Response.json({ error: 'The report could not be explained right now. Please try again.' }, { status: 502 })
  }
}
