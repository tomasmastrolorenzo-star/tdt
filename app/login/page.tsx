"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error || !authData.user) {
        setError(error?.message || "Error al iniciar sesión")
        return
      }

      const { data: profile } = await supabase
        .from("users")
        .select("community_role, role, bingx_uid, bingx_verified")
        .eq("id", authData.user.id)
        .single()

      if (profile?.community_role === "admin" || profile?.role === "CEO") {
        router.push("/admin")
      } else if (profile?.bingx_verified) {
        router.push("/office")
      } else if (!profile?.bingx_uid) {
        router.push("/gate")
      } else {
        router.push("/pending")
      }
      
      router.refresh()
    } catch {
      setError("Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4 text-black">
      <Link href="/" className="flex items-center gap-3 mb-10 hover:opacity-70 transition-opacity">
        <Logo className="w-8 h-8 text-black" />
        <span className="text-2xl font-black tracking-tighter">TDT</span>
      </Link>
      
      <div className="w-full max-w-sm bg-white border border-zinc-200 p-8">
        <div className="text-center mb-8">
          <p className="text-xs font-black tracking-[0.3em] text-zinc-400 uppercase mb-2">Acceso a la Manada</p>
          <h1 className="text-3xl font-black tracking-tighter mb-2">Bienvenido</h1>
          <p className="text-zinc-500 text-sm">Ingresa tus credenciales para continuar.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 border border-red-200 bg-red-50 text-red-600 text-xs font-semibold text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-black tracking-widest text-zinc-400 uppercase">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white border-zinc-200 rounded-none focus:border-black transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-black tracking-widest text-zinc-400 uppercase">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white border-zinc-200 rounded-none focus:border-black transition-colors"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-black text-white hover:bg-zinc-800 rounded-none text-xs font-black tracking-widest uppercase py-6"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Ingresar a la Oficina"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-500">
            ¿No tienes cuenta? {" "}
            <Link href="/register" className="font-bold text-black hover:underline">
              Únete aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
