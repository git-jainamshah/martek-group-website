'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle } from 'lucide-react'

interface ProjectPhase {
    title: string
    duration: string
    status: 'completed' | 'in-progress' | 'upcoming'
    description: string
}

interface ProjectTimelineProps {
    phases: ProjectPhase[]
}

export default function ProjectTimeline({ phases }: ProjectTimelineProps) {
    return (
        <div className="relative border-l-2 border-border ml-3 my-8 space-y-8">
            {phases.map((phase, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative pl-8"
                >
                    <div className="absolute -left-[9px] top-1 bg-background">
                        {phase.status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                        ) : phase.status === 'in-progress' ? (
                            <div className="w-4 h-4 rounded-full border-2 border-primary bg-background animate-pulse" />
                        ) : (
                            <Circle className="w-4 h-4 text-muted-foreground" />
                        )}
                    </div>

                    <div className="bg-muted/10 p-5 rounded-lg border border-border">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-lg text-foreground">{phase.title}</h4>
                            <span className="text-xs font-mono bg-border/50 px-2 py-1 rounded text-muted-foreground">
                                {phase.duration}
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm font-light leading-relaxed">
                            {phase.description}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
