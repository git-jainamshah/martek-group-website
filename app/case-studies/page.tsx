'use client'

import PageHero from '@/components/PageHero'
import SpotlightRevealBackground from '@/components/SpotlightRevealBackground'
import ProjectCard from '@/components/ProjectCard'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CaseStudiesPage() {
    const projects = [
        {
            category: "Data & Strategy",
            title: "Analytics & Tagging Architecture",
            description: "We helped a brand uplift their digital performance by integrating advanced analytics. By tracking granular user behavior, we unlocked data-driven insights that directly encouraged on-site conversions.",
            gradient: "from-blue-600 via-indigo-700 to-purple-800",
            href: "/projects/analytics-tagging"
        },
        {
            category: "Digital Transformation",
            title: "Web Development & Brand Uplifting",
            description: "We guided a business from zero to a dominant online presence. Our comprehensive brand redevelopment wasn't just about looking good-it was engineered to be a scalable foundation.",
            gradient: "from-emerald-600 via-teal-700 to-cyan-800",
            href: "/projects/web-development"
        },
        {
            category: "Engineering Design",
            title: "CAD/CAM Professional Drawings",
            description: "Helping small-scale manufacturers compete with professional engineering designs. We provide precise CAD/CAM solutions that streamline production and minimize errors.",
            gradient: "from-orange-600 via-red-700 to-pink-800",
            href: "/projects/engineering-drawings"
        }
    ]

    return (
        <div className="bg-background min-h-screen transition-colors duration-300">
            <PageHero
                title="Sample Projects"
                subtitle="Explore examples of how we apply engineering precision to solve real-world challenges."
                backgroundComponent={<SpotlightRevealBackground src="/assets/sample-project-bg.jpg" />}
            />

            {/* Intro Section */}
            <section className="section-padding !pt-12 md:!pt-16 bg-background pb-0">
                <div className="container-custom text-center max-w-4xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6 text-foreground tracking-tight"
                    >
                        Project <span className="text-primary">Showcase</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground leading-relaxed font-light"
                    >
                        These samples illustrate our approach to complex problems. Whether it&apos;s optimizing user behavior with data or engineering physical products, we demonstrate how we can scale your vision.
                    </motion.p>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="section-padding pt-0 bg-background">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <ProjectCard
                                key={index}
                                {...project}
                                delay={index * 0.1}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-primary text-white">
                <div className="container-custom text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                        Ready to start your project?
                    </h2>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
                        Let&apos;s discuss how we can engineer a custom solution for your goals.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center space-x-2 bg-white text-primary px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-gray-100 transition-all hover:-translate-y-1 shadow-xl"
                    >
                        <span>Start Conversation</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    )
}
