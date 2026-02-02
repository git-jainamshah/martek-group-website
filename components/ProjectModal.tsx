'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, ExternalLink, Calendar, DollarSign, PenTool } from 'lucide-react'
import { useEffect } from 'react'

interface ProjectModalProps {
    isOpen: boolean
    onClose: () => void
    project: any // Typing 'any' for flexibility with the mixed content types
}

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen])

    if (!isOpen || !project) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-background border border-border w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
                        >
                            {/* Header */}
                            <div className="border-b border-border p-6 flex justify-between items-start bg-muted/10 sticky top-0 z-10 backdrop-blur-md">
                                <div>
                                    <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">{project.category}</span>
                                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">{project.title}</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="overflow-y-auto p-6 md:p-10 custom-scrollbar">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                                    {/* Left Column: Details */}
                                    <div className="lg:col-span-2 space-y-8">
                                        {/* Metadata Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 p-6 rounded-xl border border-border/50">
                                            <div className="flex items-start space-x-3">
                                                <DollarSign className="w-5 h-5 text-primary mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-bold text-muted-foreground uppercase">Estimated Cost</p>
                                                    <p className="text-sm font-semibold text-foreground">{project.cost}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-bold text-muted-foreground uppercase">Timeline</p>
                                                    <p className="text-sm font-semibold text-foreground">{project.timeline}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold text-foreground">The Challenge</h3>
                                            <p className="text-muted-foreground leading-relaxed">{project.problem}</p>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold text-foreground">Our Solution</h3>
                                            <p className="text-muted-foreground leading-relaxed">{project.solution}</p>
                                        </div>

                                        {/* Visual Component Injection */}
                                        {project.visualComponent && (
                                            <div className="mt-8">
                                                <h3 className="text-xl font-bold text-foreground mb-4">Performance Metrics</h3>
                                                {project.visualComponent}
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column: Tools & Actions */}
                                    <div className="lg:col-span-1 space-y-8">
                                        {/* Tools */}
                                        <div className="bg-background border border-border p-6 rounded-xl shadow-sm">
                                            <h4 className="flex items-center space-x-2 font-bold text-foreground mb-4 border-b border-border pb-2">
                                                <PenTool className="w-4 h-4 text-primary" />
                                                <span>Tech Stack Used</span>
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tools.map((tool: string, i: number) => (
                                                    <span key={i} className="px-3 py-1 bg-muted text-xs font-medium text-muted-foreground rounded-full border border-border/50">
                                                        {tool}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="space-y-3">
                                            <button className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors">
                                                <Download className="w-4 h-4" />
                                                <span>Download Case Study</span>
                                            </button>
                                            <button className="w-full flex items-center justify-center space-x-2 bg-muted hover:bg-muted/80 text-foreground font-bold py-3 rounded-lg transition-colors border border-border">
                                                <ExternalLink className="w-4 h-4" />
                                                <span>View Interactive Demo</span>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}
