'use client'

import { useState } from 'react'
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Filter,
  HeartPulse,
  LockKeyhole,
  MoreHorizontal,
  Moon,
  Search,
  Sun,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Upload,
  UsersRound,
  Mail,
  Send,
} from 'lucide-react'

const records = [
  { title: 'Complete blood count', type: 'Laboratory report', date: 'May 24, 2025', status: 'Ready to review', tone: 'teal' },
  { title: 'Annual wellness visit', type: 'Visit summary', date: 'Apr 12, 2025', status: 'Shared with Dr. Chen', tone: 'blue' },
  { title: 'Lipid panel', type: 'Laboratory report', date: 'Jan 08, 2025', status: 'Ready to review', tone: 'gold' },
]

export function HealthDashboard({ name }: { name: string }) {
  const [activeSection, setActiveSection] = useState('Overview')
  const [showUpload, setShowUpload] = useState(false)
  const [showAi, setShowAi] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const firstName = name.split(' ')[0]

  return (
    <div className="dashboard-shell grid min-h-[calc(100vh-73px)] bg-[#f8fafc] text-[#123f62] transition-colors duration-500 dark:bg-[#071522] dark:text-slate-100 lg:grid-cols-[230px_1fr]">
      <aside className="hidden border-r border-slate-200 bg-white p-5 lg:block">
        <nav className="flex flex-col gap-1.5" aria-label="Dashboard navigation">
          {[
            ['Overview', Activity], ['My records', FileText], ['Access & consent', UsersRound], ['Care team', Stethoscope],
          ].map(([label, Icon]) => <button key={label as string} onClick={() => setActiveSection(label as string)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${activeSection === label ? 'bg-[#eaf7f6] text-[#146f6a]' : 'text-slate-500 hover:bg-slate-50'}`}><Icon size={17} />{label as string}</button>)}
        </nav>
        <div className="mt-12 rounded-2xl bg-[#123f62] p-4 text-white"><Sparkles size={18} className="text-[#8fe1d9]" /><p className="mt-3 text-sm font-semibold">Your record assistant</p><p className="mt-2 text-xs leading-5 text-blue-100">Understand your reports in plain language, with facts kept separate from explanations.</p><button onClick={() => setShowAi(true)} className="mt-4 text-xs font-semibold text-[#8fe1d9]">Explain a report <ArrowUpRight className="ml-1 inline" size={13} /></button></div>
        <div className="mt-8 flex items-center gap-2 text-xs text-slate-400"><LockKeyhole size={14} /> Private by design</div>
      </aside>

      <main className="bg-[#f8fafc] px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-[#109b94]">{activeSection}</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.04em] text-[#123f62] sm:text-4xl">Good morning, {firstName}</h1><p className="mt-2 text-sm text-slate-500">Your health story, organized and in your hands.</p></div><button onClick={() => setShowUpload(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#123f62] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#123f62]/15 hover:-translate-y-0.5"><Upload size={16} /> Upload medical report</button></div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3"><StatCard icon={FileText} value={uploaded ? '13' : '12'} label="Total records" /><StatCard icon={Clock3} value="02" label="Upcoming items" /><StatCard icon={UsersRound} value="03" label="Shared with care team" /></div><div role="alert" className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900"><Clock3 className="mt-0.5 shrink-0 text-amber-600" size={18} /><div><p className="text-sm font-semibold">Last day to complete your wellness test</p><p className="mt-1 text-xs leading-5 text-amber-800">Please submit your test before today ends so your care team can review it on time.</p></div></div>

          <div className="mt-8 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold text-[#123f62]">Recent records</h2><p className="mt-1 text-xs text-slate-500">Your latest health information</p></div><button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50" aria-label="More record options"><MoreHorizontal size={18} /></button></div><div className="mt-5 flex flex-col gap-2">{records.map((record) => <RecordRow key={record.title} {...record} onExplain={() => setShowAi(true)} />)}{uploaded && <RecordRow title="New medical report" type="Uploaded just now" date="Today" status="Processing" tone="blue" onExplain={() => setShowAi(true)} />}</div><button className="mt-5 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-[#123f62] hover:bg-slate-50">View all records</button></section>
            <section className="rounded-2xl border border-[#b9e5e1] bg-[#f0fbfa] p-5 sm:p-6"><div className="flex items-center gap-2 text-sm font-semibold text-[#146f6a]"><Sparkles size={17} /> AI report assistant</div><h2 className="mt-5 text-xl font-semibold leading-tight text-[#123f62]">A clearer way to read your results.</h2><p className="mt-3 text-sm leading-6 text-slate-600">Get a plain-language explanation of medical terms and a list of questions to take to your doctor.</p><div className="mt-6 flex items-start gap-3 rounded-xl bg-white/75 p-3.5"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#109b94]" /><p className="text-xs leading-5 text-slate-500">Educational only. Not a diagnosis or a substitute for medical care.</p></div><button onClick={() => setShowAi(true)} className="mt-5 rounded-full bg-[#123f62] px-4 py-2.5 text-sm font-semibold text-white">Explain a report</button></section>
          </div>

          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold text-[#123f62]">Access & consent</h2><p className="mt-1 text-xs text-slate-500">You choose who can see your records.</p></div><button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#123f62]"><Filter size={14} /> Manage access</button></div><div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-4"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-full bg-[#e5f6f4] text-[#109b94]"><Stethoscope size={17} /></div><div><p className="text-sm font-semibold text-[#123f62]">Dr. Maya Chen</p><p className="text-xs text-slate-500">Northside Medical · 3 records shared</p></div></div><span className="rounded-full bg-[#e5f6f4] px-2.5 py-1 text-[11px] font-semibold text-[#146f6a]">Active</span></div></section><section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold text-[#123f62]">Care team messages</h2><p className="mt-1 text-xs text-slate-500">Secure notes between doctors and patients</p></div><div className="flex items-center gap-2"><span className="rounded-full bg-[#e5f6f4] px-2.5 py-1 text-[11px] font-semibold text-[#146f6a]">1 new</span><button onClick={() => setShowMessage(true)} className="inline-flex items-center gap-1.5 rounded-full bg-[#123f62] px-3 py-2 text-[11px] font-semibold text-white shadow-sm hover:bg-[#0d5472]"><Mail size={13} /> New message</button></div></div><div className="mt-5 rounded-xl border border-[#b9e5e1] bg-[#f0fbfa] p-4"><div className="flex items-start gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#109b94]"><Stethoscope size={17} /></div><div><p className="text-sm font-semibold text-[#123f62]">Dr. Maya Chen sent you a message</p><p className="mt-2 text-sm leading-6 text-slate-600">Your latest results are ready. Please review them before your next appointment and bring any questions.</p><p className="mt-2 text-[11px] text-slate-400">Sent today · Private to you and your care team</p></div></div></div></section></div>
      </main>

      {showUpload && <Modal title="Upload a medical report" onClose={() => setShowUpload(false)}><div className="rounded-2xl border-2 border-dashed border-[#b9e5e1] bg-[#f0fbfa] p-8 text-center"><Upload className="mx-auto text-[#109b94]" size={28} /><p className="mt-3 text-sm font-semibold text-[#123f62]">Choose a PDF, JPG, or PNG</p><p className="mt-1 text-xs text-slate-500">Maximum file size: 10 MB</p><input aria-label="Medical report file" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={() => { setUploaded(true); setShowUpload(false) }} className="mt-5 block w-full text-xs text-slate-500 file:mr-3 file:rounded-full file:border-0 file:bg-[#123f62] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white" /></div><p className="mt-4 text-xs leading-5 text-slate-500">Your file stays private. We validate file type and size before processing.</p></Modal>}
      {showMessage && <MessageModal onClose={() => setShowMessage(false)} />}
      {showAi && <Modal title="Report assistant" onClose={() => setShowAi(false)}><div className="rounded-xl bg-[#f0fbfa] p-4"><div className="flex items-center gap-2 text-sm font-semibold text-[#146f6a]"><Sparkles size={16} /> Educational explanation</div><p className="mt-3 text-sm leading-6 text-slate-600">Upload a report to receive a clear summary of the extracted facts, medical terms, and questions to discuss with your doctor. Missing values are never invented.</p></div><div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800"><strong>Important:</strong> This assistant is not a doctor and cannot diagnose or recommend medication changes. For urgent symptoms, contact local emergency services.</div></Modal>}
    </div>
  )
}

function MessageModal({ onClose }: { onClose: () => void }) {
  const [recipientEmail, setRecipientEmail] = useState('')
  const [recipientRole, setRecipientRole] = useState<'patient' | 'doctor'>('patient')
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)
  const [status, setStatus] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setStatus('')
    const response = await fetch('/api/messages/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ recipientEmail, recipientRole, message }) })
    const result = await response.json().catch(() => null)
    setPending(false)
    if (!response.ok) {
      setStatus(result?.error ?? 'We could not send this message.')
      return
    }
    setStatus('Message sent securely.')
    setMessage('')
  }

  return <Modal title="Send a secure care message" onClose={onClose}>
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="rounded-2xl bg-gradient-to-r from-[#e7f8f5] to-[#edf4ff] p-4"><div className="flex items-center gap-2 text-sm font-semibold text-[#123f62]"><Send size={16} className="text-[#109b94]" /> Doctor to patient or patient to doctor</div><p className="mt-1 text-xs leading-5 text-slate-600">Messages are delivered by email through your secure LifeHealth ID session.</p></div>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">Recipient email<input required type="email" value={recipientEmail} onChange={(event) => setRecipientEmail(event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 outline-none ring-[#109b94] focus:ring-2" placeholder="patient@example.com" /></label>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">Recipient type<select value={recipientRole} onChange={(event) => setRecipientRole(event.target.value as 'patient' | 'doctor')} className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none ring-[#109b94] focus:ring-2"><option value="patient">Patient</option><option value="doctor">Doctor</option></select></label>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">Message<textarea required minLength={3} maxLength={2000} value={message} onChange={(event) => setMessage(event.target.value)} className="min-h-28 rounded-xl border border-slate-200 px-4 py-3 outline-none ring-[#109b94] focus:ring-2" placeholder="Write a clear, caring note..." /></label>
      {status && <p role="status" className={`rounded-xl px-4 py-3 text-sm ${status.startsWith('Message') ? 'bg-[#e7f8f5] text-[#146f6a]' : 'bg-red-50 text-red-700'}`}>{status}</p>}
      <button disabled={pending} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#123f62] px-5 py-3 font-semibold text-white shadow-lg shadow-[#123f62]/15 disabled:opacity-60"><Send size={15} />{pending ? 'Sending…' : 'Send message'}</button>
    </form>
  </Modal>
}

function StatCard({ icon: Icon, value, label }: { icon: typeof FileText; value: string; label: string }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><Icon size={18} className="text-[#109b94]" /><span className="text-2xl font-semibold text-[#123f62]">{value}</span></div><p className="mt-3 text-xs text-slate-500">{label}</p></div> }
function RecordRow({ title, type, date, status, tone, onExplain }: { title: string; type: string; date: string; status: string; tone: string; onExplain: () => void }) { return <div className="flex flex-col gap-3 rounded-xl border border-slate-100 p-3.5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${tone === 'teal' ? 'bg-[#e5f6f4] text-[#109b94]' : tone === 'gold' ? 'bg-[#fff5dc] text-[#b57b1b]' : 'bg-[#e8f0fa] text-[#2b6ca3]'}`}><FileText size={17} /></div><div><p className="text-sm font-semibold text-[#123f62]">{title}</p><p className="mt-0.5 text-xs text-slate-500">{type} · {date}</p></div></div><div className="flex items-center gap-2 pl-12 sm:pl-0"><span className="text-[11px] font-medium text-slate-500">{status}</span><button onClick={onExplain} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-[#146f6a] hover:bg-[#f0fbfa]">Explain</button></div></div> }
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#123f62]/25 p-5 backdrop-blur-sm"><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-[#123f62]">{title}</h2><button onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-50">×</button></div><div className="mt-5">{children}</div></div></div> }

export function DashboardHeader({ onSignOut }: { onSignOut: React.ReactNode }) { const [darkMode, setDarkMode] = useState(false); const toggleTheme = () => { const next = !darkMode; setDarkMode(next); document.documentElement.classList.toggle('dark', next) }; return <header className="dashboard-header border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-[#071522]/90"><div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 sm:px-8"><div className="flex items-center gap-2 font-semibold text-[#123f62] dark:text-slate-100"><span className="brand-orb flex size-8 items-center justify-center rounded-lg bg-[#123f62] text-white"><HeartPulse size={17} /></span> LifeHealth <span className="text-[#109b94]">ID</span></div><div className="flex items-center gap-3"><button type="button" aria-label="Toggle light and dark mode" onClick={toggleTheme} className="theme-toggle rounded-full border border-slate-200 bg-white p-2 text-[#123f62] shadow-sm transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900 dark:text-cyan-300">{darkMode ? <Sun size={16} /> : <Moon size={16} />}</button><div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex"><CheckCircle2 size={15} className="text-[#109b94]" /> Protected session</div>{onSignOut}</div></div></header> }
export function MobileSearch() { return <div className="mb-5 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-400 lg:hidden"><Search size={16} /> Search your records</div> }
export function CalendarIcon() { return <CalendarDays size={18} /> }
export function HealthIcon() { return <HeartPulse size={18} /> }
