import assert from 'node:assert/strict'

const config = await import(`../next.config.mjs?test=${Date.now()}`)
const headerFor = (environment) => config.buildSecurityHeaders(environment).find((header) => header.key === 'Content-Security-Policy').value

const developmentCsp = headerFor('development')
const productionCsp = headerFor('production')

assert.match(developmentCsp, /'unsafe-eval'/)
assert.doesNotMatch(productionCsp, /'unsafe-eval'/)
console.log('Security header tests passed')
