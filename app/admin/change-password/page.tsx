'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PasswordInput } from '@/components/admin/ui'

export default function ChangePasswordPage() {
  const router = useRouter()
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (pw !== pw2) return setError('Passwords do not match.')
    if (pw.length < 8) return setError('Password must be at least 8 characters.')
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: pw }),
      })
      const data = await res.json()
      if (!res.ok) return setError(data.error || 'Could not update password.')
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <form onSubmit={submit} className="ad-card" style={{ width: '100%', maxWidth: 400, padding: 34 }}>
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>Create Your <span className="it">New Password</span></h1>
        <p className="ad-mut" style={{ fontSize: 14, marginBottom: 22 }}>
          You signed in with a temporary password. Set a permanent one - the temporary password will be discarded.
        </p>

        {error && <div className="ad-alert err" style={{ marginBottom: 16 }}>{error}</div>}

        <div style={{ marginBottom: 16 }}>
          <label className="ad-label">New password</label>
          <PasswordInput value={pw} onChange={setPw} autoComplete="new-password" required minLength={8} />
        </div>
        <div style={{ marginBottom: 22 }}>
          <label className="ad-label">Confirm new password</label>
          <PasswordInput value={pw2} onChange={setPw2} autoComplete="new-password" required minLength={8} />
        </div>
        <button disabled={busy} className="ad-btn brand" style={{ width: '100%', justifyContent: 'center' }}>
          {busy ? 'Saving…' : 'Save & continue'}
        </button>
      </form>
    </div>
  )
}
