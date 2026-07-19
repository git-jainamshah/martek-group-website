'use client'

import { useEffect, useState } from 'react'
import { Save, ExternalLink } from 'lucide-react'
import { Section } from '@/components/admin/ui'
import RichTextEditor from '@/components/admin/RichTextEditor'

type LegalDoc = { html: string; updatedAt: string }

function fmtFull(iso: string): string {
  const d = new Date(iso)
  return `${d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}, ${d.toLocaleDateString('en-US', { weekday: 'long' })}`
}

function LegalEditor({ settingKey, title, pagePath }: { settingKey: string; title: string; pagePath: string }) {
  const [doc, setDoc] = useState<LegalDoc | null>(null)
  const [draftHtml, setDraftHtml] = useState('')
  const [dirty, setDirty] = useState(false)
  const [toast, setToast] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/settings?key=${settingKey}`).then((r) => r.json()).then((d) => {
      if (d.value) {
        setDoc(d.value)
        setDraftHtml(d.value.html)
      }
    })
  }, [settingKey])

  async function save() {
    setBusy(true)
    const res = await fetch('/api/admin/settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: settingKey, value: { html: draftHtml } }),
    })
    setBusy(false)
    if (res.ok) {
      const now = new Date().toISOString()
      setDoc({ html: draftHtml, updatedAt: now })
      setDirty(false)
      setToast(`Saved — the live page now shows "Last Updated: ${fmtFull(now)}".`)
    } else {
      setToast('Save failed.')
    }
    setTimeout(() => setToast(''), 5000)
  }

  if (!doc) return <p className="ad-mut" style={{ fontSize: 14 }}>Loading…</p>

  return (
    <div>
      {toast && <div className="ad-alert ok" style={{ marginBottom: 14 }}>{toast}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
        <span className="ad-mut" style={{ fontSize: 13 }}>
          Last updated: <b>{fmtFull(doc.updatedAt)}</b> — updates automatically on every save.
        </span>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href={pagePath} target="_blank" className="ad-btn-ghost" style={{ padding: '7px 14px', fontSize: 12.5 }}>
            <ExternalLink size={14} /> View live page
          </a>
          <button onClick={save} disabled={busy || !dirty} className="ad-btn" style={{ padding: '8px 16px', fontSize: 12.5 }}>
            <Save size={14} /> {busy ? 'Saving…' : dirty ? `Save ${title}` : 'Saved'}
          </button>
        </div>
      </div>
      <RichTextEditor initialHtml={doc.html} onChange={(html) => { setDraftHtml(html); setDirty(true) }} />
    </div>
  )
}

export default function LegalPage() {
  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ marginBottom: 24 }}>
        <div className="ad-kicker">Content</div>
        <h1>Terms & <span className="it">Privacy</span></h1>
        <p className="ad-mut" style={{ fontSize: 14, marginTop: 8, maxWidth: 560 }}>
          Edit the copy of both legal pages. Any save automatically refreshes the
          &ldquo;Last Updated&rdquo; date shown on the live pages.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Section kicker="/terms" title="Terms of Service" defaultOpen>
          <LegalEditor settingKey="legal_terms" title="Terms" pagePath="/terms" />
        </Section>
        <Section kicker="/privacy" title="Privacy Policy" defaultOpen={false}>
          <LegalEditor settingKey="legal_privacy" title="Privacy" pagePath="/privacy" />
        </Section>
      </div>
    </div>
  )
}
