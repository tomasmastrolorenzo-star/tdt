"use client"

import { useEffect, useState } from "react"

export default function ChristmasSnow() {
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: number; duration: number; delay: number }>>([])

  useEffect(() => {
    const flakes = Array.from({ length: 75 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      duration: Math.random() * 10 + 10, // 10-20s (smoother)
      delay: Math.random() * 10, // 0-10s
      size: Math.random() * 3 + 1, // 1-4px
      opacity: Math.random() * 0.5 + 0.3, // 0.3-0.8
    }))
    setSnowflakes(flakes)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-screen pointer-events-none z-50 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute top-[-10px] bg-white rounded-full animate-fall filter blur-[0.5px]"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
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
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(110vh) translateX(50px);
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
