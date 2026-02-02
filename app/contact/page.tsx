'use client'

import { useSearchParams } from 'next/navigation'
import ContactForm from '@/components/ContactForm'
import { Mail, Phone, MapPin } from 'lucide-react'
import PageHero from '@/components/PageHero'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function ContactPage() {
  const searchParams = useSearchParams()
  const selectedPackage = searchParams.get('package')

  return (
    <div className="bg-background min-h-screen transition-colors duration-300">
      <PageHero
        title="Contact Us"
        subtitle="Initiate a dialogue with our strategic consultants to explore partnership opportunities."
        backgroundImage="/assets/contact-us-banner-bg.jpg"
      />

      {/* Split Layout Section */}
      <section className="section-padding bg-background transition-colors duration-300">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

            {/* Left Column: Contact Info & Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Global Headquarters
                </h2>
                <p className="text-muted-foreground text-lg font-light leading-relaxed mb-8">
                  Our consultants are available for in-person and virtual consultations. We operate globally to ensure seamless service delivery across all time zones.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4 group">
                    <div className="mt-1 bg-primary/10 p-2 rounded-full group-hover:bg-primary transition-colors duration-300">
                      <Mail className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Email Inquiry</p>
                      <a href="mailto:info@martekgroup.com" className="text-foreground text-lg hover:text-primary transition-colors">
                        info@martekgroup.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="mt-1 bg-primary/10 p-2 rounded-full group-hover:bg-primary transition-colors duration-300">
                      <Phone className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Direct Line</p>
                      <a href="tel:+1234567890" className="text-foreground text-lg hover:text-primary transition-colors">
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="mt-1 bg-primary/10 p-2 rounded-full group-hover:bg-primary transition-colors duration-300">
                      <MapPin className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Office</p>
                      <p className="text-foreground text-lg">
                        100 Enterprise Way, Suite 500<br />
                        New York, NY 10001
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Corporate Image */}
              <div className="relative h-64 md:h-80 w-full rounded-none overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <Image
                  src="/assets/contact-us-form.jpg"
                  alt="Martek Group Office"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Right Column: Corporate Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-muted/10 p-8 md:p-12 border border-border"
            >
              {selectedPackage && (
                <div className="mb-8 p-4 bg-primary/10 border-l-2 border-primary">
                  <p className="text-primary font-medium">
                    Inquiry regarding: <span className="font-bold">{selectedPackage}</span>
                  </p>
                </div>
              )}

              <ContactForm selectedPackage={selectedPackage || undefined} />
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  )
}
