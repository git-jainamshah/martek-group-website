'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Home, FileText, Mail } from 'lucide-react'

export default function NotFound() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center p-6"
        >
            {/* Interactive Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            {/* Spotlight Effect */}
            <div
                className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
                }}
            />

            {/* Content Container */}
            <div className="relative z-10 max-w-4xl w-full text-center space-y-8">

                {/* Animated Glitch 404 */}
                <div className="relative inline-block">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-[12rem] md:text-[16rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 select-none"
                    >
                        404
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, times: [0, 0.1, 0.2] }}
                        className="absolute inset-0 text-[12rem] md:text-[16rem] font-bold leading-none tracking-tighter text-red-500/20 blur-[2px] select-none pointer-events-none"
                        style={{ left: '2px', top: '2px' }}
                    >
                        404
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity, times: [0.3, 0.4, 0.5] }}
                        className="absolute inset-0 text-[12rem] md:text-[16rem] font-bold leading-none tracking-tighter text-blue-500/20 blur-[2px] select-none pointer-events-none"
                        style={{ left: '-2px', top: '-2px' }}
                    >
                        404
                    </motion.div>
                </div>

                {/* Quirky Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="space-y-4"
                >
                    <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
                        Even better engineering <br className="hidden md:block" />
                        <span className="text-blue-400">sometimes hits a void.</span>
                    </h2>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
                        While you&apos;re lost, you should know we specialize in Digital Solutions & Engineering.
                        We usually build things that <span className="text-white font-medium italic">don&apos;t</span> break.
                    </p>
                </motion.div>

                {/* Recovery Options */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
                >
                    <Link href="/" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                        <Home className="w-5 h-5" />
                        <span>Return to Base</span>
                    </Link>

                    <Link href="/contact" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
                        <Mail className="w-5 h-5" />
                        <span>Report a Glitch</span>
                    </Link>
                </motion.div>

            </div>

            {/* Decorative Footer Element */}
            <div className="absolute bottom-8 text-white/20 text-sm font-mono tracking-widest">
                ERROR_CODE: PAGE_NOT_FOUND_EXCEPTION
            </div>
        </div>
    )
}
