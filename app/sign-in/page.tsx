import Link from 'next/link'
import { HeartPulse, ShieldCheck } from 'lucide-react'
import { AuthForm } from '@/components/auth-form'

export default function SignInPage({ returnTo, initialMode }: { returnTo?: string; initialMode?: 'sign-in' | 'sign-up' }) {
  return <main className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-5 py-12"><div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2"><div className="bg-[#123f62] p-8 text-white sm:p-12"><Link href="/" className="flex items-center gap-2 font-semibold"><span className="flex size-9 items-center justify-center rounded-xl bg-white/10"><HeartPulse size={19} /></span> LifeHealth ID</Link><div className="mt-20"><ShieldCheck className="text-[#8fe1d9]" size={30} /><h1 className="mt-6 text-4xl font-semibold tracking-tight">Your records. Your permission.</h1><p className="mt-5 leading-7 text-blue-100">Secure access for your lifelong health record. We never sell your health information.</p></div></div><div className="p-8 sm:p-12"><h2 className="text-2xl font-semibold text-[#123f62]">Welcome back</h2><p className="mt-2 mb-8 text-sm text-slate-500">Use your LifeHealth ID to continue.</p><AuthForm returnTo={returnTo} initialMode={initialMode} /></div></div></main>
}
