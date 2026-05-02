'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Johnson',
    company: 'TechStart Inc.',
    role: 'CEO',
    content: 'Martek Group transformed our online presence. Our website traffic increased by 300% within 3 months!',
    rating: 5,
    service: 'Web Development & SEO'
  },
  {
    name: 'Michael Chen',
    company: 'Global Solutions',
    role: 'Marketing Director',
    content: 'The social media strategy they developed for us resulted in a 250% increase in engagement. Outstanding work!',
    rating: 5,
    service: 'Social Media Marketing'
  },
  {
    name: 'Emily Rodriguez',
    company: 'BuildRight Engineering',
    role: 'Project Manager',
    content: 'Professional engineering drawings delivered on time. Their attention to detail is exceptional.',
    rating: 5,
    service: 'Engineering Drawings'
  },
]

export default function Testimonials() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don&apos;t just take our word for it - hear from businesses we&apos;ve helped succeed
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative"
            >
              <Quote className="w-12 h-12 text-primary-200 absolute top-6 right-6" />
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed relative z-10">
                &quot;{testimonial.content}&quot;
              </p>

              <div className="border-t border-gray-100 pt-6">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                <p className="text-xs text-primary-600 mt-2">{testimonial.service}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
