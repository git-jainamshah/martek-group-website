'use client'

interface VideoBackgroundProps {
    src: string
    poster?: string
}

export default function VideoBackground({ src, poster }: VideoBackgroundProps) {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
            <video
                autoPlay
                loop
                muted
                playsInline
                poster={poster}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
            >
                <source src={src} type="video/mp4" />
            </video>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40 pointer-events-none" />
        </div>
    )
}
