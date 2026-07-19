'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5 bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
        <div>
          <div className="text-xl font-bold tracking-tight">Create your new password</div>
          <p className="text-sm text-neutral-400 mt-1">
            You signed in with a temporary password. Set a permanent one — the temporary password will be discarded.
          </p>
        </div>
        {error && <div className="text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-lg px-3 py-2">{error}</div>}
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wider text-neutral-400">New password</label>
          <input type="password" required minLength={8} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-400" />
        </div>
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wider text-neutral-400">Confirm new password</label>
          <input type="password" required minLength={8} value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-400" />
        </div>
        <button disabled={busy} className="w-full bg-white text-black rounded-lg py-2.5 text-sm font-bold hover:bg-neutral-200 disabled:opacity-50 transition">
          {busy ? 'Saving…' : 'Save & continue'}
        </button>
      </form>
    </div>
  )
}
