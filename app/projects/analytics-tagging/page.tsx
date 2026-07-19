'use client'

import PageHero from '@/components/PageHero'
import VideoBackground from '@/components/VideoBackground'
import PresentationStats from '@/components/PresentationStats'
import Link from 'next/link'
import { ArrowLeft, Download, PlayCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AnalyticsTaggingPage() {
    const stats = [
        { label: "Data Accuracy", value: "99.8%", subtext: "vs 85% industry avg" },
        { label: "Cost Savings", value: "40%", subtext: "Annual SaaS spend" },
        { label: "Implementation", value: "4 Wks", subtext: "From audit to live" },
        { label: "ROI", value: "12x", subtext: "First quarter return" }
    ]

    return (
        <div className="bg-background min-h-screen pb-24">
            <div className="relative overflow-hidden">
                <PageHero
                    title="Analytics & Tagging"
                    subtitle="SAMPLE CASE STUDY REPORT"
                    backgroundComponent={<VideoBackground src="/assets/analytics-bg.mp4" />}
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
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Data-Driven Strategy</h1>
                            <p className="text-xl text-muted-foreground mt-2">Tagging Architecture for Enterprise Retail</p>
                        </div>
                        <div className="flex gap-4 mt-6 md:mt-0">
                            <button className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
                                <Download className="w-4 h-4" /> <span>Download Raw Data</span>
                            </button>
                            <button className="flex items-center space-x-2 bg-muted text-foreground px-4 py-2 rounded-lg text-sm font-bold hover:bg-muted/80 transition-colors">
                                <PlayCircle className="w-4 h-4" /> <span>Watch Demo</span>
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
                                The client was flying blind. Despite having Google Analytics 4 installed, data discrepancies between their CRM and web tracking were exceeding 25%. They had no visibility into user drop-off points and were spending $50k/month on ads with unverified conversions.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mb-6 text-base">
                                <li>Broken GTM Triggers</li>
                                <li>Non-compliant Cookie Consent</li>
                                <li>Zero Server-Side Tracking</li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-foreground font-bold text-2xl mb-4">The Solution</h3>
                            <p className="mb-6">
                                We re-architected their entire tagging infrastructure. Moving from client-side chaos to a clean Server-Side GTM setup ensured data accuracy and privacy compliance. We enriched the data layer with custom events, allowing for precise user journey mapping.
                            </p>
                            <div className="bg-muted/30 p-6 rounded-lg border-l-4 border-primary">
                                <p className="text-foreground font-medium italic">
                                    &quot;The clarity we gained after the first week of data collection completely changed our Q4 strategy.&quot;
                                </p>
                                <p className="text-sm mt-4 font-bold uppercase text-primary">- Marketing Director</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
