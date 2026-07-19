'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

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
      if (data.mustChangePassword) {
        router.push('/admin/change-password')
      } else {
        router.push(params.get('next') || '/admin')
      }
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
          <div className="text-xl font-bold tracking-tight">Martek <span className="text-neutral-400">Admin</span></div>
          <p className="text-sm text-neutral-400 mt-1">Sign in to manage the website.</p>
        </div>
        {error && <div className="text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-lg px-3 py-2">{error}</div>}
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wider text-neutral-400">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-400" />
        </div>
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wider text-neutral-400">Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-400" />
        </div>
        <button disabled={busy} className="w-full bg-white text-black rounded-lg py-2.5 text-sm font-bold hover:bg-neutral-200 disabled:opacity-50 transition">
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
