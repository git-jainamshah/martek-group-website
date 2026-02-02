'use client'

import PageHero from '@/components/PageHero'
import VideoBackground from '@/components/VideoBackground'
import PresentationStats from '@/components/PresentationStats'
import Link from 'next/link'
import { ArrowLeft, Download, Component } from 'lucide-react'
import { motion } from 'framer-motion'

export default function EngineeringDrawingsPage() {
    const stats = [
        { label: "Precision", value: "±0.01mm", subtext: "Tolerance achieved" },
        { label: "Efficiency", value: "3x Faster", subtext: "Production speed" },
        { label: "Errors", value: "0%", subtext: "Defect rate post-design" },
        { label: "Cost", value: "-25%", subtext: "Material waste reduction" }
    ]

    return (
        <div className="bg-background min-h-screen pb-24">
            <div className="relative overflow-hidden">
                <PageHero
                    title="Engineering Design"
                    subtitle="SAMPLE CASE STUDY REPORT"
                    backgroundComponent={<VideoBackground src="/assets/engineering-drawings-bg.mp4" />}
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
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground">CAD/CAM Precision</h1>
                            <p className="text-xl text-muted-foreground mt-2">Professional Modeling for Small-Scale Manufacturing</p>
                        </div>
                        <div className="flex gap-4 mt-6 md:mt-0">
                            <button className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
                                <Download className="w-4 h-4" /> <span>Download Schematics</span>
                            </button>
                            <button className="flex items-center space-x-2 bg-muted text-foreground px-4 py-2 rounded-lg text-sm font-bold hover:bg-muted/80 transition-colors">
                                <Component className="w-4 h-4" /> <span>View 3D Model</span>
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
                                A boutique hardware manufacturer was facing high rejection rates due to inconsistent manual drawings. They needed to move to professional CAD/CAM workflows to scale production but lacked the in-house engineering expertise to create the necessary 3D models and toolpaths.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mb-6 text-base">
                                <li>High Material Wastage</li>
                                <li>Inconsistent Part Fitment</li>
                                <li>Production Bottlenecks</li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-foreground font-bold text-2xl mb-4">The Solution</h3>
                            <p className="mb-6">
                                We provided a complete digital engineering package. From 3D scanning existing parts to creating production-ready CAD files and optimizing CAM toolpaths. We essentially acted as their on-demand engineering department, enabling them to use CNC machinery with full confidence.
                            </p>
                            <div className="bg-muted/30 p-6 rounded-lg border-l-4 border-primary">
                                <p className="text-foreground font-medium italic">
                                    "Martek gave us the engineering rigor of a large factory without the overhead. We are now shipping globally."
                                </p>
                                <p className="text-sm mt-4 font-bold uppercase text-primary">— Operations Manager</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
