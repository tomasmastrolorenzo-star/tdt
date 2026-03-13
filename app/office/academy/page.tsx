import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OfficeHeader } from "@/components/office/office-header"
import { AcademyCard } from "@/components/office/academy-card"
import type { Metadata } from "next"
import type { AcademyCategory } from "@/lib/supabase/types"

export const metadata: Metadata = {
    title: "Academia TDT — Recursos y Guías",
}

const CATEGORY_ORDER: AcademyCategory[] = ["novatos", "estrategia", "marca_personal"]

const CATEGORY_META: Record<AcademyCategory, { label: string; icon: string; desc: string }> = {
    novatos: {
        label: "Configuración Inicial",
        icon: "🚀",
        desc: "Todo lo que necesitas para arrancar: desde crear tu cuenta BingX hasta entender los conceptos base del mercado.",
    },
    estrategia: {
        label: "Estrategia de Mercado",
        icon: "📈",
        desc: "El framework de análisis institucional que usamos en TDT. Estructura de precios, gestión de riesgo y timing de entradas.",
    },
    marca_personal: {
        label: "Marca Personal & Referidos",
        icon: "🎯",
        desc: "Cómo construir tu presencia digital como trader y monetizar tu red con el programa de referidos TDT.",
    },
}

export default async function AcademyPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const { data: profile } = await supabase.from("users").select("name").eq("id", user.id).single()

    const { data: resources } = await supabase
        .from("academy_resources")
        .select("*")
        .eq("is_published", true)
        .order("order_index", { ascending: true })

    const byCategory: Record<string, typeof resources> = {}
    for (const cat of CATEGORY_ORDER) {
        byCategory[cat] = (resources || []).filter((r) => r.category === cat)
    }

    return (
        <div className="min-h-screen bg-zinc-50 text-black">
            <OfficeHeader userName={profile?.name || ""} userEmail={user.email || ""} />

            <main className="max-w-5xl mx-auto px-6 pt-28 pb-16">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-bold mb-8">
                    <a href="/office" className="hover:text-black transition-colors">La Oficina</a>
                    <span>›</span>
                    <span className="text-black">Academia</span>
                </div>

                <div className="mb-12">
                    <p className="text-xs font-black tracking-[0.3em] text-zinc-400 uppercase mb-2">Academia TDT</p>
                    <h1 className="text-4xl font-black tracking-tighter mb-3">Recursos & Guías</h1>
                    <p className="text-zinc-500 text-sm">
                        Material descargable organizado por pilares. Abre cada PDF directamente en tu navegador.
                    </p>
                </div>

                {/* Categories */}
                {CATEGORY_ORDER.map((cat) => {
                    const meta = CATEGORY_META[cat]
                    const items = byCategory[cat] || []
                    return (
                        <section key={cat} className="mb-14">
                            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-zinc-200">
                                <span className="text-3xl">{meta.icon}</span>
                                <div>
                                    <h2 className="text-xl font-black tracking-tighter mb-1">{meta.label}</h2>
                                    <p className="text-sm text-zinc-500 max-w-xl">{meta.desc}</p>
                                </div>
                            </div>
                            {items.length === 0 ? (
                                <div className="border border-dashed border-zinc-300 p-8 text-center text-zinc-400 text-sm">
                                    Contenido próximamente
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {items.map((resource, idx) => (
                                        <AcademyCard
                                            key={resource.id}
                                            title={resource.title}
                                            description={resource.description || ""}
                                            category={resource.category}
                                            fileUrl={resource.file_url}
                                            index={idx + 1}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    )
                })}
            </main>
        </div>
    )
}
