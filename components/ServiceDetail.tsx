'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Code, 
  TrendingUp, 
  Share2, 
  Search, 
  DraftingCompass,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const services = [
  {
    id: 'web-development',
    icon: Code,
    title: 'Web Development & Digital Branding',
    description: 'Create stunning, responsive websites that represent your brand perfectly. From custom web applications to e-commerce solutions, we build digital experiences that convert visitors into customers.',
    fullDescription: 'We specialize in creating modern, high-performance websites that not only look great but also deliver exceptional user experiences. Our web development services include custom website design, e-commerce solutions, brand identity development, and ongoing maintenance.',
    features: [
      'Custom Website Design & Development',
      'E-commerce & Online Store Solutions',
      'Brand Identity & Logo Design',
      'UI/UX Design & Optimization',
      'Responsive Mobile Design',
      'Content Management Systems',
      'Performance Optimization',
      'Website Maintenance & Support'
    ],
    benefits: [
      'Increased online visibility and brand presence',
      'Improved user engagement and conversion rates',
      'Professional image that builds trust',
      'SEO-friendly architecture',
      'Scalable solutions that grow with your business'
    ],
    color: 'primary'
  },
  {
    id: 'data-analytics',
    icon: TrendingUp,
    title: 'Data & Analytics for Digital Existence',
    description: 'Harness the power of your data. We provide comprehensive analytics solutions to understand your audience, track performance, and make data-driven decisions that drive growth.',
    fullDescription: 'Transform raw data into actionable insights. Our data analytics services help you understand customer behavior, optimize marketing campaigns, and make informed business decisions based on real data.',
    features: [
      'Data Collection & Integration',
      'Custom Dashboard Development',
      'Performance Analytics & Reporting',
      'Business Intelligence Solutions',
      'Customer Behavior Analysis',
      'Marketing Campaign Analytics',
      'ROI Tracking & Measurement',
      'Predictive Analytics'
    ],
    benefits: [
      'Data-driven decision making',
      'Improved marketing ROI',
      'Better understanding of customer needs',
      'Optimized business processes',
      'Competitive advantage through insights'
    ],
    color: 'secondary'
  },
  {
    id: 'marketing',
    icon: Share2,
    title: 'Social Media Marketing & Branding',
    description: 'Build a strong online presence across all social platforms. Our strategic social media campaigns increase brand awareness, engage your audience, and drive meaningful connections.',
    fullDescription: 'We help you build and maintain a powerful social media presence that engages your audience and drives business results. From content creation to community management, we handle it all.',
    features: [
      'Social Media Strategy Development',
      'Content Creation & Curation',
      'Community Management',
      'Social Media Advertising',
      'Influencer Outreach & Partnerships',
      'Brand Awareness Campaigns',
      'Engagement & Growth Strategies',
      'Social Media Analytics & Reporting'
    ],
    benefits: [
      'Increased brand visibility and awareness',
      'Higher engagement rates',
      'Better customer relationships',
      'More qualified leads',
      'Improved brand reputation'
    ],
    color: 'primary'
  },
  {
    id: 'seo',
    icon: Search,
    title: 'SEO Marketing & Digital Ads',
    description: 'Get found online with our proven SEO strategies and targeted advertising campaigns. Increase your visibility, attract qualified leads, and maximize your ROI.',
    fullDescription: 'Our comprehensive SEO and digital advertising services ensure your business gets found by the right people at the right time. We combine technical SEO, content optimization, and paid advertising to drive results.',
    features: [
      'Technical SEO Optimization',
      'Keyword Research & Strategy',
      'Content Optimization',
      'Local SEO Services',
      'Google Ads Management',
      'PPC Campaign Management',
      'Conversion Rate Optimization',
      'SEO Analytics & Reporting'
    ],
    benefits: [
      'Higher search engine rankings',
      'Increased organic traffic',
      'More qualified leads',
      'Better ROI on ad spend',
      'Long-term sustainable growth'
    ],
    color: 'secondary'
  },
  {
    id: 'engineering',
    icon: DraftingCompass,
    title: 'Engineering Drawings',
    description: 'Professional mechanical and civil engineering drawings with precision and attention to detail. From initial concepts to detailed blueprints, we deliver accurate technical documentation.',
    fullDescription: 'We provide professional engineering drawing services for both mechanical and civil engineering projects. Our experienced team delivers accurate, detailed technical drawings that meet industry standards.',
    features: [
      'CAD Drawing & Design',
      '3D Modeling & Visualization',
      'Technical Specifications',
      'Blueprint Development',
      'Mechanical Engineering Drawings',
      'Civil Engineering Drawings',
      'Engineering Consultation',
      'Revision & Updates'
    ],
    benefits: [
      'Accurate technical documentation',
      'Industry-standard compliance',
      'Clear project visualization',
      'Faster project approvals',
      'Professional presentation materials'
    ],
    color: 'primary'
  },
]

export default function ServiceDetail() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white section-padding">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Our Services
          </h1>
          <p className="text-xl text-primary-50 max-w-3xl mx-auto">
            Comprehensive digital solutions and engineering services to elevate your business
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="space-y-24">
            {services.map((service, index) => {
              const Icon = service.icon
              const isEven = index % 2 === 0
              
              return (
                <div
                  key={service.id}
                  id={service.id}
                  className="scroll-mt-24"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                  >
                    <div className="flex-1">
                      <div className={`${service.color === 'primary' ? 'bg-primary-100' : 'bg-secondary-100'} w-20 h-20 rounded-2xl flex items-center justify-center mb-6`}>
                        <Icon className={`w-10 h-10 ${service.color === 'primary' ? 'text-primary-600' : 'text-secondary-600'}`} />
                      </div>
                      
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {service.title}
                      </h2>
                      
                      <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                        {service.fullDescription}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">What We Offer:</h3>
                          <ul className="space-y-2">
                            {service.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Key Benefits:</h3>
                          <ul className="space-y-2">
                            {service.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-secondary-600 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <Link
                        href="/contact"
                        className="btn-primary inline-flex items-center space-x-2"
                      >
                        <span>Get Quote for This Service</span>
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>

                    <div className="flex-1">
                      <div className={`${service.color === 'primary' ? 'bg-gradient-to-br from-primary-50 to-primary-100' : 'bg-gradient-to-br from-secondary-50 to-secondary-100'} rounded-2xl p-8 h-full`}>
                        <div className="text-center">
                          <Icon className={`w-32 h-32 mx-auto ${service.color === 'primary' ? 'text-primary-600' : 'text-secondary-600'} opacity-50`} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help transform your business with our services
          </p>
          <Link href="/contact" className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2">
            <span>Get Your Free Quote</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  )
}
