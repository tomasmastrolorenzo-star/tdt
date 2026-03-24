"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { OfficeHeader } from "@/components/office/office-header"
import { Loader2, Save } from "lucide-react"

export default function ProfilePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState("")
    const [userName, setUserName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [form, setForm] = useState({ telegram_username: "", name: "" })

    useEffect(() => {
        const load = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { router.push("/login"); return }

            setUserEmail(user.email || "")

            const { data: profile } = await supabase
                .from("users")
                .select("name, telegram_username")
                .eq("id", user.id)
                .single()

            if (profile) {
                setUserName(profile.name || "")
                setForm({
                    name: profile.name || "",
                    telegram_username: profile.telegram_username || "",
                })
            }
            setLoading(false)
        }
        load()
    }, [router])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage("")

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const cleanTelegram = form.telegram_username.replace(/^@/, "")

        const { error } = await supabase
            .from("users")
            .update({
                name: form.name,
                telegram_username: cleanTelegram,
            })
            .eq("id", user.id)

        setSaving(false)
        if (error) {
            setMessage("Error al guardar. Intenta de nuevo.")
        } else {
            setMessage("✓ Cambios guardados.")
            setUserName(form.name)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 text-black">
            <OfficeHeader userName={userName} userEmail={userEmail} />

            <main className="max-w-2xl mx-auto px-6 pt-28 pb-16">
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-bold mb-8">
                    <a href="/office" className="hover:text-black transition-colors">La Oficina</a>
                    <span>›</span>
                    <span className="text-black">Mi Perfil</span>
                </div>

                <div className="mb-10">
                    <p className="text-xs font-black tracking-[0.3em] text-zinc-400 uppercase mb-2">Mi Perfil</p>
                    <h1 className="text-4xl font-black tracking-tighter">Tus datos de membresía</h1>
                </div>

                <form onSubmit={handleSave} className="bg-white border border-zinc-200 p-8 space-y-6">
                    <div>
                        <label className="block text-xs font-black tracking-widest uppercase text-zinc-400 mb-2">
                            Nombre / Alias
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Tu nombre o alias"
                            className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black tracking-widest uppercase text-zinc-400 mb-2">
                            Usuario de Telegram
                        </label>
                        <input
                            type="text"
                            value={form.telegram_username}
                            onChange={(e) => setForm({ ...form, telegram_username: e.target.value })}
                            placeholder="@tuusuario"
                            className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        {message && (
                            <p className={`text-xs font-semibold ${message.startsWith("✓") ? "text-green-600" : "text-red-500"}`}>
                                {message}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={saving}
                            className="ml-auto flex items-center gap-2 bg-black text-white text-xs font-black tracking-widest uppercase px-6 py-3 hover:bg-zinc-800 transition-colors disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            Guardar
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}
