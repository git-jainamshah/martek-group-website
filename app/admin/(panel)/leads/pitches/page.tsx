'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Inbox, List, UserPlus } from 'lucide-react'
import OfflineLeadForm from '@/components/admin/OfflineLeadForm'
import LeadKindTable from '@/components/admin/LeadKindTable'

export default function PitchesPage() {
  const [tab, setTab] = useState<'manage' | 'add'>('manage')
  const [reloadKey, setReloadKey] = useState(0)
  const [toast, setToast] = useState('')

  // Auto-dismiss, and clear the timer on unmount so it cannot fire into a
  // component that is no longer mounted.
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 4000)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <div style={{ maxWidth: 1040 }}>
      {toast && (
        <div className="ad-toast" role="status" aria-live="polite">
          <span className="dot" />{toast}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
        <div>
          <div className="ad-kicker">Growth</div>
          <h1>Pitch <span className="it">Management</span></h1>
          <p className="ad-mut" style={{ fontSize: 14, marginTop: 6, maxWidth: 560 }}>
            Leads we created by pitching client work - cold outreach, proposals, events.
            Track every pitch from new to qualified, won, or lost, all in one place.
          </p>
        </div>
        <Link href="/admin/leads" className="ad-btn-ghost"><Inbox size={14} /> All Leads</Link>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button className={tab === 'manage' ? 'ad-btn' : 'ad-btn-ghost'} onClick={() => setTab('manage')}>
          <List size={14} /> Manage Pitches
        </button>
        <button className={tab === 'add' ? 'ad-btn' : 'ad-btn-ghost'} onClick={() => setTab('add')}>
          <UserPlus size={14} /> Add Pitch
        </button>
      </div>

      {tab === 'manage' ? (
        <LeadKindTable kind="pitch" reloadKey={reloadKey} />
      ) : (
        <div className="ad-card" style={{ padding: 22 }}>
          <OfflineLeadForm
            kind="pitch"
            onAdded={(name) => {
              setReloadKey((k) => k + 1)
              setTab('manage')
              setToast(`Pitch added${name ? ` - ${name}` : ''}`)
            }}
          />
        </div>
      )}
    </div>
  )
}
