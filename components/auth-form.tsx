'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setPending(true)
    setError('')
    const result = mode === 'sign-in'
      ? await authClient.signIn.email({ email, password })
      : await authClient.signUp.email({ name, email, password })
    setPending(false)
    if (result.error) {
      setError('We could not complete that request. Check your details and try again.')
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {mode === 'sign-up' && <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">Full name<input required value={name} onChange={(event) => setName(event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 outline-none ring-[#109b94] focus:ring-2" autoComplete="name" /></label>}
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 outline-none ring-[#109b94] focus:ring-2" autoComplete="email" /></label>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">Password<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 outline-none ring-[#109b94] focus:ring-2" autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} /></label>
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <button disabled={pending} className="rounded-full bg-[#123f62] px-5 py-3.5 font-semibold text-white disabled:opacity-60">{pending ? 'Working…' : mode === 'sign-in' ? 'Sign in securely' : 'Create my health ID'}</button>
      <button type="button" onClick={() => { setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in'); setError('') }} className="text-sm font-medium text-[#146f6a]">{mode === 'sign-in' ? 'New here? Create a free ID' : 'Already have an ID? Sign in'}</button>
    </form>
  )
}
