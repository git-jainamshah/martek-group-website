import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Martek Group',
  description: 'Privacy Policy for Martek Group website.',
}

export default function PrivacyPage() {
  return (
    <div className="pt-24 section-padding">
      <div className="container-custom max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Introduction</h2>
            <p>
              At Martek Group, we respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name and contact information (email, phone number)</li>
              <li>Company information</li>
              <li>Project details and requirements</li>
              <li>Website usage data and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and improve our services</li>
              <li>Respond to your inquiries and requests</li>
              <li>Send you relevant information about our services</li>
              <li>Analyze website usage and trends</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Protection</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data 
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p>
              If you have questions about this privacy policy, please contact us at{' '}
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
