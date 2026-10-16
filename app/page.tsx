'use client'

import { useState } from 'react'
import {
  Activity,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  FileText,
  HeartPulse,
  LockKeyhole,
  Menu,
  QrCode,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Upload,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react'

const navItems = ['Mission', 'How it works', 'For doctors', 'Trust & privacy']
const timeline = [
  { date: '24 May 2025', title: 'Blood panel', source: 'Northside Medical · Verified', tone: 'blue', icon: Activity },
  { date: '12 Apr 2025', title: 'Prescription renewed', source: 'Dr. Maya Chen · Verified', tone: 'teal', icon: FileText },
  { date: '08 Jan 2025', title: 'Annual checkup', source: 'Patient-entered note', tone: 'gold', icon: Stethoscope },
]

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline'>('overview')

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fafc] text-slate-950">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[680px] w-[900px] -translate-x-1/2 rounded-full bg-[#d9f4f2]/70 blur-3xl" />
      <header className="relative z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#top" className="flex items-center gap-2.5" aria-label="LifeHealth ID home">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#123f62] text-white shadow-sm"><HeartPulse size={20} strokeWidth={2.5} /></span>
            <span className="text-[17px] font-semibold tracking-[-0.03em]">LifeHealth <span className="text-[#109b94]">ID</span></span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-slate-600 lg:flex">
            {navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(' ', '-')}`} className="transition-colors hover:text-[#123f62]">{item}</a>)}
          </nav>
          <div className="hidden items-center gap-3 sm:flex">
            <button className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Sign in</button>
            <button onClick={() => setShowDashboard(true)} className="rounded-full bg-[#123f62] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#123f62]/15 transition-transform hover:-translate-y-0.5">Create your ID <ArrowRight className="ml-1 inline" size={15} /></button>
          </div>
          <button aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 lg:hidden"><Menu size={22} /></button>
        </div>
        {menuOpen && <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-5 py-5 text-sm lg:hidden">{navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setMenuOpen(false)}>{item}</a>)}<button onClick={() => setShowDashboard(true)} className="rounded-full bg-[#123f62] px-5 py-3 font-semibold text-white">Create your ID</button></div>}
      </header>

      <section id="top" className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-28 lg:pt-28">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#b9e5e1] bg-white/70 px-3.5 py-2 text-xs font-semibold text-[#168a84]"><span className="size-2 rounded-full bg-[#25b9ad]" /> A public-benefit health platform</div>
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.05] tracking-[-0.065em] text-[#123f62] sm:text-6xl lg:text-[76px]">Your health story, <span className="text-[#0c9992]">always with you.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">One secure, lifelong home for your medical records. Free for everyone, designed to make care more connected, understandable, and human.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><button onClick={() => setShowDashboard(true)} className="rounded-full bg-[#123f62] px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#123f62]/20 transition-transform hover:-translate-y-0.5">Create your free ID <ArrowRight className="ml-1 inline" size={16} /></button><a href="#how-it-works" className="rounded-full border border-slate-300 bg-white px-6 py-3.5 text-center text-sm font-semibold text-[#123f62] hover:bg-slate-50">See how it works</a></div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-500"><span className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#109b94]" /> Private by design</span><span className="flex items-center gap-2"><LockKeyhole size={15} className="text-[#109b94]" /> You control access</span><span className="flex items-center gap-2"><Check size={16} className="text-[#109b94]" /> Always free</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-[#b9ede8] via-[#e7f4fa] to-transparent opacity-80 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-4 shadow-2xl shadow-[#1b5c76]/15 sm:p-5">
            <div className="flex items-center justify-between border-b border-slate-100 px-2 pb-4"><div><div className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#109b94]">LifeHealth ID</div><div className="mt-1 text-lg font-semibold text-[#123f62]">Good morning, Alex</div></div><div className="flex size-10 items-center justify-center rounded-full bg-[#e5f6f4] text-[#109b94]"><UserRound size={19} /></div></div>
            <div className="mt-4 rounded-2xl bg-[#123f62] p-5 text-white"><div className="flex items-start justify-between"><div><p className="text-xs text-blue-100">Your secure health ID</p><p className="mt-2 font-mono text-lg tracking-[.12em]">LH-7K4P-29QX</p></div><QrCode size={38} strokeWidth={1.4} /></div><div className="mt-8 flex justify-between text-[11px] text-blue-100"><span>Last updated today</span><span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-[#50dbcd]" /> Protected</span></div></div>
            <div className="mt-4 grid grid-cols-3 gap-3">{[['12', 'Records'], ['02', 'Upcoming'], ['03', 'Shared with']].map(([value, label]) => <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3"><div className="text-xl font-semibold text-[#123f62]">{value}</div><div className="mt-1 text-[11px] text-slate-500">{label}</div></div>)}</div>
            <div className="mt-4 rounded-xl border border-[#b9e5e1] bg-[#f0fbfa] p-3.5"><div className="flex items-center gap-2 text-xs font-semibold text-[#146f6a]"><Sparkles size={15} /> Your record assistant</div><p className="mt-2 text-xs leading-5 text-slate-600">“Your recent results are ready to review. I found 2 changes to discuss at your next visit.”</p></div>
          </div>
        </div>
      </section>

      <section id="mission" className="relative z-10 border-y border-slate-200 bg-white"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-24"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#109b94]">Our promise</p><h2 className="mt-4 max-w-sm text-3xl font-semibold leading-tight tracking-[-.04em] text-[#123f62] sm:text-4xl">Healthcare should remember the whole person.</h2></div><div className="grid gap-8 sm:grid-cols-3"><div><div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-[#e5f6f4] text-[#109b94]"><UsersRound size={19} /></div><h3 className="font-semibold text-[#123f62]">For everyone</h3><p className="mt-2 text-sm leading-6 text-slate-500">No paywalls, targeted ads, or selling your health data.</p></div><div><div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-[#e8f0fa] text-[#2b6ca3]"><LockKeyhole size={19} /></div><h3 className="font-semibold text-[#123f62]">By your permission</h3><p className="mt-2 text-sm leading-6 text-slate-500">You decide who sees what, for how long, and why.</p></div><div><div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-[#fff5dc] text-[#b57b1b]"><HeartPulse size={19} /></div><h3 className="font-semibold text-[#123f62]">For life</h3><p className="mt-2 text-sm leading-6 text-slate-500">A portable record that stays with you across every chapter.</p></div></div></div></section>

      <section id="how-it-works" className="relative z-10 mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><div className="max-w-xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#109b94]">A calmer way to care</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] text-[#123f62]">Everything important, in one clear place.</h2></div><div className="mt-12 grid gap-5 md:grid-cols-3"><div className="rounded-3xl bg-[#123f62] p-7 text-white"><span className="text-sm text-[#8fe1d9]">01 / Collect</span><Upload className="mt-16" size={25} /><h3 className="mt-7 text-xl font-semibold">Bring your records together</h3><p className="mt-3 text-sm leading-6 text-blue-100">Upload reports, prescriptions, and visit notes. Keep originals and add your own context.</p></div><div className="rounded-3xl border border-slate-200 bg-white p-7"><span className="text-sm text-[#109b94]">02 / Understand</span><Sparkles className="mt-16 text-[#109b94]" size={25} /><h3 className="mt-7 text-xl font-semibold text-[#123f62]">Make sense of the details</h3><p className="mt-3 text-sm leading-6 text-slate-500">Get plain-language summaries and useful questions to take to a qualified professional.</p></div><div className="rounded-3xl border border-slate-200 bg-white p-7"><span className="text-sm text-[#109b94]">03 / Share</span><ShieldCheck className="mt-16 text-[#109b94]" size={25} /><h3 className="mt-7 text-xl font-semibold text-[#123f62]">Share with confidence</h3><p className="mt-3 text-sm leading-6 text-slate-500">Give a verified clinician the right records, for the right amount of time. Revoke anytime.</p></div></div></section>

      <section id="trust-&-privacy" className="relative z-10 bg-[#eaf7f6]"><div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-20"><div><div className="flex items-center gap-2 text-sm font-semibold text-[#146f6a]"><ShieldCheck size={18} /> Trust is not a feature. It is the foundation.</div><h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-.04em] text-[#123f62]">Your records belong to you. Our job is to help you keep them safe.</h2></div><a href="#mission" className="shrink-0 rounded-full bg-[#123f62] px-5 py-3 text-center text-sm font-semibold text-white">Read our privacy principles <ChevronRight className="ml-1 inline" size={15} /></a></div></section>

      <footer className="relative z-10 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8"><div className="flex items-center gap-2 font-semibold text-[#123f62]"><span className="flex size-7 items-center justify-center rounded-lg bg-[#123f62] text-white"><HeartPulse size={15} /></span> LifeHealth ID</div><p>Free, nonprofit, and built for the long term.</p><div className="flex gap-5"><a href="#mission" className="hover:text-[#123f62]">Privacy</a><a href="#mission" className="hover:text-[#123f62]">Transparency</a><a href="#mission" className="hover:text-[#123f62]">Help</a></div></div></footer>

      {showDashboard && <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f8fafc]/95 p-4 backdrop-blur-md sm:p-8"><div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-8"><div className="flex items-center gap-2 font-semibold text-[#123f62]"><span className="flex size-8 items-center justify-center rounded-lg bg-[#123f62] text-white"><HeartPulse size={17} /></span> LifeHealth ID <span className="ml-2 rounded-full bg-[#e5f6f4] px-2 py-1 text-[10px] font-semibold text-[#146f6a]">DEMO MODE</span></div><button aria-label="Close dashboard" onClick={() => setShowDashboard(false)} className="rounded-full p-2 hover:bg-slate-100"><X size={20} /></button></div><div className="grid lg:grid-cols-[210px_1fr]"><aside className="hidden border-r border-slate-100 p-5 lg:block"><div className="flex flex-col gap-2 text-sm"><button onClick={() => setActiveTab('overview')} className={`rounded-xl px-3 py-2.5 text-left font-medium ${activeTab === 'overview' ? 'bg-[#eaf7f6] text-[#146f6a]' : 'text-slate-500'}`}><Activity className="mr-2 inline" size={16} /> Overview</button><button onClick={() => setActiveTab('timeline')} className={`rounded-xl px-3 py-2.5 text-left font-medium ${activeTab === 'timeline' ? 'bg-[#eaf7f6] text-[#146f6a]' : 'text-slate-500'}`}><FileText className="mr-2 inline" size={16} /> My timeline</button><button className="rounded-xl px-3 py-2.5 text-left font-medium text-slate-500"><UsersRound className="mr-2 inline" size={16} /> Access & consent</button><button className="rounded-xl px-3 py-2.5 text-left font-medium text-slate-500"><Bell className="mr-2 inline" size={16} /> Notifications</button></div><div className="mt-20 rounded-2xl bg-[#123f62] p-4 text-white"><CircleHelp size={18} /><p className="mt-3 text-xs leading-5 text-blue-100">Need help understanding a record?</p><button className="mt-3 text-xs font-semibold text-[#8fe1d9]">Visit help center <ArrowRight className="ml-1 inline" size={12} /></button></div></aside><section className="min-w-0 p-5 sm:p-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-sm text-slate-500">Saturday, 24 May 2025</p><h2 className="mt-1 text-3xl font-semibold tracking-[-.04em] text-[#123f62]">Good morning, Alex.</h2></div><button className="w-fit rounded-full bg-[#123f62] px-4 py-2.5 text-sm font-semibold text-white"><Upload className="mr-1 inline" size={15} /> Add record</button></div>{activeTab === 'overview' ? <><div className="mt-7 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-[#123f62] p-5 text-white sm:col-span-2"><p className="text-xs text-blue-100">Your LifeHealth ID</p><div className="mt-3 flex items-center justify-between"><p className="font-mono text-lg tracking-[.12em]">LH-7K4P-29QX</p><QrCode size={33} /></div><div className="mt-7 flex items-center gap-2 text-xs text-blue-100"><span className="size-2 rounded-full bg-[#50dbcd]" /> Protected and private</div></div><div className="rounded-2xl border border-slate-200 p-5"><CalendarDays className="text-[#109b94]" size={20} /><p className="mt-8 text-2xl font-semibold text-[#123f62]">02</p><p className="text-xs text-slate-500">Upcoming reminders</p></div></div><div className="mt-7 grid gap-5 lg:grid-cols-[1fr_.85fr]"><div className="rounded-2xl border border-slate-200 p-5"><div className="flex items-center justify-between"><h3 className="font-semibold text-[#123f62]">Recent activity</h3><button onClick={() => setActiveTab('timeline')} className="text-xs font-semibold text-[#109b94]">View all</button></div><div className="mt-5 flex flex-col gap-5">{timeline.map((item) => <div key={item.title} className="flex gap-3"><div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${item.tone === 'blue' ? 'bg-[#e8f0fa] text-[#2b6ca3]' : item.tone === 'teal' ? 'bg-[#e5f6f4] text-[#109b94]' : 'bg-[#fff5dc] text-[#b57b1b]'}`}><item.icon size={16} /></div><div><p className="text-sm font-medium text-[#123f62]">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.date} · {item.source}</p></div></div>)}</div></div><div className="rounded-2xl border border-[#b9e5e1] bg-[#f0fbfa] p-5"><div className="flex items-center gap-2 text-sm font-semibold text-[#146f6a]"><Sparkles size={17} /> Record assistant</div><p className="mt-5 text-sm leading-6 text-slate-600">Your blood panel is ready to review. I can explain terms, compare past results, and help you prepare questions for your doctor.</p><button className="mt-5 rounded-full bg-[#123f62] px-4 py-2.5 text-xs font-semibold text-white">Review summary <ArrowRight className="ml-1 inline" size={13} /></button><p className="mt-4 text-[10px] leading-4 text-slate-400">AI-generated educational information only. Not a diagnosis or medical advice.</p></div></div></> : <div className="mt-7 rounded-2xl border border-slate-200 p-5"><h3 className="font-semibold text-[#123f62]">Your medical timeline</h3><p className="mt-1 text-sm text-slate-500">A chronological view of records you have added or verified.</p><div className="mt-7 flex flex-col gap-6">{[...timeline, { date: '19 Sep 2024', title: 'Vaccination record', source: 'Patient-entered note', tone: 'gold', icon: Check }].map((item) => <div key={item.title} className="flex gap-4 border-b border-slate-100 pb-5"><div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eaf7f6] text-[#109b94]"><item.icon size={17} /></div><div><p className="text-sm font-semibold text-[#123f62]">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.date} · {item.source}</p></div><span className="ml-auto rounded-full bg-[#e5f6f4] px-2.5 py-1 text-[10px] font-semibold text-[#146f6a]">Available</span></div>)}</div></div>}</section></div></div></div>}
    </main>
  )
}
