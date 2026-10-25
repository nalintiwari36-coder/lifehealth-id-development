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
  QrCode,
  Copy,
  RotateCcw,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

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
  const [emergencyShare, setEmergencyShare] = useState('')
  const [copied, setCopied] = useState(false)
  const [profile, setProfile] = useState({ bloodGroup: 'O+', allergies: 'Penicillin', medication: 'Metformin 500 mg', contact: '+1 (555) 014-2031' })
  const [timelineFilter, setTimelineFilter] = useState('All')
  const firstName = name.split(' ')[0]

  function createEmergencyShare() {
    const bytes = new Uint8Array(18)
    crypto.getRandomValues(bytes)
    const token = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
    setEmergencyShare(`${window.location.origin}/emergency/${token}`)
    setCopied(false)
  }

  async function copyEmergencyShare() {
    if (!emergencyShare) return
    await navigator.clipboard.writeText(emergencyShare)
    setCopied(true)
  }

  return (
    <div className="dashboard-shell grid min-h-[calc(100vh-73px)] bg-[#f8fafc] text-[#123f62] transition-colors duration-500 dark:bg-[#071522] dark:text-slate-100 lg:grid-cols-[230px_1fr]">
      <aside className="hidden border-r border-slate-200 bg-white p-5 lg:block">
        <nav className="flex flex-col gap-1.5" aria-label="Dashboard navigation">
          {[
            ['Overview', Activity], ['Emergency Health ID', HeartPulse], ['My records', FileText], ['Access & consent', UsersRound], ['Care team', Stethoscope],
          ].map(([label, Icon]) => <button key={label as string} onClick={() => setActiveSection(label as string)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${activeSection === label ? 'bg-[#eaf7f6] text-[#146f6a]' : 'text-slate-500 hover:bg-slate-50'}`}><Icon size={17} />{label as string}</button>)}
        </nav>
        <div className="mt-12 rounded-2xl bg-[#123f62] p-4 text-white"><Sparkles size={18} className="text-[#8fe1d9]" /><p className="mt-3 text-sm font-semibold">Your record assistant</p><p className="mt-2 text-xs leading-5 text-blue-100">Understand your reports in plain language, with facts kept separate from explanations.</p><button onClick={() => setShowAi(true)} className="mt-4 text-xs font-semibold text-[#8fe1d9]">Explain a report <ArrowUpRight className="ml-1 inline" size={13} /></button></div>
        <div className="mt-8 flex items-center gap-2 text-xs text-slate-400"><LockKeyhole size={14} /> Private by design</div>
      </aside>

      <main className="bg-[#f8fafc] px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-[#109b94]">{activeSection}</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.04em] text-[#123f62] sm:text-4xl">Good morning, {firstName}</h1><p className="mt-2 text-sm text-slate-500">Your health story, organized and in your hands.</p></div><button onClick={() => setShowUpload(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#123f62] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#123f62]/15 hover:-translate-y-0.5"><Upload size={16} /> Upload medical report</button></div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3"><StatCard icon={FileText} value={uploaded ? '13' : '12'} label="Total records" /><StatCard icon={Clock3} value="02" label="Upcoming items" /><StatCard icon={UsersRound} value="03" label="Shared with care team" /></div>

          <section className="mt-5 grid gap-4 xl:grid-cols-[1.25fr_.75fr]" aria-label="Health profile status and quick actions">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="text-sm font-semibold text-[#123f62]">Profile completeness</p><p className="mt-1 text-xs leading-5 text-slate-500">A complete profile helps your care team act faster when it matters.</p></div>
                <span className="text-2xl font-semibold text-[#146f6a]">72%</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="Profile completeness" aria-valuemin={0} aria-valuemax={100} aria-valuenow={72}><div className="h-full w-[72%] rounded-full bg-[#109b94]" /></div>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium"><span className="rounded-full bg-[#e5f6f4] px-2.5 py-1 text-[#146f6a]">Emergency contact added</span><span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-800">Add date of birth</span><span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-800">Add care preferences</span></div>
            </div>
            <div className="rounded-2xl border border-[#b9e5e1] bg-[#f0fbfa] p-5 sm:p-6"><p className="text-sm font-semibold text-[#123f62]">Quick actions</p><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={() => setShowUpload(true)} className="rounded-xl bg-white px-3 py-3 text-left text-xs font-semibold text-[#123f62] shadow-sm hover:bg-[#e5f6f4]"><Upload size={15} className="mb-2 text-[#109b94]" />Upload record</button><button onClick={() => setActiveSection('Emergency Health ID')} className="rounded-xl bg-white px-3 py-3 text-left text-xs font-semibold text-[#123f62] shadow-sm hover:bg-[#e5f6f4]"><HeartPulse size={15} className="mb-2 text-[#109b94]" />Emergency card</button><button onClick={() => setShowMessage(true)} className="rounded-xl bg-white px-3 py-3 text-left text-xs font-semibold text-[#123f62] shadow-sm hover:bg-[#e5f6f4]"><Mail size={15} className="mb-2 text-[#109b94]" />Message care team</button><button onClick={() => setActiveSection('Care team')} className="rounded-xl bg-white px-3 py-3 text-left text-xs font-semibold text-[#123f62] shadow-sm hover:bg-[#e5f6f4]"><CalendarDays size={15} className="mb-2 text-[#109b94]" />Prepare for visit</button></div></div>
          </section>

          <section className="mt-5 rounded-2xl border border-[#b9e5e1] bg-white p-5 sm:p-6" aria-labelledby="emergency-health-id-title">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#146f6a]"><HeartPulse size={17} /> Emergency Health ID</div>
                <h2 id="emergency-health-id-title" className="mt-3 text-xl font-semibold text-[#123f62]">Share only what helps in an emergency.</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Create a temporary QR pass with your selected allergies, medications, blood type, and emergency contacts. Your full health record stays private.</p>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium text-slate-600"><span className="rounded-full bg-[#e5f6f4] px-2.5 py-1 text-[#146f6a]">User-entered profile</span><span className="rounded-full bg-slate-100 px-2.5 py-1">Verified information is labeled</span><span className="rounded-full bg-slate-100 px-2.5 py-1">Expires automatically</span></div>
              </div>
              <div className="flex shrink-0 flex-col items-center rounded-2xl bg-[#f0fbfa] p-4">
                {emergencyShare ? <QRCodeSVG value={emergencyShare} size={132} bgColor="#f0fbfa" fgColor="#123f62" level="M" aria-label="Temporary Emergency Health ID QR code" /> : <div className="flex size-[132px] items-center justify-center rounded-xl border-2 border-dashed border-[#b9e5e1] text-center text-xs text-[#146f6a]"><QrCode size={22} /><span className="sr-only">QR code not created yet</span></div>}
                <p className="mt-3 text-center text-[11px] font-medium text-slate-500">{emergencyShare ? 'Temporary access pass' : 'No active pass'}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-slate-500">Never use a screenshot or public link as your permanent record. Revoke access by creating a new pass.</p>
              <div className="flex flex-wrap gap-2"><button onClick={createEmergencyShare} className="inline-flex items-center gap-2 rounded-full bg-[#123f62] px-4 py-2.5 text-xs font-semibold text-white"><RotateCcw size={14} /> {emergencyShare ? 'Create new pass' : 'Create secure pass'}</button>{emergencyShare && <button onClick={copyEmergencyShare} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-xs font-semibold text-[#123f62]"><Copy size={14} /> {copied ? 'Copied' : 'Copy private link'}</button>}</div>
            </div>
          </section>

          <div role="alert" className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900"><Clock3 className="mt-0.5 shrink-0 text-amber-600" size={18} /><div><p className="text-sm font-semibold">Last day to complete your wellness test</p><p className="mt-1 text-xs leading-5 text-amber-800">Please submit your test before today ends so your care team can review it on time.</p></div></div>

          {activeSection === 'My records' && <TimelinePanel filter={timelineFilter} setFilter={setTimelineFilter} onUpload={() => setShowUpload(true)} />}
          {activeSection === 'Emergency Health ID' && <EmergencyProfilePanel profile={profile} setProfile={setProfile} />}
          {activeSection === 'Care team' && <VisitPrepPanel />}

          <div className="mt-8 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold text-[#123f62]">Recent records</h2><p className="mt-1 text-xs text-slate-500">Your latest health information</p></div><button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50" aria-label="More record options"><MoreHorizontal size={18} /></button></div><div className="mt-5 flex flex-col gap-2">{records.map((record) => <RecordRow key={record.title} {...record} onExplain={() => setShowAi(true)} />)}{uploaded && <RecordRow title="New medical report" type="Uploaded just now" date="Today" status="Processing" tone="blue" onExplain={() => setShowAi(true)} />}</div><button className="mt-5 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-[#123f62] hover:bg-slate-50">View all records</button></section>
            <section className="rounded-2xl border border-[#b9e5e1] bg-[#f0fbfa] p-5 sm:p-6"><div className="flex items-center gap-2 text-sm font-semibold text-[#146f6a]"><Sparkles size={17} /> AI report assistant</div><h2 className="mt-5 text-xl font-semibold leading-tight text-[#123f62]">A clearer way to read your results.</h2><p className="mt-3 text-sm leading-6 text-slate-600">Get a plain-language explanation of medical terms and a list of questions to take to your doctor.</p><div className="mt-6 flex items-start gap-3 rounded-xl bg-white/75 p-3.5"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#109b94]" /><p className="text-xs leading-5 text-slate-500">Educational only. Not a diagnosis or a substitute for medical care.</p></div><button onClick={() => setShowAi(true)} className="mt-5 rounded-full bg-[#123f62] px-4 py-2.5 text-sm font-semibold text-white">Explain a report</button></section>
          </div>

          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold text-[#123f62]">Access & consent</h2><p className="mt-1 text-xs text-slate-500">You choose who can see your records.</p></div><button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#123f62]"><Filter size={14} /> Manage access</button></div><div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-4"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-full bg-[#e5f6f4] text-[#109b94]"><Stethoscope size={17} /></div><div><p className="text-sm font-semibold text-[#123f62]">Dr. Maya Chen</p><p className="text-xs text-slate-500">Northside Medical · 3 records shared</p></div></div><span className="rounded-full bg-[#e5f6f4] px-2.5 py-1 text-[11px] font-semibold text-[#146f6a]">Active</span></div></section><section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold text-[#123f62]">Care team messages</h2><p className="mt-1 text-xs text-slate-500">Secure notes between doctors and patients</p></div><div className="flex items-center gap-2"><span className="rounded-full bg-[#e5f6f4] px-2.5 py-1 text-[11px] font-semibold text-[#146f6a]">1 new</span><button onClick={() => setShowMessage(true)} className="inline-flex items-center gap-1.5 rounded-full bg-[#123f62] px-3 py-2 text-[11px] font-semibold text-white shadow-sm hover:bg-[#0d5472]"><Mail size={13} /> New message</button></div></div><div className="mt-5 rounded-xl border border-[#b9e5e1] bg-[#f0fbfa] p-4"><div className="flex items-start gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#109b94]"><Stethoscope size={17} /></div><div><p className="text-sm font-semibold text-[#123f62]">Dr. Maya Chen sent you a message</p><p className="mt-2 text-sm leading-6 text-slate-600">Your latest results are ready. Please review them before your next appointment and bring any questions.</p><p className="mt-2 text-[11px] text-slate-400">Sent today · Private to you and your care team</p></div></div></div></section></div>
      </main>

      {showUpload && <Modal title="Upload a medical report" onClose={() => setShowUpload(false)}><div className="rounded-2xl border-2 border-dashed border-[#b9e5e1] bg-[#f0fbfa] p-8 text-center"><Upload className="mx-auto text-[#109b94]" size={28} /><p className="mt-3 text-sm font-semibold text-[#123f62]">Choose a PDF, JPG, or PNG</p><p className="mt-1 text-xs text-slate-500">Maximum file size: 10 MB</p><input aria-label="Medical report file" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; const formData = new FormData(); formData.append('file', file); const response = await fetch('/api/records/upload', { method: 'POST', body: formData }); if (response.ok) { setUploaded(true); setShowUpload(false) } }} className="mt-5 block w-full text-xs text-slate-500 file:mr-3 file:rounded-full file:border-0 file:bg-[#123f62] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white" /></div><p className="mt-4 text-xs leading-5 text-slate-500">Your file stays private. We validate file type and size before processing.</p></Modal>}
      {showMessage && <MessageModal onClose={() => setShowMessage(false)} />}
      {showAi && <ReportAssistant onClose={() => setShowAi(false)} />}
    </div>
  )
}

function TimelinePanel({ filter, setFilter, onUpload }: { filter: string; setFilter: (value: string) => void; onUpload: () => void }) {
  const events = [
    ['May 24, 2025', 'Complete blood count', 'Laboratory report', 'Northside Medical'],
    ['Apr 12, 2025', 'Annual wellness visit', 'Doctor visit', 'Dr. Maya Chen'],
    ['Jan 08, 2025', 'Lipid panel', 'Laboratory report', 'Northside Medical'],
    ['Nov 21, 2024', 'Influenza vaccination', 'Vaccination', 'Community Pharmacy'],
  ]
  const visible = filter === 'All' ? events : events.filter((event) => event[2] === filter)
  return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="timeline-title">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-[#146f6a]">Health timeline</p><h2 id="timeline-title" className="mt-1 text-xl font-semibold text-[#123f62]">Your complete health story</h2><p className="mt-1 text-sm text-slate-500">Visits, reports, prescriptions, and vaccinations in one chronological view.</p></div><button onClick={onUpload} className="rounded-full bg-[#123f62] px-4 py-2.5 text-xs font-semibold text-white"><Upload className="mr-1 inline" size={14} /> Add record</button></div>
    <div className="mt-5 flex flex-wrap gap-2">{['All', 'Laboratory report', 'Doctor visit', 'Vaccination'].map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-3 py-2 text-xs font-semibold ${filter === item ? 'bg-[#123f62] text-white' : 'border border-slate-200 text-slate-500'}`}>{item}</button>)}</div>
    <div className="mt-6 flex flex-col">{visible.map(([date, title, type, source]) => <div key={title} className="relative flex gap-4 border-l-2 border-[#b9e5e1] pb-6 pl-6 last:pb-0"><span className="absolute -left-[7px] top-0 size-3 rounded-full border-2 border-white bg-[#109b94] ring-1 ring-[#b9e5e1]" /><div><p className="text-xs font-medium text-[#109b94]">{date}</p><h3 className="mt-1 text-sm font-semibold text-[#123f62]">{title}</h3><p className="mt-1 text-xs text-slate-500">{type} · {source}</p><button className="mt-2 text-xs font-semibold text-[#146f6a]">Add a note</button></div></div>)}</div>
  </section>
}

