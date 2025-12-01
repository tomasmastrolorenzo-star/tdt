"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User as UserIcon, Mail, Shield, Trophy, Save, Loader2, Wallet, DollarSign } from "lucide-react"
import Link from "next/link"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface ProfileData {
    id: string
    email: string | null
    full_name: string | null
    role: string
    created_at: string
}

interface CreditData {
    balance: number
}

export default function ProfilePage() {
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [profileData, setProfileData] = useState<ProfileData | null>(null)
    const [creditData, setCreditData] = useState<CreditData | null>(null)

    // Form state
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push("/login")
                return
            }

            setUser(user)
            setEmail(user.email || "")

            // Fetch Profile
            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single()

            // Fetch Credits
            const { data: credits } = await supabase
                .from("credits")
                .select("balance")
                .eq("user_id", user.id)
                .single()

            if (profile) {
                setProfileData(profile)
                setName(profile.full_name || "")
            }

            if (credits) {
                setCreditData(credits)
            }

            setLoading(false)
        }

        loadProfile()
    }, [router, supabase])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setSaving(true)

        try {
            const { error } = await supabase
                .from("profiles")
                .update({ full_name: name })
                .eq("id", user.id)

            if (error) throw error

            // Show success message (could use a toast here)
            alert("Perfil actualizado correctamente")
        } catch (error) {
            console.error("Error updating profile:", error)
            alert("Error al actualizar el perfil")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al Dashboard
                </Link>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Left Column: Profile Card & Stats */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardContent className="pt-6 flex flex-col items-center text-center">
                                <Avatar className="w-24 h-24 border-4 border-zinc-800 mb-4">
                                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                                    <AvatarFallback className="bg-emerald-600 text-2xl">
                                        {name ? name.charAt(0).toUpperCase() : "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <h1 className="text-xl font-bold text-white mb-1">{name || "Usuario"}</h1>
                                <p className="text-sm text-zinc-400 mb-4">{email}</p>

                                <div className="flex flex-wrap justify-center gap-2 mb-4">
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                        {profileData?.role || "VENDOR"}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Finanzas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Wallet className="w-4 h-4 text-emerald-500" />
                                        <span className="text-zinc-300">Balance</span>
                                    </div>
                                    <span className="font-bold text-white">${creditData?.balance?.toFixed(2) || "0.00"}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-blue-500" />
                                        <span className="text-zinc-300">Gastado</span>
                                    </div>
                                    <span className="font-bold text-white">$0.00</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Edit Form */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-xl text-white flex items-center gap-2">
                                    <UserIcon className="w-5 h-5 text-emerald-500" />
                                    Información Personal
                                </CardTitle>
                                <CardDescription className="text-zinc-400">
                                    Actualiza tus datos personales
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSave} className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-zinc-300">Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                                <Input
                                                    id="email"
                                                    value={email}
                                                    disabled
                                                    className="pl-9 bg-zinc-800/50 border-zinc-700 text-zinc-400"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-zinc-300">Nombre Completo</Label>
                                            <div className="relative">
                                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                                <Input
                                                    id="name"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="pl-9 bg-zinc-800 border-zinc-700 text-white focus:ring-emerald-500/50"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className="text-zinc-300">ID de Usuario</Label>
                                            <div className="p-2 bg-zinc-800/50 border border-zinc-700 rounded text-xs font-mono text-zinc-400 truncate">
                                                {user?.id}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-zinc-300">Fecha de Registro</Label>
                                            <div className="p-2 bg-zinc-800/50 border border-zinc-700 rounded text-sm text-zinc-400">
                                                {new Date(profileData?.created_at || Date.now()).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={saving}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Guardando...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Guardar Cambios
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

