'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface SpotlightRevealBackgroundProps {
    src: string
    alt?: string
    className?: string
}

export default function SpotlightRevealBackground({
    src,
    alt = "Background",
    className = ""
}: SpotlightRevealBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 z-0 overflow-hidden bg-black ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Base Grayscale Image */}
            <div className="absolute inset-0 filter grayscale contrast-125 brightness-50 z-0">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Reveal Layer (Color) */}
            <motion.div
                className="absolute inset-0 z-10"
                animate={{
                    WebkitMaskImage: isHovering
                        ? `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`
                        : `radial-gradient(circle 0px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`
                }}
                transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
                style={{
                    maskImage: `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
                    WebkitMaskImage: `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
                }}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover brightness-110 contrast-110"
                    priority
                />
            </motion.div>

            {/* Overlay Gradient for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none z-20" />
        </div>
    )
}
