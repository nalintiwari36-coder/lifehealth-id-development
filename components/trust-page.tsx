import Link from 'next/link'
import { ArrowLeft, CheckCircle2, HeartPulse, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'

type TrustPageProps = { eyebrow: string; title: string; intro: string; sections: { title: string; body: string }[] }

export function TrustPage({ eyebrow, title, intro, sections }: TrustPageProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary-foreground"><ArrowLeft size={16} /> Back to LifeHealth ID</Link>
        <div className="mt-12 flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><HeartPulse size={20} /></span><span className="text-lg font-semibold text-primary">LifeHealth ID</span></div>
        <p className="eyebrow mt-12">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-.05em] text-primary sm:text-5xl">{title}</h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">{intro}</p>
        <div className="mt-12 grid gap-5">{sections.map((section) => <section key={section.title} className="rounded-2xl border border-border bg-card p-6"><h2 className="text-xl font-semibold text-primary">{section.title}</h2><p className="mt-2 leading-7 text-muted-foreground">{section.body}</p></section>)}</div>
        <nav aria-label="Trust pages" className="mt-10 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-secondary-foreground"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/security">Security</Link><Link href="/faq">FAQ</Link><Link href="/contact">Contact</Link><Link href="/accessibility">Accessibility</Link></nav>
      </div>
    </main>
  )
}

export const trustIcons = { CheckCircle2, LockKeyhole, Mail, ShieldCheck }
