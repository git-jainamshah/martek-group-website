import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Abstracts - Martek Group',
  description: 'View our abstracts and case studies.',
}

export default function AbstractsPage() {
  return (
    <div className="pt-20 section-padding">
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
