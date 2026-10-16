import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { SignOutButton } from '@/components/sign-out-button'
import { DashboardHeader, HealthDashboard } from '@/components/health-dashboard'

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  return <main className="min-h-screen bg-[#f8fafc] text-slate-950"><DashboardHeader onSignOut={<SignOutButton />} /><HealthDashboard name={session.user.name} /></main>
}
