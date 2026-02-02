'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface PageHeroProps {
    title: string
    subtitle: string
    backgroundImage?: string
    backgroundComponent?: React.ReactNode
    className?: string
    children?: React.ReactNode
}

export default function PageHero({
    title,
    subtitle,
    backgroundImage = '/assets/office-dark-hero.png',
    backgroundComponent,
    className = "h-[60vh] min-h-[400px]",
    children
}: PageHeroProps) {
    return (
        <section className={`relative flex items-center justify-center overflow-hidden group ${className}`}>
            {/* Background Layer */}
            {backgroundComponent ? (
                backgroundComponent
            ) : (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={backgroundImage}
                        alt={title}
                        fill
                        className="object-cover object-center"
                        priority
                        quality={90}
                    />
                    {/* Cinematic Dark Overlay */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40"></div>
                </div>
            )}

            {/* Content */}
            <div className="container-custom relative z-10 text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white tracking-tight leading-tight">
                        {title}
                    </h1>
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "100px" }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="h-1 bg-primary mx-auto mb-8 rounded-full"
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed font-light"
                    >
                        {subtitle}
                    </motion.p>
                </motion.div>
            </div>

            {/* Optional Children (e.g., scroll indicators) */}
            {children}
        </section>
    )
}
