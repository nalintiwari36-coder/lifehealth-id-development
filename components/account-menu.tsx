'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown, LayoutDashboard, LogOut, Settings } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import type { Locale } from '@/lib/i18n'

type AccountCopy = {
  signIn: string
  signUp: string
  dashboard: string
  settings: string
  signOut: string
  openAccount: string
  signedOut: string
}

function safeReturnPath(pathname: string, locale: Locale) {
  return pathname.startsWith(`/${locale}`) && !pathname.startsWith('//') ? pathname : `/${locale}`
}

export function AccountMenu({ locale, copy }: { locale: Locale; copy: AccountCopy }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, isPending } = authClient.useSession()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const returnTo = encodeURIComponent(safeReturnPath(pathname, locale))

  useEffect(() => {
    function closeOnOutside(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        ;(event.target as HTMLElement).blur()
      }
    }
    document.addEventListener('mousedown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  async function handleSignOut() {
    setOpen(false)
    await authClient.signOut()
    router.push(`/${locale}`)
    router.refresh()
  }

  if (isPending) return <span className="inline-block size-9 animate-pulse rounded-full bg-muted" aria-hidden="true" />
  if (!session?.user) {
    return <div className="flex items-center gap-2"><a href={`/${locale}/sign-in?returnTo=${returnTo}`} className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4 sm:text-sm">{copy.signIn}</a><a href={`/${locale}/sign-in?mode=sign-up&returnTo=${returnTo}`} className="hidden rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex sm:px-4 sm:text-sm">{copy.signUp}</a></div>
  }

  const name = session.user.name?.trim() || session.user.email || 'Account'
  const initials = name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  return <div ref={menuRef} className="relative"><button type="button" onClick={() => setOpen((value) => !value)} aria-haspopup="menu" aria-expanded={open} aria-label={copy.openAccount} className="flex items-center gap-2 rounded-full border border-border bg-card px-2.5 py-1.5 text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{initials}</span><span className="hidden max-w-28 truncate sm:inline">{name}</span><ChevronDown aria-hidden="true" className="size-4" /></button>{open && <div role="menu" className="absolute end-0 top-full z-50 mt-2 flex min-w-52 flex-col gap-1 rounded-2xl border border-border bg-card p-2 shadow-xl"><a role="menuitem" href={`/${locale}/dashboard`} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><LayoutDashboard className="size-4" aria-hidden="true" />{copy.dashboard}</a><a role="menuitem" href={`/${locale}/account`} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Settings className="size-4" aria-hidden="true" />{copy.settings}</a><button role="menuitem" type="button" onClick={handleSignOut} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm text-destructive hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><LogOut className="size-4" aria-hidden="true" />{copy.signOut}</button></div>}</div>
}
