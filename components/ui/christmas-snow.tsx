"use client"

import { useEffect, useState } from "react"

export default function ChristmasSnow() {
    const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: number; duration: number; delay: number }>>([])

    useEffect(() => {
        const flakes = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100, // percentage
            duration: Math.random() * 5 + 5, // 5-10s
            delay: Math.random() * 5, // 0-5s
        }))
        setSnowflakes(flakes)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="absolute top-0 w-2 h-2 bg-white rounded-full opacity-60 animate-fall"
                    style={{
                        left: `${flake.left}%`,
                        animationDuration: `${flake.duration}s`,
                        animationDelay: `${flake.delay}s`,
                    }}
                />
            ))}
            <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(-10px) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) translateX(20px);
            opacity: 0;
          }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
        </div>
    )
}
