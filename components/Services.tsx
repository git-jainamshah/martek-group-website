'use client'

import { motion } from 'framer-motion'
import { 
  Code, 
  TrendingUp, 
  Share2, 
  Search, 
  DraftingCompass,
  ArrowRight 
} from 'lucide-react'
import Link from 'next/link'

const services = [
  {
    icon: Code,
    title: 'Web Development & Digital Branding',
    description: 'Create stunning, responsive websites that represent your brand perfectly. From custom web applications to e-commerce solutions, we build digital experiences that convert visitors into customers.',
    features: ['Custom Website Design', 'E-commerce Solutions', 'Brand Identity', 'UI/UX Design', 'Performance Optimization'],
    color: 'primary'
  },
  {
    icon: TrendingUp,
    title: 'Data & Analytics',
    description: 'Harness the power of your data. We provide comprehensive analytics solutions to understand your audience, track performance, and make data-driven decisions that drive growth.',
    features: ['Data Analysis', 'Performance Tracking', 'Custom Dashboards', 'Business Intelligence', 'Reporting'],
    color: 'secondary'
  },
  {
    icon: Share2,
    title: 'Social Media Marketing',
    description: 'Build a strong online presence across all social platforms. Our strategic social media campaigns increase brand awareness, engage your audience, and drive meaningful connections.',
    features: ['Content Strategy', 'Community Management', 'Social Media Advertising', 'Influencer Outreach', 'Brand Awareness'],
    color: 'primary'
  },
  {
    icon: Search,
    title: 'SEO & Digital Ads',
    description: 'Get found online with our proven SEO strategies and targeted advertising campaigns. Increase your visibility, attract qualified leads, and maximize your ROI.',
    features: ['SEO Optimization', 'PPC Campaigns', 'Google Ads', 'Local SEO', 'Conversion Optimization'],
    color: 'secondary'
  },
  {
    icon: DraftingCompass,
    title: 'Engineering Drawings',
    description: 'Professional mechanical and civil engineering drawings with precision and attention to detail. From initial concepts to detailed blueprints, we deliver accurate technical documentation.',
    features: ['CAD Drawings', 'Technical Specifications', '3D Modeling', 'Blueprint Design', 'Engineering Consultation'],
    color: 'primary'
  },
]

export default function Services() {
  return (
    <section id="services" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive solutions to elevate your business in the digital age
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            const colorClasses = service.color === 'primary' 
              ? 'bg-primary-100 text-primary-600' 
              : 'bg-secondary-100 text-secondary-600'
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
              >
                <div className={`${colorClasses} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <span className="text-primary-600 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors group-hover:translate-x-1 duration-300"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/contact" className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2">
            <span>Get Started Today</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
