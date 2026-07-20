import { Metadata } from 'next'
import PricingPackages from '@/components/PricingPackages'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getPackageOverrides } from '@/lib/pricing'

export const metadata: Metadata = {
  title: 'Pricing - Marrelay',
  description: 'Affordable pricing plans for web development, digital marketing, and engineering services. Choose from Starter, Professional, or Custom Enterprise packages.',
}

export default async function PricingPage() {
  const packages = (await getPackageOverrides('pricing-page')).map((p) => ({
    name: p.name,
    price: p.price,
    period: p.priceNote ?? 'one-time',
    description: p.description ?? '',
    features: p.items ?? [],
    popular: !!p.featured,
    color: 'primary',
  }))

  return (
    <div className="pt-24">
      <PricingPackages packages={packages} />
      
      {/* Additional Info Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-12">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Can I customize a package?</h3>
                <p className="text-gray-600">
                  Absolutely! All our packages can be customized to fit your specific needs. Contact us for a custom quote.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept all major credit cards, bank transfers, and payment plans are available for larger projects.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Do you offer ongoing support?</h3>
                <p className="text-gray-600">
                  Yes! All packages include support periods, and we offer monthly maintenance plans for long-term partnerships.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 mb-2">How long do projects typically take?</h3>
                <p className="text-gray-600">
                  Timeline varies by project, but most websites are completed within 2-6 weeks. We&apos;ll provide a detailed timeline with your quote.
                </p>
              </div>
            </div>

            <div className="mt-12">
              <Link href="/contact" className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center space-x-2">
                <span>Still have questions? Contact us</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
