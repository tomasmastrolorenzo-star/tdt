import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Admin — TDT",
}

export default async function AdminPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    // Check admin role
    const { data: adminProfile } = await supabase
        .from("users")
        .select("community_role, role")
        .eq("id", user.id)
        .single()

    if (adminProfile?.community_role !== "admin" && adminProfile?.role !== "CEO") {
        redirect("/office")
    }

    // Fetch all members
    const { data: members } = await supabase
        .from("users")
        .select("id, name, email, telegram_username, bingx_uid, bingx_verified, community_role, created_at")
        .order("created_at", { ascending: false })

    const totalMembers = members?.length || 0
    const verifiedMembers = members?.filter((m) => m.bingx_verified).length || 0

    return (
        <div className="min-h-screen bg-zinc-50 text-black">
            {/* Admin Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-black tracking-tighter text-white">TDT</span>
                        <span className="text-xs font-black tracking-[0.3em] text-zinc-500 uppercase">Admin</span>
                    </div>
                    <a href="/office" className="text-xs font-black text-zinc-400 hover:text-white tracking-widest uppercase transition-colors">
                        ← La Oficina
                    </a>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pt-28 pb-16">
                <div className="mb-10">
                    <p className="text-xs font-black tracking-[0.3em] text-zinc-400 uppercase mb-2">Panel de Control</p>
                    <h1 className="text-4xl font-black tracking-tighter">Gestión de Miembros</h1>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: "Total Miembros", value: totalMembers, color: "text-black" },
                        { label: "Verificados", value: verifiedMembers, color: "text-green-600" },
                        { label: "Pendientes", value: totalMembers - verifiedMembers, color: "text-yellow-600" },
                        { label: "Tasa Verificación", value: totalMembers > 0 ? `${Math.round((verifiedMembers / totalMembers) * 100)}%` : "—", color: "text-black" },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white border border-zinc-200 p-6">
                            <p className="text-[10px] font-black tracking-widest uppercase text-zinc-400 mb-1">{stat.label}</p>
                            <p className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Members Table */}
                <div className="bg-white border border-zinc-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-zinc-100">
                        <h2 className="text-sm font-black tracking-widest uppercase">Lista de Miembros</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-zinc-100 bg-zinc-50">
                                    {["Nombre / Email", "Telegram", "BingX UID", "Estado", "Registro", "Acción"].map((h) => (
                                        <th key={h} className="text-left px-6 py-3 text-[10px] font-black tracking-widest uppercase text-zinc-400">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(members || []).map((member) => (
                                    <tr key={member.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-black">{member.name || "—"}</p>
                                            <p className="text-xs text-zinc-400">{member.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-zinc-600 font-mono text-xs">
                                                {member.telegram_username ? `@${member.telegram_username}` : <span className="text-zinc-300">—</span>}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-zinc-600 font-mono text-xs">
                                                {member.bingx_uid || <span className="text-zinc-300">—</span>}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-black ${member.bingx_verified ? "text-green-600" : "text-yellow-600"}`}>
                                                {member.bingx_verified ? "✓ Verificado" : "Pendiente"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-zinc-400">
                                            {new Date(member.created_at).toLocaleDateString("es-AR")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <VerifyButton
                                                memberId={member.id}
                                                isVerified={member.bingx_verified}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {totalMembers === 0 && (
                            <div className="text-center py-16 text-zinc-400 text-sm">
                                No hay miembros registrados aún.
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

// Client-side button for toggling verification
function VerifyButton({ memberId, isVerified }: { memberId: string; isVerified: boolean }) {
    return (
        <form action={`/api/admin/verify-member`} method="POST">
            <input type="hidden" name="memberId" value={memberId} />
            <input type="hidden" name="verified" value={(!isVerified).toString()} />
            <button
                type="submit"
                className={`text-[10px] font-black tracking-widest uppercase px-3 py-1.5 border transition-all ${isVerified
                        ? "border-zinc-200 text-zinc-400 hover:border-red-300 hover:text-red-500"
                        : "border-zinc-800 text-black hover:bg-black hover:text-white"
                    }`}
            >
                {isVerified ? "Revocar" : "Verificar"}
            </button>
        </form>
    )
}