function EmergencyProfilePanel({ profile, setProfile }: { profile: { bloodGroup: string; allergies: string; medication: string; contact: string }; setProfile: (value: { bloodGroup: string; allergies: string; medication: string; contact: string }) => void }) {
  const [saved, setSaved] = useState(false)
  return <section className="mt-6 rounded-2xl border border-[#b9e5e1] bg-white p-5 sm:p-6" aria-labelledby="emergency-profile-title"><div><p className="text-sm font-semibold text-[#146f6a]">Emergency card settings</p><h2 id="emergency-profile-title" className="mt-1 text-xl font-semibold text-[#123f62]">Choose exactly what responders can see</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">Only selected fields appear on your QR card. Your full record is never public, and changes can be saved or disabled at any time.</p></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{([['bloodGroup', 'Blood group'], ['allergies', 'Allergies'], ['medication', 'Current medications'], ['contact', 'Emergency contact']] as const).map(([key, label]) => <label key={key} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-medium text-[#123f62]"><input type="checkbox" defaultChecked className="size-4 accent-[#109b94]" />{label}<input aria-label={`${label} value`} value={profile[key]} onChange={(event) => setProfile({ ...profile, [key]: event.target.value })} className="ml-auto min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-right text-xs" /></label>)}</div><div className="mt-5 flex flex-wrap items-center gap-3"><button onClick={() => setSaved(true)} className="rounded-full bg-[#123f62] px-4 py-2.5 text-xs font-semibold text-white">Save emergency details</button>{saved && <span className="text-xs font-semibold text-[#146f6a]">Saved privately. Your card is ready to generate above.</span>}<p className="w-full text-xs leading-5 text-slate-500">Privacy notice: emergency access is view-only and should contain only information you are comfortable sharing.</p></div></section>
}

