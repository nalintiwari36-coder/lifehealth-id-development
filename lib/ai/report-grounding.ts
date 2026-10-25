export type ReportFact = {
  label: string
  value: string
  unit?: string
  referenceRange?: string
  sourceText: string
}

const MEASUREMENT_PATTERN = /(^|\n)\s*([A-Za-z][A-Za-z0-9 /().-]{1,70})\s*[:=-]\s*([-+]?\d+(?:\.\d+)?)\s*([A-Za-z%/μµ^0-9.-]+)?(?:\s*(?:\(|\[)?\s*(?:ref(?:erence)?\s*)?(?:range)?\s*[:=]?\s*([-+]?\d+(?:\.\d+)?\s*(?:-|–|to)\s*[-+]?\d+(?:\.\d+)?[^)\]]*)[)\]])?/gi

export function extractReportFacts(reportText: string): ReportFact[] {
  const facts: ReportFact[] = []
  for (const match of reportText.matchAll(MEASUREMENT_PATTERN)) {
    const label = match[2]?.trim()
    const value = match[3]?.trim()
    if (!label || !value) continue
    const sourceText = match[0].trim().replace(/\s+/g, ' ')
    facts.push({ label, value, unit: match[4]?.trim() || undefined, referenceRange: match[5]?.trim() || undefined, sourceText })
  }
  return facts.slice(0, 100)
}

export function factsPrompt(facts: ReportFact[]) {
  return facts.length
    ? facts.map((fact, index) => `${index + 1}. ${fact.label}: ${fact.value}${fact.unit ? ` ${fact.unit}` : ''}${fact.referenceRange ? `; report range: ${fact.referenceRange}` : ''}`).join('\n')
    : 'No structured measurements were detected. Do not infer any.'
}
