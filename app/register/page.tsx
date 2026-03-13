"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/office`,
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        console.error("Supabase signup error:", error)
        setError(`Error: ${error.message}`)
        return
      }

      console.log("Signup successful:", data)
      setSuccess(true)
    } catch (err) {
      console.error("Unexpected registration error:", err)
      setError(`Error inesperado: ${err instanceof Error ? err.message : "Error al registrarse"}`)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4 text-black">
        <Link href="/" className="flex items-center gap-3 mb-10 hover:opacity-70 transition-opacity">
          <Logo className="w-8 h-8 text-black" />
          <span className="text-2xl font-black tracking-tighter">TDT</span>
        </Link>
        <div className="w-full max-w-sm bg-white border border-zinc-200 p-8 text-center space-y-6">
          <CheckCircle className="w-16 h-16 text-black mx-auto" />
          <div>
            <h2 className="text-2xl font-black tracking-tighter mb-2">Registro Exitoso</h2>
            <p className="text-zinc-500 text-sm">Revisa tu email para confirmar tu cuenta y poder ingresar.</p>
          </div>
          <Link href="/login" className="block">
            <Button className="w-full bg-black text-white hover:bg-zinc-800 rounded-none text-xs font-black tracking-widest uppercase py-6">
              Ir a Login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4 text-black">
      <Link href="/" className="flex items-center gap-3 mb-10 hover:opacity-70 transition-opacity">
        <Logo className="w-8 h-8 text-black" />
        <span className="text-2xl font-black tracking-tighter">TDT</span>
      </Link>
      
      <div className="w-full max-w-sm bg-white border border-zinc-200 p-8">
        <div className="text-center mb-8">
          <p className="text-xs font-black tracking-[0.3em] text-zinc-400 uppercase mb-2">Crear Cuenta</p>
          <h1 className="text-3xl font-black tracking-tighter mb-2">Únete a TDT</h1>
          <p className="text-zinc-500 text-sm">Ingresa tus datos para comenzar.</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-6">
          {error && (
            <div className="p-3 border border-red-200 bg-red-50 text-red-600 text-xs font-semibold text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-xs font-black tracking-widest text-zinc-400 uppercase">
              Nombre Completo
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Tu nombre"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="bg-white border-zinc-200 rounded-none focus:border-black transition-colors"
            />
          </div>

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
              minLength={6}
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
              "Crear Cuenta"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-500">
            ¿Ya tienes cuenta? {" "}
            <Link href="/login" className="font-bold text-black hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
