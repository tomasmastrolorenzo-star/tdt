"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export default function GatePage() {
    const router = useRouter()
    const [bingxUid, setBingxUid] = useState("")
    const [telegramUsername, setTelegramUsername] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!bingxUid.trim() || !telegramUsername.trim()) {
            setError("Ambos campos son obligatorios.")
            return
        }

        setLoading(true)
        setError("")

        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { router.push("/login"); return }

            const cleanTelegram = telegramUsername.replace(/^@/, "")

            const { error: updateError } = await supabase
                .from("users")
                .update({
                    bingx_uid: bingxUid.trim(),
                    telegram_username: cleanTelegram,
                    bingx_verified: false, // Admin verifies manually
                })
                .eq("id", user.id)

            if (updateError) throw updateError

            router.push("/office")
        } catch {
            setError("Error al guardar los datos. Intenta de nuevo.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black tracking-tighter mb-2">TDT</h1>
                    <p className="text-xs font-black tracking-[0.3em] text-zinc-500 uppercase">
                        Trend Digital Trade
                    </p>
                </div>

                {/* Gate Card */}
                <div className="border border-zinc-800 bg-zinc-950 p-10">
                    <div className="mb-8">
                        <p className="text-xs font-black tracking-[0.3em] text-zinc-500 uppercase mb-3">
                            Último paso
                        </p>
                        <h2 className="text-2xl font-black tracking-tighter mb-3">
                            Conecta tu perfil
                        </h2>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Para verificar tu membresía, necesitamos tu UID de BingX y tu usuario
                            de Telegram. Estos datos son revisados manualmente por el equipo TDT.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black tracking-widest uppercase text-zinc-400 mb-2">
                                UID de BingX
                            </label>
                            <input
                                type="text"
                                value={bingxUid}
                                onChange={(e) => setBingxUid(e.target.value)}
                                placeholder="Ej: 123456789"
                                className="w-full bg-black border border-zinc-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors placeholder:text-zinc-600"
                                disabled={loading}
                            />
                            <p className="mt-1 text-xs text-zinc-600">
                                Encuéntralo en BingX → Perfil → Mi UID
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-black tracking-widest uppercase text-zinc-400 mb-2">
                                Usuario de Telegram
                            </label>
                            <input
                                type="text"
                                value={telegramUsername}
                                onChange={(e) => setTelegramUsername(e.target.value)}
                                placeholder="@tuusuario"
                                className="w-full bg-black border border-zinc-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors placeholder:text-zinc-600"
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-red-400 font-semibold">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black text-sm font-black tracking-widest uppercase py-4 hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
                            ) : (
                                "Acceder a La Oficina →"
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-zinc-600 mt-6">
                    Tu acceso será activado por el equipo TDT en las próximas horas.
                </p>
            </div>
        </div>
    )
}
