import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Martek Group',
  description: 'Terms of Service for Martek Group.',
}

export default function TermsPage() {
  return (
    <div className="pt-24 section-padding">
      <div className="container-custom max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Agreement to Terms</h2>
            <p>
              By accessing and using the Martek Group website, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Services</h2>
            <p>
              Martek Group provides digital services including web development, data analytics, social media marketing, 
              SEO, and engineering drawings. All services are subject to separate service agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Payment Terms</h2>
            <p>
              Payment terms will be specified in individual service agreements. Generally, payments are due 
              according to the agreed-upon schedule in your project contract.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Intellectual Property</h2>
            <p>
              All content on this website, including designs, text, graphics, and logos, is the property of 
              Martek Group and is protected by copyright and trademark laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
            <p>
              Martek Group shall not be liable for any indirect, incidental, or consequential damages arising 
              from the use of our services or website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p>
              For questions about these terms, please contact us at{' '}
              <a href="mailto:info@martekgroup.com" className="text-primary-600 hover:underline">
                info@martekgroup.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
