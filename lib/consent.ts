import 'server-only'

import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { consentGrant, healthRecord, organizationMembership, user } from '@/lib/db/schema'

export type ConsentScope = { recordIds: string[] }

export function parseScope(value: string): ConsentScope {
  try {
    const parsed = JSON.parse(value) as { recordIds?: unknown }
    if (!Array.isArray(parsed.recordIds) || parsed.recordIds.length === 0 || parsed.recordIds.some((id) => typeof id !== 'string' || !id)) throw new Error('Invalid scope')
    return { recordIds: [...new Set(parsed.recordIds)] }
  } catch {
    throw new Error('Invalid consent scope')
  }
}

export function serializeScope(scope: ConsentScope) {
  return JSON.stringify({ recordIds: [...new Set(scope.recordIds)] })
}

export async function getApiSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function requireApiSession() {
  const session = await getApiSession()
  if (!session?.user) return null
  return session
}

export async function isVerifiedDoctor(userId: string) {
  const [membership] = await db.select({ id: organizationMembership.id }).from(organizationMembership).where(and(eq(organizationMembership.userId, userId), eq(organizationMembership.role, 'clinician'))).limit(1)
  return Boolean(membership)
}

export async function canAccessRecord(userId: string, recordId: string) {
  const [owned] = await db.select({ id: healthRecord.id }).from(healthRecord).where(and(eq(healthRecord.id, recordId), eq(healthRecord.userId, userId), eq(healthRecord.status, 'available'))).limit(1)
  if (owned) return { kind: 'patient' as const, record: owned }

  const [record] = await db.select({ id: healthRecord.id, userId: healthRecord.userId }).from(healthRecord).where(and(eq(healthRecord.id, recordId), eq(healthRecord.status, 'available'))).limit(1)
  if (!record) return null
  const grants = await db.select({ id: consentGrant.id, scope: consentGrant.scope, expiresAt: consentGrant.expiresAt }).from(consentGrant).where(and(eq(consentGrant.doctorId, userId), eq(consentGrant.patientId, record.userId), eq(consentGrant.status, 'active'))).limit(20)
  for (const grant of grants) {
    if (grant.expiresAt && grant.expiresAt <= new Date()) continue
    if (parseScope(grant.scope).recordIds.includes(recordId)) return { kind: 'doctor' as const, grant, record: { id: recordId } }
  }
  return null
}

export async function getDoctorRecordIds(userId: string) {
  const grants = await db.select({ patientId: consentGrant.patientId, scope: consentGrant.scope, expiresAt: consentGrant.expiresAt }).from(consentGrant).where(and(eq(consentGrant.doctorId, userId), eq(consentGrant.status, 'active')))
  const ids: string[] = []
  for (const grant of grants) {
    if (!grant.expiresAt || grant.expiresAt > new Date()) ids.push(...parseScope(grant.scope).recordIds)
  }
  return [...new Set(ids)]
}

export async function doctorExistsAndVerified(doctorId: string) {
  const [candidate] = await db.select({ id: user.id }).from(user).where(eq(user.id, doctorId)).limit(1)
  return Boolean(candidate && await isVerifiedDoctor(doctorId))
}
