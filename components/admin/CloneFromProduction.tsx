'use client'

import { useState } from 'react'
import { Database } from 'lucide-react'

/**
 * "Refresh this environment from production" panel.
 *
 * Only rendered on QA/DEV (the parent decides). Copying always flows
 * production -> here; the API refuses to run when it is production.
 */
export default function CloneFromProduction({ envLabel }: { envLabel: string }) {
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  async function run() {
    setError(''); setResult(null)
    if (!url.trim().startsWith('postgres')) {
      return setError('Paste the production connection string (starts with postgresql://).')
    }
    if (!confirm(
      `This ERASES all data in ${envLabel} and replaces it with a copy of production.\n\n` +
      `Production itself is never modified. Continue?`
    )) return

    setBusy(true)
    try {
      const res = await fetch('/api/admin/env/clone-from-production', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceUrl: url.trim() }),
      })
      const d = await res.json().catch(() => ({}))
      if (!res.ok) setError(d.error || 'Copy failed.')
      else { setResult(d); setUrl('') }
    } catch (e: any) {
      setError(e?.message || 'Network error.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ad-card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
        <Database size={16} />
        <h3 style={{ fontSize: 15, fontWeight: 700 }}>Refresh {envLabel} from production</h3>
      </div>
      <p className="ad-soft" style={{ fontSize: 12.5, lineHeight: 1.55, marginBottom: 14 }}>
        Replaces every record here with a copy of live production data - leads, users, invoices,
        settings, everything. Production is only read from, never written to. Run this whenever you
        want fresh data to test against.
      </p>

      <input
        className="ad-input"
        type="password"
        placeholder="postgresql://…  (production connection string)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        autoComplete="off"
        style={{ fontFamily: 'var(--mono)', fontSize: 12.5 }}
      />
      <p className="ad-soft" style={{ fontSize: 11, marginTop: 6 }}>
        Vercel → Storage → web-database → .env.local → Show secret → copy DATABASE_URL.
        It is used for this request only and never saved.
      </p>

      <button className="ad-btn" style={{ marginTop: 14 }} disabled={busy} onClick={run}>
        {busy ? 'Copying…' : 'Copy production data here'}
      </button>

      {error && <div className="ad-alert err" style={{ marginTop: 14 }}>{error}</div>}

      {result?.ok && (
        <div className="ad-alert ok" style={{ marginTop: 14 }}>
          <b>Copied {result.totalRows} rows into {result.target}.</b>
          <div style={{ marginTop: 8, fontFamily: 'var(--mono)', fontSize: 11.5, lineHeight: 1.7 }}>
            {Object.entries(result.copied as Record<string, number>)
              .filter(([, n]) => n > 0)
              .map(([t, n]) => `${t}: ${n}`)
              .join('  ·  ')}
          </div>
          <div style={{ marginTop: 8, fontSize: 12 }}>
            Sign in again with your production email and password - the user table was replaced.
          </div>
        </div>
      )}
    </div>
  )
}
