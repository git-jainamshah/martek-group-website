'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const services = [
  {
    title: 'Web Development',
    description: 'We build digital experiences that convert.',
    features: ['Custom Website Design', 'E-commerce Solutions', 'Brand Identity', 'UI/UX Design', 'Performance Optimization']
  },
  {
    title: 'Data & Analytics',
    description: 'Harness the power of your data to drive growth.',
    features: ['Data Analysis', 'Performance Tracking', 'Custom Dashboards', 'Business Intelligence', 'Reporting']
  },
  {
    title: 'Social Media',
    description: 'Strategic campaigns that build connections.',
    features: ['Content Strategy', 'Community Management', 'Social Media Advertising', 'Influencer Outreach', 'Brand Awareness']
  },
  {
    title: 'SEO & Ads',
    description: 'Maximize visibility and attract qualified leads.',
    features: ['SEO Optimization', 'PPC Campaigns', 'Google Ads', 'Local SEO', 'Conversion Optimization']
  },
  {
    title: 'Engineering',
    description: 'Precision drafting and technical documentation.',
    features: ['CAD Drawings', 'Technical Specifications', '3D Modeling', 'Blueprint Design', 'Engineering Consultation']
  },
]

export default function Services() {
  return (
    <section id="services" className="section-padding bg-background text-foreground">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-light mb-8 uppercase tracking-tight">
            Our <span className="font-bold">Capabilities</span>
          </h2>
          <div className="h-px w-full bg-border"></div>
        </motion.div>

        <div className="space-y-0">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b border-border hover:bg-muted/30 transition-colors duration-300 px-4 -mx-4 rounded-lg group"
            >
              <div className="md:col-span-5">
                <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
              </div>
              <div className="md:col-span-7">
                <p className="text-xl text-muted-foreground mb-6 font-light">
                  {service.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-500 font-medium uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <Link
            href="/contact"
            className="inline-flex items-center space-x-3 text-foreground border border-border px-8 py-4 rounded-full hover:bg-foreground hover:text-background transition-all duration-300 uppercase tracking-widest text-sm font-bold"
          >
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