function VisitPrepPanel() {
  const [reason, setReason] = useState('Annual checkup')
  return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="visit-prep-title"><p className="text-sm font-semibold text-[#146f6a]">Doctor visit preparation</p><h2 id="visit-prep-title" className="mt-1 text-xl font-semibold text-[#123f62]">Arrive with the right context</h2><p className="mt-1 text-sm text-slate-500">Create a simple checklist from your recent records, medications, and questions.</p><label className="mt-5 block max-w-md text-xs font-semibold text-slate-500">Reason for visit<select value={reason} onChange={(event) => setReason(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal text-[#123f62]"><option>Annual checkup</option><option>Discuss lab results</option><option>New symptom</option><option>Medication review</option></select></label><div className="mt-5 grid gap-3 sm:grid-cols-3">{['Bring current medications', 'Review recent lab results', 'Ask your prepared questions'].map((item) => <label key={item} className="flex gap-2 rounded-xl bg-[#f0fbfa] p-3 text-xs font-medium text-[#146f6a]"><input type="checkbox" className="size-4 accent-[#109b94]" />{item}</label>)}</div><p className="mt-4 text-xs text-slate-500">{reason} · Educational preparation only, not medical advice.</p></section>
}

function ReportAssistant({ onClose }: { onClose: () => void }) {
  const [reportText, setReportText] = useState('')
  const [sourceDocument, setSourceDocument] = useState('')
  const [reportDate, setReportDate] = useState('')
  const [explanation, setExplanation] = useState('')
  const [pending, setPending] = useState(false)
  const [status, setStatus] = useState('')

  async function explain(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setStatus('')
    setExplanation('')
    const response = await fetch('/api/ai/explain-report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reportText, sourceDocument, reportDate }) })
    const result = await response.json().catch(() => null)
    setPending(false)
    if (!response.ok) { setStatus(result?.error ?? 'We could not explain this report.'); return }
    setExplanation(result.explanation)
  }

  return <Modal title="Report assistant" onClose={onClose}>
    <div className="rounded-xl bg-[#f0fbfa] p-4"><div className="flex items-center gap-2 text-sm font-semibold text-[#146f6a]"><Sparkles size={16} /> NVIDIA Nemotron explanation</div><p className="mt-2 text-xs leading-5 text-slate-600">Paste text copied from your authorized report. The assistant uses only the text you provide and keeps facts separate from interpretation.</p></div>
    <form onSubmit={explain} className="mt-4 flex flex-col gap-3">
      <input value={sourceDocument} onChange={(event) => setSourceDocument(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" placeholder="Source document name (optional)" aria-label="Source document name" />
      <input value={reportDate} onChange={(event) => setReportDate(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" placeholder="Report date (optional)" aria-label="Report date" />
      <textarea required minLength={40} maxLength={24000} value={reportText} onChange={(event) => setReportText(event.target.value)} className="min-h-36 rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-5" placeholder="Paste report text here, including values, units, and the report's reference ranges..." aria-label="Medical report text" />
      {status && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{status}</p>}
      <button disabled={pending} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#123f62] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"><Sparkles size={15} />{pending ? 'Reviewing report…' : 'Explain report'}</button>
    </form>
    {explanation && <div className="mt-5 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 whitespace-pre-wrap"><p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#146f6a]">Generated explanation · {sourceDocument || 'Uploaded report'}{reportDate ? ` · ${reportDate}` : ''}</p>{explanation}</div>}
    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800"><strong>Important:</strong> Educational only. This assistant is not a doctor, cannot diagnose, and cannot recommend medication changes. For urgent symptoms, contact local emergency services.</div>
  </Modal>
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
