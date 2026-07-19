'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Code, BarChart, Smartphone, Search, PenTool, Database } from 'lucide-react'
import PageHero from '@/components/PageHero'

export default function ServicesView({ bannerImage }: { bannerImage: string }) {
  const services = [
    {
      title: "Digital Ecosystem Architecture",
      description: "Developing robust, scalable web infrastructures utilizing enterprise-grade technologies like React, Next.js, and Node.js.",
      icon: Code,
      features: ["Custom Software Development", "Enterprise E-commerce", "Headless CMS Solutions", "API Microservices"]
    },
    {
      title: "Business Intelligence & Analytics",
      description: "Transforming raw data into strategic assets. We provide comprehensive analytics to drive data-informed decision making.",
      icon: BarChart,
      features: ["Executive Dashboards", "Predictive Modeling", "KPI Tracking", "Market Intelligence"]
    },
    {
      title: "Mobile Solutions Engineering",
      description: "Architecting native and cross-platform mobile experiences that extend your enterprise reach to iOS and Android.",
      icon: Smartphone,
      features: ["Enterprise Mobility", "Cross-Platform Frameworks", "UX-Driven Design", "App Store Strategy"]
    },
    {
      title: "Digital Growth Strategy",
      description: "Maximizing market penetration through evidence-based SEO and targeted digital marketing campaigns.",
      icon: Search,
      features: ["Technical SEO Audits", "Content Strategy", "Brand Positioning", "Performance Marketing"]
    },
    {
      title: "Experience Design (UI/UX)",
      description: "Crafting intuitive, user-centric interfaces that streamline complex workflows and enhance user engagement.",
      icon: PenTool,
      features: ["User Journey Mapping", "Interactive Prototyping", "Interface Design", "Usability Testing"]
    },
    {
      title: "Technical Engineering Services",
      description: "Precision drafting and technical consulting for industrial and civil engineering projects.",
      icon: Database,
      features: ["CAD/CAM Drafting", "3D Parametric Modeling", "Technical Specifications", "Process Engineering"]
    }
  ]

  return (
    <div className="bg-background min-h-screen transition-colors duration-300">
      <PageHero
        title="Our Capabilities"
        subtitle="Comprehensive digital and engineering solutions tailored for enterprise scalability."
        backgroundImage={bannerImage}
      />

      <section className="section-padding bg-background transition-colors duration-300">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-muted/20 backdrop-blur-sm border border-border rounded-xl p-8 hover:bg-muted/40 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700"></div>

                <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <service.icon className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed font-light text-sm">
                  {service.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className="inline-flex items-center text-foreground text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors group/link"
                >
                  Explore Solution
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-muted/30 border-t border-border transition-colors duration-300">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Require a Bespoke Solution?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light">
            We recognize that complex challenges require tailored strategies. Contact our team to discuss your specific operational requirements.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 bg-primary text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-primary/90 transition-all hover:-translate-y-1 shadow-xl"
          >
            <span>Consult with an Expert</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
