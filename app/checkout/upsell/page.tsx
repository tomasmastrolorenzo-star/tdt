"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, CheckCircle, Timer } from "lucide-react"

// Confetti Piece Component
const ConfettiPiece = ({ delay }: { delay: number }) => {
    const randomColor = ["#FF4D4F", "#52C41A", "#1890FF", "#FAAD14", "#FADB14"][Math.floor(Math.random() * 5)]
    const randomLeft = Math.floor(Math.random() * 100)

    return (
        <motion.div
            initial={{ y: -20, opacity: 0, rotate: 0 }}
            animate={{
                y: ["0vh", "100vh"],
                opacity: [1, 1, 0],
                rotate: [0, 360],
                x: [0, Math.random() * 100 - 50]
            }}
            transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: delay,
                ease: "linear"
            }}
            style={{
                left: `${randomLeft}%`,
                background: randomColor
            }}
            className="absolute top-0 w-3 h-3 rounded-sm pointer-events-none opacity-80"
        />
    )
}

function UpsellContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [timeLeft, setTimeLeft] = useState(300) // 5 minutes timer
    const email = searchParams.get("email")
    const orderId = searchParams.get("order_id")

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s < 10 ? '0' : ''}${s}`
    }

    const handleAccept = () => {
        // In a real app, this would trigger an API call to upgrade order
        // For simulation, we pretend logic happened and go to success
        router.push(`/checkout/success?order_id=${orderId}&email=${email}&upgraded=true`)
    }

    const handleReject = () => {
        router.push(`/checkout/success?order_id=${orderId}&email=${email}`)
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex items-center justify-center p-4">
            {/* Digital Confetti Background */}
            <div className="absolute inset-0 z-0">
                {Array.from({ length: 30 }).map((_, i) => (
                    <ConfettiPiece key={i} delay={Math.random() * 5} />
                ))}
            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-10 max-w-lg w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 md:p-12 shadow-2xl text-center"
            >
                {/* Timer Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg animate-pulse">
                    <Timer className="w-4 h-4" />
                    Offer Expires in {formatTime(timeLeft)}
                </div>

                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
                        Wait! <span className="text-red-500">Do not close this page...</span>
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Our AI suggests boosting your order to maximize retention.
                    </p>
                </div>

                {/* The Offer Card */}
                <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-2xl p-6 mb-8 relative group">
                    <div className="absolute inset-0 bg-indigo-500/10 blur-xl group-hover:bg-indigo-500/20 transition-all rounded-2xl"></div>
                    <div className="relative z-10">
                        <div className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-2">Exclusive AI Offer</div>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Get <span className="text-green-400">DOUBLE</span> the Followers for only <span className="text-green-400">50%</span> of the cost?
                        </h2>
                        <ul className="text-left space-y-3 mb-0 inline-block mx-auto">
                            <li className="flex items-center gap-2 text-slate-300">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span>Faster Delivery Speed</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-300">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span>Premium Quality Profiles</span>
                            </li>
                            <li className="flex items-center gap-2 text-slate-300">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span>Risk-Free 90 Day Guarantee</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <Button
                        onClick={handleAccept}
                        className="w-full bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-6 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-shimmer bg-[linear-gradient(110deg,#22c55e,45%,#4ade80,55%,#22c55e)] bg-[length:200%_100%] transition-transform hover:scale-105"
                    >
                        Yes, Upgrade My Order Instantly
                    </Button>

                    <button
                        onClick={handleReject}
                        className="text-slate-500 hover:text-slate-400 text-sm font-medium underline decoration-slate-700 underline-offset-4 transition-colors"
                    >
                        No thanks, I'll keep my small growth
                    </button>
                </div>

                {/* Trust */}
                <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Sparkles className="w-3 h-3 text-yellow-500" />
                    <span>Special offer just for you</span>
                </div>
            </motion.div>
        </main>
    )
}

export default function UpsellPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading offer...</div>}>
            <UpsellContent />
        </Suspense>
    )
}
