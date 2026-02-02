'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'

interface FormData {
  name: string
  email: string
  phone?: string
  company?: string
  service: string
  budget?: string
  message: string
}

interface ContactFormProps {
  selectedPackage?: string
}

export default function ContactForm({ selectedPackage }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      // package: selectedPackage || '', // Removed package field for cleaner look
    },
  })

  // Subtle clean animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log('Form data:', data)
      setSubmitStatus('success')
      reset()
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-transparent"
    >
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">Send us a message</h3>
        <p className="text-muted-foreground font-light">
          Fill out the form below and one of our consultants will be in touch.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-green-500/10 border-l-4 border-green-500 text-green-700 dark:text-green-400"
          >
            <p className="font-semibold">Inquiry Received.</p>
            <p className="text-sm">We will review your request and respond shortly.</p>
          </motion.div>
        )}

        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-red-500/10 border-l-4 border-red-500 text-red-700 dark:text-red-400"
          >
            <p className="font-semibold">System Error.</p>
            <p className="text-sm">Please try again later or contact us directly.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              {...register('name', { required: 'Name is required' })}
              className="w-full bg-transparent border-b border-border py-2 text-foreground focus:outline-none focus:border-primary transition-colors rounded-none"
              placeholder="John Doe"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
              className="w-full bg-transparent border-b border-border py-2 text-foreground focus:outline-none focus:border-primary transition-colors rounded-none"
              placeholder="john@company.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              {...register('phone')}
              className="w-full bg-transparent border-b border-border py-2 text-foreground focus:outline-none focus:border-primary transition-colors rounded-none"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Company
            </label>
            <input
              type="text"
              id="company"
              {...register('company')}
              className="w-full bg-transparent border-b border-border py-2 text-foreground focus:outline-none focus:border-primary transition-colors rounded-none"
              placeholder="Company Ltd."
            />
          </div>
        </div>

        <div>
          <label htmlFor="service" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Service Required *
          </label>
          <select
            id="service"
            {...register('service', { required: 'Select a service' })}
            className="w-full bg-transparent border-b border-border py-2 text-foreground focus:outline-none focus:border-primary transition-colors rounded-none appearance-none cursor-pointer"
          >
            <option value="" className="bg-transparent text-muted-foreground">Select an option...</option>
            <option value="consulting" className="bg-background">Strategic Consulting</option>
            <option value="development" className="bg-background">Software Development</option>
            <option value="analytics" className="bg-background">Data Analytics</option>
            <option value="engineering" className="bg-background">Technical Engineering</option>
            <option value="marketing" className="bg-background">Digital Growth</option>
          </select>
          {errors.service && <p className="mt-1 text-xs text-red-500">{errors.service.message}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Brief *
          </label>
          <textarea
            id="message"
            rows={3}
            {...register('message', { required: 'Message is required' })}
            className="w-full bg-transparent border-b border-border py-2 text-foreground focus:outline-none focus:border-primary transition-colors rounded-none resize-none"
            placeholder="Tell us about your project requirements..."
          />
          {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-xs hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'Submit Inquiry'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
