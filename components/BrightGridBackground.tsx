'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'

export default function BrightGridBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let mouse = { x: 0, y: 0 }

        // Grid Configuration
        const gridSize = 40
        let points: Point[] = []

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initPoints()
        }

        class Point {
            x: number
            y: number
            originX: number
            originY: number
            color: string

            constructor(x: number, y: number) {
                this.x = x
                this.y = y
                this.originX = x
                this.originY = y

                // Randomly assign specialized colors occasionally
                const rand = Math.random()
                if (rand > 0.98) this.color = '#E4251F' // Martek Red
                else if (rand > 0.95) this.color = '#ffffff' // White
                else this.color = '#333333' // Dark Grey (default)
            }

            update() {
                // Mouse interaction
                const dx = mouse.x - this.x
                const dy = mouse.y - this.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                const forceDirectionX = dx / distance
                const forceDirectionY = dy / distance
                const maxDistance = 200 // Interaction radius
                const force = (maxDistance - distance) / maxDistance
                const directionX = forceDirectionX * force * 5
                const directionY = forceDirectionY * force * 5

                if (distance < maxDistance) {
                    this.x -= directionX
                    this.y -= directionY
                } else {
                    // Return to origin
                    if (this.x !== this.originX) {
                        this.x += (this.originX - this.x) * 0.05
                    }
                    if (this.y !== this.originY) {
                        this.y += (this.originY - this.y) * 0.05
                    }
                }
            }

            draw() {
                if (!ctx) return
                ctx.fillStyle = this.color
                ctx.beginPath()
                const size = this.color === '#E4251F' ? 2 : 1
                ctx.arc(this.x, this.y, size, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        const initPoints = () => {
            points = []
            for (let x = 0; x <= canvas.width; x += gridSize) {
                for (let y = 0; y <= canvas.height; y += gridSize) {
                    points.push(new Point(x, y))
                }
            }
        }

        const connectPoints = () => {
            // Only connect if really close, or create the grid lines?
            // Let's draw faint grid lines based on point positions to simulate a warped mesh
            // This is computationally expensive O(N^2) if naive, but since it's a grid, we can just draw lines between neighbors.
            // For performance, let's just stick to dot grid with mouse interaction for now to keep it lightweight.
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            points.forEach(point => {
                point.update()
                point.draw()
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            mouse.x = e.clientX - rect.left
            mouse.y = e.clientY - rect.top
        }

        window.addEventListener('resize', resize)
        window.addEventListener('mousemove', handleMouseMove)
        resize()
        animate()

        return () => {
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <div className="absolute inset-0 overflow-hidden bg-zinc-900">
            {/* Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none z-10" />
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0 opacity-50"
            />
        </div>
    )
}
