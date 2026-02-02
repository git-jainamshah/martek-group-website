'use client'

import { motion } from 'framer-motion'

interface StatProps {
    label: string
    value: string
    subtext?: string
    delay?: number
}

function StatCard({ label, value, subtext, delay = 0 }: StatProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="bg-muted/30 border border-border/50 p-6 rounded-xl"
        >
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{value}</div>
            <div className="text-sm font-bold uppercase tracking-widest text-foreground mb-1">{label}</div>
            {subtext && <div className="text-xs text-muted-foreground">{subtext}</div>}
        </motion.div>
    )
}

interface PresentationStatsProps {
    stats: Omit<StatProps, 'delay'>[]
}

export default function PresentationStats({ stats }: PresentationStatsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} delay={index * 0.1} />
            ))}
        </div>
    )
}
