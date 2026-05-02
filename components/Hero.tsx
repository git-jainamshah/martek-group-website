'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

/** Local path works in dev if the file exists; production usually needs NEXT_PUBLIC_HERO_VIDEO_URL (see .gitignore on public/assets/*.mp4). */
const heroVideoSrc =
  process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim() || '/assets/homepage-banner-bg.mp4'

export default function Hero() {
  return (
    <section className="relative h-[75vh] min-h-[500px] flex items-center overflow-hidden">
      {/* Video/Image Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={heroVideoSrc} type="video/mp4" />
        </video>
        {/* Darker overlay for professional contrast */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content - Left Aligned & Professional */}
      <div className="container-custom section-padding relative z-10 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight tracking-tight font-bold">
              Engineering <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400">
                Digital Excellence.
              </span>
            </h1>

            <p className="text-base md:text-xl text-gray-300 mb-8 max-w-xl font-light leading-relaxed">
              We transform complex business challenges into elegant digital solutions.
              Your partner for <span className="text-white font-medium underline decoration-dotted decoration-gray-400 underline-offset-4">growth</span>, <span className="text-white font-medium underline decoration-dotted decoration-gray-400 underline-offset-4">innovation</span>, and <span className="text-white font-medium underline decoration-dotted decoration-gray-400 underline-offset-4">scale</span>.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link
                href="/contact"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-10 rounded-full transition-all duration-300 text-sm tracking-widest uppercase shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
              >
                Get Free Quote Now
              </Link>
              <Link
                href="/services"
                className="bg-white/5 backdrop-blur-md border border-white/20 hover:bg-white hover:text-black text-white font-bold py-4 px-10 rounded-full transition-all duration-300 text-sm tracking-widest uppercase hover:-translate-y-1"
              >
                Our Capabilities
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}