'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [role, setRole] = useState<'patient' | 'doctor'>('patient')
  const [step, setStep] = useState<'details' | 'otp'>('details')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function sendCode() {
    const response = await fetch('/api/otp/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    const result = await response.json().catch(() => null)
    if (!response.ok) throw new Error(result?.error ?? 'Unable to send your code.')
    setStep('otp')
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setPending(true)
    setError('')
    try {
      if (step === 'details') {
        await sendCode()
      } else {
        const verify = await fetch('/api/otp/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code }) })
        if (!verify.ok) throw new Error((await verify.json().catch(() => null))?.error ?? 'Enter the six-digit code.')
        const result = mode === 'sign-in' ? await authClient.signIn.email({ email, password }) : await authClient.signUp.email({ name, email, password })
        if (result.error) throw new Error('We could not complete that request. Check your details and try again.')
        router.push('/dashboard')
        router.refresh()
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return <form onSubmit={submit} className="flex flex-col gap-5">
    {step === 'otp' ? <div className="rounded-2xl border border-[#b9e5e1] bg-[#f0fbfa] p-4"><p className="text-sm font-semibold text-[#123f62]">Check your inbox</p><p className="mt-1 text-xs leading-5 text-slate-600">We sent a secure 6-digit code to {email}.</p></div> : <>
      {mode === 'sign-up' && <fieldset className="flex flex-col gap-2"><legend className="text-sm font-medium text-slate-700">I am registering as</legend><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setRole('patient')} className={`rounded-xl border px-3 py-3 text-sm font-semibold ${role === 'patient' ? 'border-[#109b94] bg-[#f0fbfa] text-[#146f6a]' : 'border-slate-200 text-slate-500'}`}>Patient</button><button type="button" onClick={() => setRole('doctor')} className={`rounded-xl border px-3 py-3 text-sm font-semibold ${role === 'doctor' ? 'border-[#109b94] bg-[#f0fbfa] text-[#146f6a]' : 'border-slate-200 text-slate-500'}`}>Doctor</button></div>{role === 'doctor' && <p className="text-xs leading-5 text-slate-500">Doctor accounts remain pending until credentials are verified by an administrator.</p>}</fieldset>}
      {mode === 'sign-up' && <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">Full name<input required value={name} onChange={(event) => setName(event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 outline-none ring-[#109b94] focus:ring-2" autoComplete="name" /></label>}
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 outline-none ring-[#109b94] focus:ring-2" autoComplete="email" /></label>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">Password<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 outline-none ring-[#109b94] focus:ring-2" autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} /></label>
    </>}
    {step === 'otp' && <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">Verification code<input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} className="rounded-xl border border-slate-200 px-4 py-3 text-center font-mono text-xl tracking-[.3em] outline-none ring-[#109b94] focus:ring-2" autoComplete="one-time-code" /></label>}
    {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    <button disabled={pending} className="rounded-full bg-[#123f62] px-5 py-3.5 font-semibold text-white shadow-lg shadow-[#123f62]/15 transition hover:-translate-y-0.5 disabled:opacity-60">{pending ? 'Working…' : step === 'otp' ? 'Verify and continue' : 'Send secure code'}</button>
    {step === 'otp' && <button type="button" onClick={() => setStep('details')} className="text-sm font-medium text-[#146f6a]">Use a different email</button>}
    {step === 'details' && <button type="button" onClick={() => { setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in'); setError('') }} className="text-sm font-medium text-[#146f6a]">{mode === 'sign-in' ? 'New here? Create a free ID' : 'Already have an ID? Sign in'}</button>}
  </form>
}
