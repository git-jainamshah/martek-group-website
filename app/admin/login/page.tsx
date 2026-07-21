'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PasswordInput } from '@/components/admin/ui'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed.')
        return
      }
      // Internal-only: a single lightweight dataLayer push on successful admin login.
      if (typeof window !== 'undefined') {
        const w = window as unknown as { dataLayer: Record<string, unknown>[] }
        w.dataLayer = w.dataLayer || []
        w.dataLayer.push({
          event: 'admin_login',
          login_status: 'success',
          login_method: 'password',
          user_role: data?.user?.role || '',
          must_change_password: !!data.mustChangePassword,
        })
      }
      router.push(data.mustChangePassword ? '/admin/change-password' : (params.get('next') || '/admin'))
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/martek-mark.png" alt="Marrelay" width={44} height={44} style={{ borderRadius: 11, marginBottom: 16 }} />
        <h1 style={{ fontSize: 28, marginBottom: 4 }}>Marrelay <span className="it">Admin</span></h1>
        <p className="ad-mut" style={{ fontSize: 14, marginBottom: 22 }}>Sign in to manage the website.</p>

        {error && <div className="ad-alert err" style={{ marginBottom: 16 }}>{error}</div>}

        <div style={{ marginBottom: 16 }}>
          <label className="ad-label">Email</label>
          <input type="email" required className="ad-input" value={email} autoComplete="username"
            onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div style={{ marginBottom: 22 }}>
          <label className="ad-label">Password</label>
          <PasswordInput value={password} onChange={setPassword} autoComplete="current-password" required />
        </div>
        <button disabled={busy} className="ad-btn brand" style={{ width: '100%', justifyContent: 'center' }}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
