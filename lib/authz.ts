import 'server-only'

import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { and, eq, inArray } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { organizationMembership, patient, patientMembership } from '@/lib/db/schema'

export async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  return session
}

export async function requirePatientAccess(userId: string, patientId: string) {
  const [access] = await db.select({ id: patientMembership.id }).from(patientMembership).where(and(eq(patientMembership.patientId, patientId), eq(patientMembership.userId, userId))).limit(1)
  if (!access) notFound()
  return access
}

export async function requireOrgRole(userId: string, organizationId: string, roles: Array<'owner' | 'admin' | 'clinician' | 'member'>) {
  const [membership] = await db.select({ id: organizationMembership.id, role: organizationMembership.role }).from(organizationMembership).where(and(eq(organizationMembership.organizationId, organizationId), eq(organizationMembership.userId, userId), inArray(organizationMembership.role, roles))).limit(1)
  if (!membership) notFound()
  return membership
}

export async function requirePatientOwner(userId: string, patientId: string) {
  const [owned] = await db.select({ id: patient.id }).from(patient).where(and(eq(patient.id, patientId), eq(patient.ownerUserId, userId))).limit(1)
  if (!owned) notFound()
  return owned
}

export function forbidden() { return Response.json({ error: 'Forbidden' }, { status: 403 }) }
