'use client'

import { Award, Users, Target, Heart, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import AnimatedGridBackground from '@/components/AnimatedGridBackground'
import { motion } from 'framer-motion'

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Precision Execution',
      description: 'We measure twice and cut once. Every line of code is written with a purpose, focusing on performance and maintainability.'
    },
    {
      icon: Heart,
      title: 'Radical Transparency',
      description: 'No hidden fees, no "black box" processes. You verify our code, see our roadmap, and know exactly where we stand.'
    },
    {
      icon: Users,
      title: 'Extension of Your Team',
      description: 'We don\'t act like a vendor. We embed ourselves in your vision, caring about your product\'s success as much as you do.'
    },
    {
      icon: Award,
      title: 'Future-Proof By Design',
      description: 'We build MVPs that are ready to scale. No throwaway code—your foundation is built to handle your future success.'
    }
  ]

  return (
    <div className="bg-background min-h-screen transition-colors duration-300">
      <PageHero
        title="About Martek Group"
        subtitle="Bringing enterprise-grade engineering to startups and modern brands."
        backgroundComponent={<AnimatedGridBackground />}
      />

      {/* Mission Section */}
      <section className="section-padding bg-background relative overflow-hidden transition-colors duration-300">
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight text-foreground">
              Built for Speed & Scale
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-light">
              We founded Martek Group to bridge the gap between &quot;fast but messy&quot; freelancers and &quot;perfect but slow&quot; big agencies. We are a lean team of senior engineers who build robust digital products without the fluff.
            </p>
            <div className="text-lg text-muted-foreground leading-relaxed space-y-6">
              <p>
                We don&apos;t just write code; we architect solutions that can handle your next 10x growth stage. We believe in direct communication, rapid iteration, and code quality that sleeps well at night.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-muted/30 border-t border-border transition-colors duration-300">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-foreground mb-16 text-center tracking-tight"
          >
            Our Core Principles
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background border border-border p-8 rounded-xl hover:shadow-lg transition-all duration-300 group"
              >
                <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                  <value.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-light text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Partner with Excellence
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
            Engage with our consultants today to architect the future of your enterprise.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 bg-white text-primary px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-gray-100 transition-all hover:-translate-y-1 shadow-xl"
          >
            <span>Initiate Consultation</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
