'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface ProjectCardProps {
    title: string
    category: string
    description: string
    description: string
    gradient: string
    delay: number
    href: string
}

export default function ProjectCard({ title, category, description, gradient, delay, href }: ProjectCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="group relative h-auto min-h-[350px] rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300"
        >
            {/* Background Graphic */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-80 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100`} />

            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-end p-8 z-10 text-white">
                <div className="transform transition-transform duration-500">
                    <span className="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase tracking-widest bg-white/20 backdrop-blur-sm rounded-full border border-white/10">
                        {category}
                    </span>

                    <h3 className="text-3xl font-bold mb-4 leading-tight group-hover:text-yellow-300 transition-colors duration-300">
                        {title}
                    </h3>

                    <p className="text-white/80 mb-6 font-light leading-relaxed line-clamp-3 group-hover:line-clamp-none group-hover:text-white transition-colors">
                        {description}
                    </p>

                    <Link
                        href={href}
                        className="inline-flex items-center space-x-2 text-sm font-bold uppercase tracking-widest hover:text-yellow-300 transition-colors"
                    >
                        <span>View Sample Project</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
