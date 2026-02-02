'use client'

import React, { useState, useEffect } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'

export default function AnimatedGridBackground() {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const [mounted, setMounted] = useState(false)

    // Use fixed positions for crosshairs to avoid hydration mismatch
    const crosshairs = [
        { left: '10%', top: '20%' },
        { left: '80%', top: '15%' },
        { left: '50%', top: '50%' },
        { left: '20%', top: '70%' },
        { left: '70%', top: '80%' },
        { left: '90%', top: '40%' },
        { left: '15%', top: '40%' },
        { left: '35%', top: '85%' },
    ]

    useEffect(() => {
        setMounted(true)
    }, [])

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect()
        mouseX.set(clientX - left)
        mouseY.set(clientY - top)
    }

    return (
        <div
            className="absolute inset-0 z-0 bg-[#1A1A1A] overflow-hidden"
            onMouseMove={handleMouseMove}
        >
            {/* 1. Base Grid Pattern */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"
            ></div>

            {/* 2. Interactive Spotlight Radar */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(228, 37, 31, 0.08),
              transparent 80%
            )
          `,
                }}
            />

            {/* 3. Horizontal & Vertical Scanning Lines (Radar Sweep) */}
            <motion.div
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent w-full opacity-50"
            />
            <motion.div
                animate={{ left: ['0%', '100%'] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-primary/30 to-transparent h-full opacity-50"
            />

            {/* 4. Schematic Crosshairs (+) */}
            {mounted && crosshairs.map((pos, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                    className="absolute w-3 h-3 flex items-center justify-center text-gray-600/30"
                    style={{ left: pos.left, top: pos.top }}
                >
                    <div className="absolute w-full h-[1px] bg-current"></div>
                    <div className="absolute h-full w-[1px] bg-current"></div>
                </motion.div>
            ))}

            {/* 5. Moving "Data Packets" along grid lines */}
            {/* Horizontal packet */}
            <motion.div
                animate={{ left: ['-10%', '110%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }}
                className="absolute top-[30%] h-[2px] w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-[1px]"
            />
            {/* Vertical packet */}
            <motion.div
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear", delay: 0 }}
                className="absolute left-[60%] w-[2px] h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent blur-[1px]"
            />

            {/* 6. Ambient Gradient Overlay for Depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] via-transparent to-[#1A1A1A] pointer-events-none"></div>
        </div>
    )
}
