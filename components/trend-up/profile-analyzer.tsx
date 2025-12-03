"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Users, Zap, DollarSign, Loader2 } from "lucide-react"

interface InstagramProfile {
    username: string
    fullName: string
    profilePicUrl: string
    followers: number
    following: number
    isVerified: boolean
    posts: number
}

type Goal = "followers" | "viral" | "monetize"

export default function ProfileAnalyzer() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState<InstagramProfile | null>(null)
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
    const [error, setError] = useState("")

    const goals = [
        {
            id: "followers" as Goal,
            icon: Users,
            title: "Ganar Seguidores",
            description: "Crece con seguidores reales y comprometidos",
            color: "orange",
            recommended: false
        },
        {
            id: "viral" as Goal,
            icon: Zap,
            title: "Go Viral en Instagram",
            description: "Aumenta tu alcance y visibilidad exponencialmente",
            color: "pink",
            recommended: true
        },
        {
            id: "monetize" as Goal,
            icon: DollarSign,
            title: "Add Instagram Brand Sponsorships",
            description: "Monetiza tu contenido y trabaja con marcas",
            color: "green",
            recommended: false
        }
    ]

    const handleLoadProfile = async () => {
        if (!username.trim()) {
            setError("Por favor ingresa un nombre de usuario")
            return
        }

        setLoading(true)
        setError("")

        try {
            const response = await fetch(`/api/instagram/profile?username=${encodeURIComponent(username)}`)

            if (!response.ok) {
                throw new Error("No se pudo cargar el perfil")
            }

            const data = await response.json()
            setProfile(data)
        } catch (err) {
            setError("No se pudo cargar el perfil. Verifica el nombre de usuario.")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleContinue = () => {
        if (!profile || !selectedGoal) return

        // Redirect to pricing page with pre-filled data
        const params = new URLSearchParams({
            username: profile.username,
            goal: selectedGoal,
            followers: profile.followers.toString()
        })

        window.location.href = `/pricing?${params.toString()}`
    }

    return (
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                            <span className="text-orange-500">Skyrocket</span> Your Social Media <br />
                            Growth And Go <span className="text-orange-500">Viral</span> 🚀
                        </h2>
                        <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <span key={i} className="text-yellow-400">★</span>
                                ))}
                            </div>
                            <span>4.9/5</span>
                            <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                23,684 reviews
                            </span>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                        {!profile ? (
                            <>
                                {/* Input Section */}
                                <div className="mb-6">
                                    <h3 className="font-bold text-xl text-slate-900 mb-4">
                                        Grow with Trend Up
                                    </h3>
                                    <p className="text-slate-600 text-sm mb-4">
                                        Enter your Instagram to get started
                                    </p>

                                    <div className="space-y-3">
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                                                @
                                            </span>
                                            <Input
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder="tuusuariodeinstagram"
                                                className="pl-8 h-12 rounded-xl border-slate-200 focus:border-orange-500"
                                                onKeyDown={(e) => e.key === "Enter" && handleLoadProfile()}
                                            />
                                        </div>

                                        <Button
                                            onClick={handleLoadProfile}
                                            disabled={loading || !username}
                                            className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 rounded-xl font-bold disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                "Continuar →"
                                            )}
                                        </Button>
                                    </div>

                                    {error && (
                                        <p className="text-red-500 text-sm mt-2">{error}</p>
                                    )}
                                </div>

                                {/* Trust Badges */}
                                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100">
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">✓</div>
                                        <p className="text-xs text-slate-600">Organic Growth</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">⚡</div>
                                        <p className="text-xs text-slate-600">100% Safe & Secure</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">🎯</div>
                                        <p className="text-xs text-slate-600">Results in 24-48 Hours</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Profile Display */}
                                <div className="mb-6 pb-6 border-b border-slate-100">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="relative">
                                            <img
                                                src={profile.profilePicUrl}
                                                alt={profile.username}
                                                className="w-16 h-16 rounded-full border-2 border-orange-500"
                                            />
                                            {profile.isVerified && (
                                                <CheckCircle2 className="absolute -bottom-1 -right-1 w-5 h-5 text-blue-500 fill-blue-500 bg-white rounded-full" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-lg text-slate-900">
                                                    @{profile.username}
                                                </h4>
                                                <Button
                                                    size="sm"
                                                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 h-auto rounded-lg"
                                                >
                                                    Analyze Profile
                                                </Button>
                                            </div>
                                            <p className="text-sm text-slate-600">{profile.fullName}</p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                                <span><strong className="text-slate-900">{profile.followers.toLocaleString()}</strong> followers</span>
                                                <span><strong className="text-slate-900">{profile.following.toLocaleString()}</strong> following</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Goal Selection */}
                                <div className="mb-6">
                                    <h4 className="font-bold text-slate-900 mb-4">
                                        What are you looking to achieve?
                                    </h4>
                                    <p className="text-sm text-slate-600 mb-4">
                                        Select a goal and we'll show you the best way to get there
                                    </p>

                                    <div className="space-y-3">
                                        {goals.map((goal) => (
                                            <button
                                                key={goal.id}
                                                onClick={() => setSelectedGoal(goal.id)}
                                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedGoal === goal.id
                                                    ? "border-orange-500 bg-orange-50"
                                                    : "border-slate-200 hover:border-slate-300"
                                                    } ${goal.recommended ? "relative" : ""}`}
                                            >
                                                {goal.recommended && (
                                                    <div className="absolute -top-2 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                        RECOMMENDED
                                                    </div>
                                                )}
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${goal.color === "orange" ? "bg-orange-100" :
                                                        goal.color === "pink" ? "bg-pink-100" :
                                                            "bg-green-100"
                                                        }`}>
                                                        <goal.icon className={`w-5 h-5 ${goal.color === "orange" ? "text-orange-600" :
                                                            goal.color === "pink" ? "text-pink-600" :
                                                                "text-green-600"
                                                            }`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h5 className="font-bold text-slate-900 mb-1">{goal.title}</h5>
                                                        <p className="text-sm text-slate-600">{goal.description}</p>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGoal === goal.id
                                                        ? "border-orange-500 bg-orange-500"
                                                        : "border-slate-300"
                                                        }`}>
                                                        {selectedGoal === goal.id && (
                                                            <div className="w-2 h-2 bg-white rounded-full" />
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Continue Button */}
                                <Button
                                    onClick={handleContinue}
                                    disabled={!selectedGoal}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white h-14 rounded-xl text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Continue to Growth Plan →
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
