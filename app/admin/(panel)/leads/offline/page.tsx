'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { UserPlus, Upload, FileDown, FileSpreadsheet, Inbox, List } from 'lucide-react'
import OfflineLeadForm from '@/components/admin/OfflineLeadForm'
import LeadKindTable from '@/components/admin/LeadKindTable'

type ImportResult = { added: number; skipped: { row: number; reason: string }[] }

export default function OfflineLeadsPage() {
  const [tab, setTab] = useState<'manage' | 'single' | 'batch'>('manage')
  const [result, setResult] = useState<ImportResult | null>(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)
  const bump = () => setReloadKey((k) => k + 1)

  async function upload(file: File) {
    setErr(''); setResult(null); setBusy(true)
    const csv = await file.text()
    const res = await fetch('/api/admin/leads/offline', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ csv }),
    })
    const d = await res.json()
    setBusy(false)
    if (fileRef.current) fileRef.current.value = ''
    if (!res.ok) return setErr(d.error || 'Import failed.')
    setResult({ added: d.added, skipped: d.skipped || [] })
    bump()
  }

  return (
    <div style={{ maxWidth: 1040 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
        <div>
          <div className="ad-kicker">Growth</div>
          <h1>Offline <span className="it">Leads</span></h1>
          <p className="ad-mut" style={{ fontSize: 14, marginTop: 6, maxWidth: 560 }}>
            Leads that reached us by phone, email, walk-in, or events. Track each one&apos;s
            status here; they also join the main pipeline and dashboard.
          </p>
        </div>
        <Link href="/admin/leads" className="ad-btn-ghost"><Inbox size={14} /> All Leads</Link>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button className={tab === 'manage' ? 'ad-btn' : 'ad-btn-ghost'} onClick={() => setTab('manage')}>
          <List size={14} /> Manage Leads
        </button>
        <button className={tab === 'single' ? 'ad-btn' : 'ad-btn-ghost'} onClick={() => setTab('single')}>
          <UserPlus size={14} /> Add Single Lead
        </button>
        <button className={tab === 'batch' ? 'ad-btn' : 'ad-btn-ghost'} onClick={() => setTab('batch')}>
          <Upload size={14} /> Batch Upload (CSV)
        </button>
      </div>

      {tab === 'manage' && <LeadKindTable kind="offline" reloadKey={reloadKey} />}

      {tab === 'single' && (
        <div className="ad-card" style={{ padding: 22 }}>
          <OfflineLeadForm kind="offline" onAdded={bump} />
        </div>
      )}

      {tab === 'batch' && (
        <div className="ad-card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div className="ad-kicker" style={{ marginBottom: 8 }}>Before You Upload</div>
            <p className="ad-mut" style={{ fontSize: 13.5, margin: 0, maxWidth: 620 }}>
              Fill your data into the framework format below. Values are cleaned automatically
              (spaces trimmed, emails lowercased, casing fixed), invalid rows are skipped and
              reported, and the CSV itself is parsed in memory only - it is never stored on the system.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="/api/admin/leads/offline?download=framework" className="ad-btn-ghost">
              <FileDown size={14} /> Download The Data Framework
            </a>
            <a href="/api/admin/leads/offline?download=sample" className="ad-btn-ghost">
              <FileSpreadsheet size={14} /> Download Sample CSV
            </a>
          </div>
          <div>
            <label className="ad-label">CSV File</label>
            <input ref={fileRef} type="file" accept=".csv,text/csv" className="ad-input" disabled={busy}
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            {busy && <p className="ad-mut" style={{ fontSize: 13, marginTop: 8 }}>Importing…</p>}
          </div>

          {err && <div className="ad-alert err">{err}</div>}
          {result && (
            <div className={`ad-alert ${result.skipped.length ? 'err' : 'ok'}`}>
              <b>{result.added}</b> lead{result.added === 1 ? '' : 's'} imported successfully.
              {result.skipped.length > 0 && (
                <>
                  {' '}{result.skipped.length} row{result.skipped.length === 1 ? '' : 's'} skipped:
                  <ul style={{ margin: '8px 0 0 18px', fontSize: 12.5 }}>
                    {result.skipped.slice(0, 10).map((s) => <li key={s.row}>Row {s.row}: {s.reason}</li>)}
                    {result.skipped.length > 10 && <li>…and {result.skipped.length - 10} more</li>}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
