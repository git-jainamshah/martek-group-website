'use client'

import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import Link from 'next/link'

export type PricingPkg = {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  popular: boolean
  color: string
}

const DEFAULT_PACKAGES: PricingPkg[] = [
  {
    name: 'Starter',
    price: '$499',
    period: 'one-time',
    description: 'Perfect for small businesses getting started',
    features: [
      '5-Page Responsive Website',
      'Basic SEO Setup',
      'Social Media Setup',
      'Contact Form Integration',
      '1 Month Support'
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
      'Google Analytics Setup',
      'Email Marketing Integration',
      '3 Months Support'
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
      'Digital Marketing Strategy',
      'Dedicated Account Manager',
      '24/7 Support',
      'Custom Integrations'
    ],
    popular: false,
    color: 'primary'
  },
]

export default function PricingPackages({ packages = DEFAULT_PACKAGES }: { packages?: PricingPkg[] }) {
  return (
    <section id="pricing" className="section-padding bg-background border-t border-border">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-light text-foreground mb-4 uppercase tracking-tight">
            Pricing <span className="font-bold">Packages</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Simple, transparent pricing to scale your business
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => {
            const isPopular = pkg.popular

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl p-8 border ${isPopular ? 'border-primary bg-muted/50' : 'border-border bg-background'
                  } hover:border-primary/50 transition-all duration-300 ${isPopular ? 'scale-105 md:-mt-4 z-10' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2 uppercase tracking-wide">
                    {pkg.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-foreground">{pkg.price}</span>
                    {pkg.period !== 'quote' && (
                      <span className="text-gray-500 ml-2 text-sm">/{pkg.period}</span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">{pkg.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={pkg.price === 'Custom' ? '/contact' : `/contact?package=${pkg.name}`}
                  className={`block w-full text-center py-3 px-6 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-200 ${isPopular
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20'
                    : 'bg-foreground text-background hover:bg-foreground/90'
                    }`}
                >
                  {pkg.price === 'Custom' ? 'Get Quote' : 'Get Started'}
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
