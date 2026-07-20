'use client'

import Link from 'next/link'
import { Inbox, Upload } from 'lucide-react'
import OfflineLeadForm from '@/components/admin/OfflineLeadForm'

export default function PitchesPage() {
  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
        <div>
          <div className="ad-kicker">Growth</div>
          <h1>Pitches</h1>
          <p className="ad-mut" style={{ fontSize: 14, marginTop: 6, maxWidth: 560 }}>
            Leads we created ourselves by pitching client work - cold outreach, proposals,
            events. They flow into the same pipeline, so you can track every pitch from
            qualified to won or lost alongside all other leads.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/admin/leads/offline" className="ad-btn-ghost" title="Batch upload accepts lead_type = pitch">
            <Upload size={14} /> Batch Upload
          </Link>
          <Link href="/admin/leads" className="ad-btn-ghost"><Inbox size={14} /> All Leads</Link>
        </div>
      </div>

      <div className="ad-card" style={{ padding: 22 }}>
        <OfflineLeadForm kind="pitch" />
      </div>
      <p className="ad-soft" style={{ fontSize: 12, marginTop: 12 }}>
        Need to add many pitches at once? Use Batch Upload on the Offline Leads page with <b>lead_type = pitch</b>.
      </p>
    </div>
  )
}
