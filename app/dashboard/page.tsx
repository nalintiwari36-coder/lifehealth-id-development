import { requireSession } from '@/lib/authz'
import { SignOutButton } from '@/components/sign-out-button'
import { DashboardHeader, HealthDashboard } from '@/components/health-dashboard'

export default async function DashboardPage() {
  const session = await requireSession()
  return <main className="min-h-screen bg-[#f8fafc] text-slate-950"><DashboardHeader onSignOut={<SignOutButton />} /><HealthDashboard name={session.user.name} /></main>
}
