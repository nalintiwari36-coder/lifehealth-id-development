import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { HeartPulse, LockKeyhole, ShieldCheck } from 'lucide-react'
import { auth } from '@/lib/auth'
import { SignOutButton } from '@/components/sign-out-button'

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  return <main className="min-h-screen bg-[#f8fafc] text-slate-950"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4"><div className="flex items-center gap-2 font-semibold text-[#123f62]"><span className="flex size-8 items-center justify-center rounded-lg bg-[#123f62] text-white"><HeartPulse size={17} /></span> LifeHealth ID</div><SignOutButton /></div></header><div className="mx-auto max-w-6xl px-5 py-12"><div className="flex flex-col gap-3"><p className="text-sm font-medium text-[#109b94]">Private patient dashboard</p><h1 className="text-4xl font-semibold tracking-tight text-[#123f62]">Welcome, {session.user.name}</h1><p className="text-slate-600">Signed in as {session.user.email}</p></div><div className="mt-10 grid gap-5 md:grid-cols-3"><div className="rounded-2xl border border-slate-200 bg-white p-6"><LockKeyhole className="text-[#109b94]" /><h2 className="mt-5 font-semibold text-[#123f62]">Your records</h2><p className="mt-2 text-sm leading-6 text-slate-500">Encrypted records are only available to your authenticated account.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-6"><ShieldCheck className="text-[#109b94]" /><h2 className="mt-5 font-semibold text-[#123f62]">Access control</h2><p className="mt-2 text-sm leading-6 text-slate-500">Every future record query will be scoped to your user ID server-side.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-6"><HeartPulse className="text-[#109b94]" /><h2 className="mt-5 font-semibold text-[#123f62]">Protected foundation</h2><p className="mt-2 text-sm leading-6 text-slate-500">Consent, clinician verification, and audit events build on this session.</p></div></div></div></main>
}
