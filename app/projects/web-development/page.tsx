'use client'

import PageHero from '@/components/PageHero'
import VideoBackground from '@/components/VideoBackground'
import PresentationStats from '@/components/PresentationStats'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, MonitorPlay } from 'lucide-react'
import { motion } from 'framer-motion'

export default function WebDevelopmentPage() {
    const stats = [
        { label: "Load Time", value: "0.8s", subtext: "Down from 4.5s" },
        { label: "Conversion", value: "+150%", subtext: "Post-launch uplift" },
        { label: "Scalability", value: "Autoscale", subtext: "Handles 50k+ users" },
        { label: "Uptime", value: "100%", subtext: "During peak traffic" }
    ]

    return (
        <div className="bg-background min-h-screen pb-24">
            <div className="relative overflow-hidden">
                <PageHero
                    title="Web Development"
                    subtitle="SAMPLE CASE STUDY REPORT"
                    backgroundComponent={<VideoBackground src="/assets/web-dev-bg.mp4" />}
                    className="h-[55vh] min-h-[400px]"
                />
            </div>

            <div className="container-custom -mt-20 relative z-10 px-4 sm:px-6 lg:px-8">
                <div className="bg-background border border-border shadow-2xl rounded-2xl p-8 md:p-12">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-border pb-8">
                        <div>
                            <Link href="/case-studies" className="inline-flex items-center text-muted-foreground hover:text-primary text-sm font-bold uppercase tracking-widest mb-4">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Showcase
                            </Link>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Scalable Brand Ecosystem</h1>
                            <p className="text-xl text-muted-foreground mt-2">Full Stack Rebranding & Digital Transformation</p>
                        </div>
                        <div className="flex gap-4 mt-6 md:mt-0">
                            <button className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
                                <ExternalLink className="w-4 h-4" /> <span>Visit Live Site</span>
                            </button>
                            <button className="flex items-center space-x-2 bg-muted text-foreground px-4 py-2 rounded-lg text-sm font-bold hover:bg-muted/80 transition-colors">
                                <MonitorPlay className="w-4 h-4" /> <span>System Demo</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <PresentationStats stats={stats} />

                    {/* Content Body */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-lg leading-relaxed text-muted-foreground">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-foreground font-bold text-2xl mb-4">The Challenge</h3>
                            <p className="mb-6">
                                A rapidly growing startup was being held back by a WordPress template that couldn't keep up. Their site crashed during marketing pushes, the design felt generic, and mobile responsiveness was non-existent. They needed a platform that projected "Market Leader" authority.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mb-6 text-base">
                                <li>High Bounce Rate (70%+)</li>
                                <li>Slow Mobile Performance</li>
                                <li>Difficult Content Management</li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-foreground font-bold text-2xl mb-4">The Solution</h3>
                            <p className="mb-6">
                                We deployed a custom Next.js application hosted on Vercel edge networks. By decoupling the frontend from the CMS (Sanity.io), we gave the marketing team total freedom while maintaining elite-level performance. The new design system is modular, allowing them to spin up new landing pages in minutes, not days.
                            </p>
                            <div className="bg-muted/30 p-6 rounded-lg border-l-4 border-primary">
                                <p className="text-foreground font-medium italic">
                                    "Our site went from being a liability to our strongest sales asset. The speed is incredible."
                                </p>
                                <p className="text-sm mt-4 font-bold uppercase text-primary">— Founder & CEO</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
