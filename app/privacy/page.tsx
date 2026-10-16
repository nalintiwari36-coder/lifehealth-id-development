import Link from 'next/link'
import { ArrowLeft, HeartPulse, LockKeyhole, ShieldCheck } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary-foreground"><ArrowLeft size={16} /> Back to LifeHealth ID</Link>
        <div className="mt-12 flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><HeartPulse size={20} /></span><span className="text-lg font-semibold text-primary">LifeHealth ID</span></div>
        <p className="eyebrow mt-12">Trust & privacy</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-.05em] text-primary sm:text-5xl">Privacy, in plain language.</h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">LifeHealth ID is a free, nonprofit project. Our goal is to give people a portable place for their health story without turning personal information into a product.</p>
        <div className="mt-12 grid gap-5">
          <section className="rounded-2xl border border-border bg-card p-6"><LockKeyhole className="text-secondary-foreground" size={22} /><h2 className="mt-4 text-xl font-semibold text-primary">You are in control</h2><p className="mt-2 leading-7 text-muted-foreground">You choose what to share, who receives it, and how long access lasts. Access should be visible and revocable.</p></section>
          <section className="rounded-2xl border border-border bg-card p-6"><ShieldCheck className="text-secondary-foreground" size={22} /><h2 className="mt-4 text-xl font-semibold text-primary">No selling health data</h2><p className="mt-2 leading-7 text-muted-foreground">We do not sell personal health information, use it for targeted advertising, or share it for a purpose you did not request.</p></section>
          <section className="rounded-2xl border border-border bg-card p-6"><h2 className="text-xl font-semibold text-primary">A note about this demo</h2><p className="mt-2 leading-7 text-muted-foreground">The landing page demonstration uses synthetic sample data only. It does not connect to medical records, health systems, or external APIs. Explanations are educational and are not a diagnosis or medical advice.</p></section>
        </div>
        <p className="mt-10 text-sm text-muted-foreground">This is a transparency placeholder for the product’s full policy and independent audit materials.</p>
      </div>
    </main>
  )
}

export const metadata = { title: 'Privacy — LifeHealth ID', description: 'LifeHealth ID privacy commitments.' }
