'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserCog } from 'lucide-react'

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin', editor: 'Editor', viewer: 'Viewer', leads_view: 'Leads View', leads_edit: 'Leads Edit', manager: 'Manager',
}

export default function AccountPage() {
  const router = useRouter()
  const [me, setMe] = useState<{ firstName: string; lastName: string; email: string; role: string } | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [nameMsg, setNameMsg] = useState(''); const [nameErr, setNameErr] = useState(''); const [nameBusy, setNameBusy] = useState(false)

  const [cur, setCur] = useState(''); const [nw, setNw] = useState(''); const [confirm, setConfirm] = useState('')
  const [pwMsg, setPwMsg] = useState(''); const [pwErr, setPwErr] = useState(''); const [pwBusy, setPwBusy] = useState(false)

  useEffect(() => {
    fetch('/api/admin/account').then((r) => r.json()).then((d) => {
      if (d.user) { setMe(d.user); setFirstName(d.user.firstName); setLastName(d.user.lastName) }
    }).catch(() => {})
  }, [])

  async function saveName() {
    setNameBusy(true); setNameErr(''); setNameMsg('')
    const res = await fetch('/api/admin/account', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ firstName, lastName }) })
    const d = await res.json().catch(() => ({})); setNameBusy(false)
    if (!res.ok) return setNameErr(d.error || 'Could not save.')
    setNameMsg('Your name has been updated.'); router.refresh()
  }

  async function changePassword() {
    setPwErr(''); setPwMsg('')
    if (nw.length < 8) return setPwErr('New password must be at least 8 characters.')
    if (nw !== confirm) return setPwErr('New password and confirmation do not match.')
    setPwBusy(true)
    const res = await fetch('/api/admin/auth/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: cur, newPassword: nw }) })
    const d = await res.json().catch(() => ({})); setPwBusy(false)
    if (!res.ok) return setPwErr(d.error || 'Could not change password.')
    setPwMsg('Password changed. You will stay signed in on this device.'); setCur(''); setNw(''); setConfirm('')
  }

  return (
    <div className="max-w-2xl">
      <div className="ad-kicker">Your account</div>
      <h1 className="text-2xl font-bold tracking-tight" style={{ display: 'flex', alignItems: 'center', gap: 10 }}><UserCog size={22} /> Manage my account</h1>
      <p className="ad-mut" style={{ fontSize: 14, marginTop: 6 }}>Update your name and password. Your email is managed by an admin.</p>

      {/* profile */}
      <div className="ad-card" style={{ padding: 22, marginTop: 18 }}>
        <div className="ad-kicker" style={{ marginBottom: 14 }}>Profile</div>
        <Field label="Email / username">
          <input className="ad-input" value={me?.email || ''} disabled title="Only an admin can change your email" style={{ opacity: 0.65, cursor: 'not-allowed' }} />
          <span className="ad-soft" style={{ fontSize: 11 }}>Only an admin can change your email. Role: {ROLE_LABELS[me?.role || ''] || me?.role || '—'}</span>
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
          <Field label="First name"><input className="ad-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></Field>
          <Field label="Last name"><input className="ad-input" value={lastName} onChange={(e) => setLastName(e.target.value)} /></Field>
        </div>
        {nameErr && <div className="ad-alert" style={{ marginTop: 12, color: 'var(--brand-ink)' }}>{nameErr}</div>}
        {nameMsg && <div className="ad-alert ok" style={{ marginTop: 12 }}>{nameMsg}</div>}
        <button className="ad-btn" style={{ marginTop: 16 }} disabled={nameBusy || !firstName.trim() || !lastName.trim()} onClick={saveName}>{nameBusy ? 'Saving…' : 'Save name'}</button>
      </div>

      {/* password */}
      <div className="ad-card" style={{ padding: 22, marginTop: 16 }}>
        <div className="ad-kicker" style={{ marginBottom: 14 }}>Change password</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 380 }}>
          <Field label="Current password"><input className="ad-input" type="password" autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} /></Field>
          <Field label="New password"><input className="ad-input" type="password" autoComplete="new-password" value={nw} onChange={(e) => setNw(e.target.value)} /></Field>
          <Field label="Confirm new password"><input className="ad-input" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></Field>
        </div>
        {pwErr && <div className="ad-alert" style={{ marginTop: 12, color: 'var(--brand-ink)' }}>{pwErr}</div>}
        {pwMsg && <div className="ad-alert ok" style={{ marginTop: 12 }}>{pwMsg}</div>}
        <button className="ad-btn" style={{ marginTop: 16 }} disabled={pwBusy || !cur || !nw || !confirm} onClick={changePassword}>{pwBusy ? 'Updating…' : 'Update password'}</button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}><span className="ad-soft" style={{ fontSize: 12 }}>{label}</span>{children}</label>
}
