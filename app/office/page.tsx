import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OfficeHeader } from "@/components/office/office-header"
import { ModuleCard } from "@/components/office/module-card"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "La Oficina — TDT",
    description: "Tu centro de operaciones en Trend Digital Trade.",
}

// ── CONFIG: Update these links when ready ──
const TELEGRAM_CHANNEL = "https://t.me/trenddigitaltrade"   // Canal de Señales
const TELEGRAM_GROUP = "https://t.me/trenddigitaltrade"   // Grupo Comunidad

export default async function OfficePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const { data: profile } = await supabase
        .from("users")
        .select("name, email, bingx_verified, telegram_username, bingx_uid, community_role")
        .eq("id", user.id)
        .single()

    // If profile incomplete, redirect to gate
    if (!profile?.bingx_uid && !profile?.telegram_username) {
        redirect("/gate")
    }

    const userName = profile?.name || user.email || ""
    const isVerified = profile?.bingx_verified

    return (
        <div className="min-h-screen bg-zinc-50 text-black">
            <OfficeHeader userName={userName} userEmail={user.email || ""} />

            <main className="max-w-5xl mx-auto px-6 pt-28 pb-16">
                {/* Status Banner */}
                {!isVerified && (
                    <div className="border border-zinc-300 bg-white px-6 py-4 mb-10 flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                        <p className="text-xs text-zinc-500 leading-relaxed">
                            <strong className="text-black font-black">Verificación pendiente.</strong>{" "}
                            El equipo TDT revisará tu UID de BingX y activará tu acceso completo en las próximas horas.
                        </p>
                    </div>
                )}

                {/* Welcome */}
                <div className="mb-12">
                    <p className="text-xs font-black tracking-[0.3em] text-zinc-400 uppercase mb-2">
                        Tu Centro de Operaciones
                    </p>
                    <h1 className="text-4xl font-black tracking-tighter">
                        Bienvenido{isVerified ? "" : " — Acceso en revisión"}.
                    </h1>
                </div>

                {/* 3 Module Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <ModuleCard
                        icon="📡"
                        title="Señales & Análisis"
                        description="Canal privado de Telegram con alertas en tiempo real, niveles institucionales y contexto de mercado antes de que el retail reaccione."
                        actionLabel="Abrir Canal"
                        href={TELEGRAM_CHANNEL}
                        external
                    />
                    <ModuleCard
                        icon="🐺"
                        title="La Manada"
                        description="El grupo privado de la comunidad. Accountability diario, operativas compartidas y conversaciones de alto nivel entre traders activos."
                        actionLabel="Entrar al Grupo"
                        href={TELEGRAM_GROUP}
                        external
                    />
                    <ModuleCard
                        icon="📚"
                        title="Academia TDT"
                        description="Guías descargables sobre trading, wallets y marca personal. Todo lo que necesitas para empezar con el pie derecho."
                        actionLabel="Ver Academia"
                        href="/office/academy"
                    />
                </div>

                {/* Profile Quick Stats */}
                <div className="border border-zinc-200 bg-white p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <p className="text-xs font-black tracking-widest uppercase text-zinc-400 mb-1">Tu Perfil</p>
                            <p className="font-black text-lg tracking-tight">{userName}</p>
                        </div>
                        <div className="flex gap-8">
                            <div>
                                <p className="text-[10px] font-black tracking-widest uppercase text-zinc-400 mb-1">BingX UID</p>
                                <p className="text-sm font-semibold text-zinc-600">{profile?.bingx_uid || "—"}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black tracking-widest uppercase text-zinc-400 mb-1">Telegram</p>
                                <p className="text-sm font-semibold text-zinc-600">
                                    {profile?.telegram_username ? `@${profile.telegram_username}` : "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black tracking-widest uppercase text-zinc-400 mb-1">Estado</p>
                                <p className={`text-sm font-black ${isVerified ? "text-green-600" : "text-yellow-600"}`}>
                                    {isVerified ? "✓ Verificado" : "Pendiente"}
                                </p>
                            </div>
                        </div>
                        <a href="/office/profile" className="text-xs font-black tracking-widest uppercase text-zinc-400 hover:text-black transition-colors border border-zinc-200 px-4 py-2 hover:border-black">
                            Editar →
                        </a>
                    </div>
                </div>
            </main>
        </div>
    )
}
