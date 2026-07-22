'use client'

export default function PrintButton() {
  return (
    <div className="noprint" style={{ display: 'flex', gap: 10, justifyContent: 'center', padding: '18px 0 26px' }}>
      <button onClick={() => window.print()} style={{ background: '#1A1A1E', color: '#FBF6EC', border: 0, borderRadius: 999, padding: '11px 22px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
        Print / Save as PDF
      </button>
      <a href="/admin/finance/invoices" style={{ background: 'transparent', color: '#1A1A1E', border: '1.5px solid #1A1A1E', borderRadius: 999, padding: '11px 22px', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
        Back to invoices
      </a>
    </div>
  )
}
