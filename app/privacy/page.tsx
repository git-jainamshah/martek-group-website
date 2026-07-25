import { Metadata } from 'next'
import { PRIVACY_DEFAULT_HTML, formatLegalDate, sanitizeHtml } from '@/lib/admin/legal-defaults'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  alternates: { canonical: '/privacy' },
  openGraph: { title: 'Marrelay - Privacy Policy', url: '/privacy' },
  description: 'Privacy Policy for Marrelay website.',
}

export const revalidate = 60

async function getDoc() {
  try {
    const { getSetting } = require('@/lib/admin/db') as typeof import('@/lib/admin/db')
    const doc = await getSetting<{ html: string; updatedAt: string }>('legal_privacy')
    if (doc?.html) return doc
  } catch { /* fall back */ }
  return { html: PRIVACY_DEFAULT_HTML, updatedAt: new Date().toISOString() }
}

export default async function PrivacyPage() {
  const doc = await getDoc()
  return (
    <div className="pt-24 section-padding">
      <div className="container-custom max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">Last Updated: {formatLegalDate(doc.updatedAt)}</p>
          <div className="legal-copy" dangerouslySetInnerHTML={{ __html: sanitizeHtml(doc.html) }} />
        </div>
      </div>
    </div>
  )
}
