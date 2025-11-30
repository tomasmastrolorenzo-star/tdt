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
import { ArrowLeft, User, Mail, Shield, Trophy, Save, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [userData, setUserData] = useState<any>(null)

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

            const { data } = await supabase
                .from("users")
                .select("*, levels(*)")
                .eq("id", user.id)
                .single()

            if (data) {
                setUserData(data)
                setName(data.name || "")
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
                .from("users")
                .update({ name })
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
            <div className="max-w-2xl mx-auto">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al Dashboard
                </Link>

                <div className="grid gap-6">
                    {/* Profile Header */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <Avatar className="w-24 h-24 border-4 border-zinc-800">
                                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                                    <AvatarFallback className="bg-emerald-600 text-2xl">
                                        {name ? name.charAt(0).toUpperCase() : "U"}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="text-center md:text-left space-y-2 flex-1">
                                    <h1 className="text-2xl font-bold text-white">{name || "Usuario"}</h1>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                            {userData?.role || "USER"}
                                        </Badge>
                                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 flex items-center gap-1">
                                            <Trophy className="w-3 h-3" />
                                            Nivel: {userData?.levels?.name || "Novato"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Edit Profile Form */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                                <User className="w-5 h-5 text-emerald-500" />
                                Información Personal
                            </CardTitle>
                            <CardDescription className="text-zinc-400">
                                Actualiza tus datos personales
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSave} className="space-y-4">
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
                                    <p className="text-xs text-zinc-500">El email no se puede cambiar</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-zinc-300">Nombre Completo</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="pl-9 bg-zinc-800 border-zinc-700 text-white focus:ring-emerald-500/50"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
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

                    {/* Security / Stats */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                                <Shield className="w-5 h-5 text-emerald-500" />
                                Seguridad y Estado
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                                <span className="text-zinc-300">Contrato NDA</span>
                                <Badge variant={userData?.nda_signed ? "default" : "destructive"} className={userData?.nda_signed ? "bg-green-500/20 text-green-400" : ""}>
                                    {userData?.nda_signed ? "Firmado" : "Pendiente"}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                                <span className="text-zinc-300">ID de Usuario</span>
                                <code className="text-xs bg-zinc-950 px-2 py-1 rounded text-zinc-500 font-mono">
                                    {user?.id}
                                </code>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
