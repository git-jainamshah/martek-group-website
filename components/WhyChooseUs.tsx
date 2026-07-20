'use client'

import { motion } from 'framer-motion'
import { Award, Clock, Users, TrendingUp, Shield, Zap } from 'lucide-react'

const reasons = [
  {
    icon: Award,
    title: 'Proven Expertise',
    description: 'Years of experience delivering successful projects across industries'
  },
  {
    icon: Clock,
    title: 'Fast Delivery',
    description: 'Quick turnaround times without compromising on quality'
  },
  {
    icon: Users,
    title: 'Dedicated Team',
    description: 'Expert professionals committed to your success'
  },
  {
    icon: TrendingUp,
    title: 'Results-Driven',
    description: 'Data-backed strategies that deliver measurable results'
  },
  {
    icon: Shield,
    title: 'Reliable & Secure',
    description: 'Your data and projects are protected with industry-standard security'
  },
  {
    icon: Zap,
    title: 'Innovative Solutions',
    description: 'Cutting-edge technology and modern best practices'
  },
]

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Marrelay?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We combine expertise, innovation, and dedication to deliver exceptional results
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 rounded-xl hover:bg-primary-50 transition-colors duration-300"
              >
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {reason.title}
                </h3>
                <p className="text-gray-600">
                  {reason.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
