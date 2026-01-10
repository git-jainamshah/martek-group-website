import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blogs - Martek Group',
  description: 'Read our latest blogs and insights.',
}

export default function BlogsPage() {
  return (
    <div className="pt-20 section-padding">
      <div className="container-custom">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 text-center">
          Blogs
        </h1>
        <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto">
          Coming soon - Read our latest blogs and insights
        </p>
      </div>
    </div>
  )
}
