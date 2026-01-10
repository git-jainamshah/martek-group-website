'use client'

import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import Link from 'next/link'

const packages = [
  {
    name: 'Starter',
    price: '$499',
    period: 'one-time',
    description: 'Perfect for small businesses getting started',
    features: [
      '5-Page Responsive Website',
      'Basic SEO Setup',
      'Social Media Setup (3 platforms)',
      'Contact Form Integration',
      '1 Month Support',
      'Mobile Responsive Design'
    ],
    popular: false,
    color: 'primary'
  },
  {
    name: 'Professional',
    price: '$1,299',
    period: 'one-time',
    description: 'Ideal for growing businesses',
    features: [
      '10-Page Custom Website',
      'Advanced SEO Optimization',
      'Social Media Management (3 months)',
      'Google Analytics Setup',
      'Email Marketing Integration',
      '3 Months Support',
      'Performance Optimization',
      'Content Creation (10 posts)'
    ],
    popular: true,
    color: 'secondary'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'quote',
    description: 'Tailored solutions for large businesses',
    features: [
      'Unlimited Pages & Features',
      'Complete Digital Marketing Strategy',
      'Dedicated Account Manager',
      '24/7 Support',
      'Custom Integrations',
      'Ongoing Optimization',
      'Monthly Analytics Reports',
      'A/B Testing & Conversion Optimization'
    ],
    popular: false,
    color: 'primary'
  },
]

export default function PricingPackages() {
  return (
    <section id="pricing" className="section-padding bg-gradient-to-br from-gray-50 to-primary-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Package
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Affordable pricing plans designed to scale with your business
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => {
            const colorClasses = pkg.color === 'primary'
              ? 'border-primary-200 bg-white'
              : 'border-secondary-300 bg-gradient-to-br from-secondary-50 to-white'
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl p-8 border-2 ${colorClasses} shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  pkg.popular ? 'scale-105 md:-mt-4' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-secondary-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Sparkles className="w-4 h-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {pkg.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{pkg.price}</span>
                    {pkg.period !== 'quote' && (
                      <span className="text-gray-600 ml-2">/{pkg.period}</span>
                    )}
                  </div>
                  <p className="text-gray-600">{pkg.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={pkg.price === 'Custom' ? '/contact' : `/contact?package=${pkg.name}`}
                  className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    pkg.popular
                      ? 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  {pkg.price === 'Custom' ? 'Get Custom Quote' : 'Get Started Now'}
                </Link>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Need something different? We offer custom packages tailored to your needs.
          </p>
          <Link href="/contact" className="text-primary-600 font-semibold hover:text-primary-700 underline">
            Contact us for a custom quote →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
