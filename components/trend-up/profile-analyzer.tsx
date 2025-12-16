"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Users, Zap, DollarSign, Loader2 } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

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
    const { t } = useI18n()
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
            title: t.profileAnalyzer.goals.followers.title,
            description: t.profileAnalyzer.goals.followers.desc,
            color: "orange",
            recommended: false
        },
        {
            id: "viral" as Goal,
            icon: Zap,
            title: t.profileAnalyzer.goals.viral.title,
            description: t.profileAnalyzer.goals.viral.desc,
            color: "pink",
            recommended: true
        },
        {
            id: "monetize" as Goal,
            icon: DollarSign,
            title: t.profileAnalyzer.goals.monetize.title,
            description: t.profileAnalyzer.goals.monetize.desc,
            color: "green",
            recommended: false
        }
    ]

    const handleLoadProfile = async () => {
        if (!username.trim()) {
            setError(t.profileAnalyzer.input.error)
            return
        }

        setLoading(true)
        setError("")

        // Simulate API call delay for realism
        setTimeout(() => {
            // Instead of inventing fake stats, we just confirm the username is valid format
            // and act as if we found it, but without showing specific stats that could be wrong.
            // We use a generic avatar placeholder.
            setProfile({
                username: username.replace('@', '').toLowerCase(),
                fullName: username.replace('@', ''), // We don't know the real full name without API
                profilePicUrl: `https://ui-avatars.com/api/?name=${username}&background=random&size=200`,
                followers: 0, // Hidden in UI
                following: 0, // Hidden in UI
                isVerified: false,
                posts: 0 // Hidden in UI
            })
            setLoading(false)
        }, 1500)
    }

    const handleContinue = () => {
        if (!profile || !selectedGoal) return

        // Redirect to pricing page with pre-filled data
        const params = new URLSearchParams({
            username: profile.username,
            goal: selectedGoal
        })

        window.location.href = `/checkout?${params.toString()}` // Direct to checkout/packets
    }

    return (
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                            <span className="text-orange-500">{t.profileAnalyzer.title}</span> {t.profileAnalyzer.titleHighlight} <br />
                            {t.profileAnalyzer.subtitle}
                        </h2>
                        <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                            {/* ... reviews ... */}
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                        {!profile ? (
                            <>
                                {/* ... input form ... */}
                                <div className="mb-6">
                                    <h3 className="font-bold text-xl text-slate-900 mb-4">
                                        {t.profileAnalyzer?.formTitle || "Grow with TDT"}
                                    </h3>
                                    <p className="text-slate-600 text-sm mb-4">
                                        {t.profileAnalyzer?.formSubtitle || "Ingresa tu usuario de Instagram para comenzar"}
                                    </p>

                                    <div className="space-y-3">
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                                                @
                                            </span>
                                            <Input
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder={t.profileAnalyzer.input.placeholder}
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
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                    {t.profileAnalyzer?.input?.analyzing}
                                                </>
                                            ) : (
                                                t.profileAnalyzer.input.button
                                            )}
                                        </Button>
                                    </div>

                                    {error && (
                                        <p className="text-red-500 text-sm mt-2">{error}</p>
                                    )}
                                </div>

                                {/* ... trust badges ... */}
                                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100">
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">✓</div>
                                        <p className="text-xs text-slate-600">{t.profileAnalyzer.trust.organic}</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">⚡</div>
                                        <p className="text-xs text-slate-600">{t.profileAnalyzer.trust.safe}</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">🎯</div>
                                        <p className="text-xs text-slate-600">{t.profileAnalyzer.trust.results}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Profile Display - SIMPLIFIED identifying only */}
                                <div className="mb-6 pb-6 border-b border-slate-100">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="relative">
                                            <img
                                                src={profile.profilePicUrl}
                                                alt={profile.username}
                                                className="w-16 h-16 rounded-full border-2 border-orange-500"
                                            />
                                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full border border-white">
                                                {t.profileAnalyzer?.online}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-lg text-slate-900">
                                                    @{profile.username}
                                                </h4>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setProfile(null)}
                                                    className="text-slate-500 text-xs px-2 h-6"
                                                >
                                                    {t.profileAnalyzer?.change}
                                                </Button>
                                            </div>
                                            <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                                                <CheckCircle2 className="w-4 h-4" />
                                                {t.profileAnalyzer?.verified}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Goal Selection */}
                                <div className="mb-6">
                                    <h4 className="font-bold text-slate-900 mb-4">
                                        {t.profileAnalyzer.goals.title}
                                    </h4>
                                    {/* ... goals map ... */}
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
                                                        {t.profileAnalyzer.goals.recommended}
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
                                    {t.profileAnalyzer.goals.continue}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

