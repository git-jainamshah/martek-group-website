"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle({ className }: { className?: string }) {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null // Avoid hydration mismatch
    }

    const isDark = theme === "dark"

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-all ${className}`}
            aria-label="Toggle theme"
        >
            <div className="relative w-5 h-5">
                <Sun className={`absolute inset-0 h-full w-full transition-all ${isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
                <Moon className={`absolute inset-0 h-full w-full transition-all ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} />
            </div>
            <span className="text-sm font-medium tracking-wide">
                {isDark ? "Dark Mode" : "Light Mode"}
            </span>
        </button>
    )
}
