import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Abstracts',
  description: 'View our abstracts and case studies.',
  alternates: { canonical: '/abstracts' },
  // Thin placeholder page: keep it out of the index so it does not dilute crawl budget.
  robots: { index: false, follow: true },
}

export default function AbstractsPage() {
  return (
    <div className="pt-24 section-padding">
      <div className="container-custom">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 text-center">
          Abstracts
        </h1>
        <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto">
          Coming soon - View our abstracts and case studies
        </p>
      </div>
    </div>
  )
}
