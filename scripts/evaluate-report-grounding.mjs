import assert from 'node:assert/strict'
import { performance } from 'node:perf_hooks'

const fixtures = [
  { text: 'Hemoglobin: 13.2 g/dL (reference range: 12.0-16.0)', facts: ['Hemoglobin', '13.2', 'g/dL', '12.0-16.0'] },
  { text: 'LDL cholesterol: 145 mg/dL [ref: 0-99]', facts: ['LDL cholesterol', '145', 'mg/dL', '0-99'] },
  { text: 'Notes: sample was hemolyzed. Follow-up recommended.', facts: [] },
]

const pattern = /(^|\n)\s*([A-Za-z][A-Za-z0-9 /().-]{1,70})\s*[:=-]\s*([-+]?\d+(?:\.\d+)?)\s*([A-Za-z%/μµ^0-9.-]+)?(?:\s*(?:\(|\[)?\s*(?:ref(?:erence)?\s*)?(?:range)?\s*[:=]?\s*([-+]?\d+(?:\.\d+)?\s*(?:-|–|to)\s*[-+]?\d+(?:\.\d+)?[^)\]]*)[)\]])?/gi
function extract(text) {
  return [...text.matchAll(pattern)].map((m) => ({ label: m[2].trim(), value: m[3], unit: m[4]?.trim(), range: m[5]?.trim() }))
}
function containsAll(actual, expected) { return expected.every((part) => actual.some((fact) => Object.values(fact).some((value) => value?.includes(part)))) }

const started = performance.now()
let extractionCorrect = 0
let factualConsistency = 0
for (const fixture of fixtures) {
  const actual = extract(fixture.text)
  assert.equal(containsAll(actual, fixture.facts), true)
  extractionCorrect += 1
  factualConsistency += actual.every((fact) => fixture.text.includes(fact.value) && (!fact.unit || fixture.text.includes(fact.unit))) ? 1 : 0
}
const malformed = extract('not a measurement')
assert.deepEqual(malformed, [])
const latencyMs = Number((performance.now() - started).toFixed(2))
const metrics = {
  fixtureCount: fixtures.length,
  extractionAccuracy: extractionCorrect / fixtures.length,
  factualConsistency: factualConsistency / fixtures.length,
  errorHandling: malformed.length === 0,
  latencyMs,
}
console.log(JSON.stringify(metrics, null, 2))
