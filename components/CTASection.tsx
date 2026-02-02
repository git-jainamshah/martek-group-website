'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Phone, Mail, MessageCircle } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="section-padding bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 L100 0 L100 100 Z" fill="black" />
        </svg>
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-tight">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-12 text-primary-foreground/90 font-light max-w-2xl mx-auto">
            Get a free consultation and quote. No obligations, just expert advice to help you succeed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/contact"
              className="bg-background text-foreground hover:bg-background/90 font-bold uppercase tracking-widest py-4 px-10 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center space-x-2 text-sm"
            >
              <span>Get Free Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-bold uppercase tracking-widest py-4 px-10 rounded-full transition-all duration-300 text-sm hover:shadow-lg hover:-translate-y-1"
            >
              Schedule Consultation
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background/10 backdrop-blur-sm rounded-xl p-8 border border-primary-foreground/20 hover:bg-background/20 transition-colors">
              <Phone className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-bold uppercase tracking-wide mb-2 text-sm">Call Us</h3>
              <p className="text-primary-foreground/80 text-sm">Speak directly with our team</p>
            </div>
            <div className="bg-background/10 backdrop-blur-sm rounded-xl p-8 border border-primary-foreground/20 hover:bg-background/20 transition-colors">
              <Mail className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-bold uppercase tracking-wide mb-2 text-sm">Email Us</h3>
              <p className="text-primary-foreground/80 text-sm">Get a detailed response</p>
            </div>
            <div className="bg-background/10 backdrop-blur-sm rounded-xl p-8 border border-primary-foreground/20 hover:bg-background/20 transition-colors">
              <MessageCircle className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-bold uppercase tracking-wide mb-2 text-sm">Live Chat</h3>
              <p className="text-primary-foreground/80 text-sm">Instant support available</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
