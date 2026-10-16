import fs from 'node:fs'

const source = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'))
const translations = JSON.parse(fs.readFileSync('messages/hi.json', 'utf8'))

function flatten(value, prefix = '') {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return child && typeof child === 'object' && !Array.isArray(child) ? flatten(child, path) : [[path, child]]
  })
}

const sourceEntries = new Map(flatten(source))
const translationEntries = new Map(flatten(translations))
const missing = [...sourceEntries.keys()].filter((key) => !translationEntries.has(key))
if (missing.length) throw new Error(`Missing translation keys: ${missing.join(', ')}`)

for (const [key, value] of sourceEntries) {
  if (typeof value !== 'string') continue
  const placeholders = value.match(/\{[^}]+\}/g) ?? []
  const translated = String(translationEntries.get(key))
  for (const placeholder of placeholders) {
    if (!translated.includes(placeholder)) throw new Error(`Missing placeholder ${placeholder} in ${key}`)
  }
}

console.log(`i18n parity passed: ${sourceEntries.size} keys checked`)
