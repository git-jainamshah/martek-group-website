'use client'

import { motion } from 'framer-motion'

interface dataPoint {
    label: string
    value: number // 0-100
    color?: string
}

interface EfficiencyChartProps {
    data: dataPoint[]
    title: string
}

export default function EfficiencyChart({ data, title }: EfficiencyChartProps) {
    return (
        <div className="bg-background border border-border p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-6 text-foreground border-b border-border pb-2">{title}</h3>
            <div className="space-y-4">
                {data.map((item, index) => (
                    <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-muted-foreground">{item.label}</span>
                            <span className="font-bold text-foreground">{item.value}%</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${item.value}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                                className={`h-full rounded-full ${item.color || 'bg-primary'}`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
