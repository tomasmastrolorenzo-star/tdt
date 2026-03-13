import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Logo } from "@/components/ui/logo"

export default async function PendingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Ensure fresh data
  const { data: profile } = await supabase
    .from("users")
    .select("bingx_verified, bingx_uid")
    .eq("id", user.id)
    .single()

  if (profile?.bingx_verified) {
    redirect("/office")
  }

  if (!profile?.bingx_uid) {
    redirect("/gate")
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,50,50,0.1)_0,rgba(0,0,0,1)_100%)]"></div>

      <div className="relative z-10 w-full max-w-md bg-zinc-950 border border-zinc-900 p-10 flex flex-col items-center shadow-2xl">
        <Logo className="w-12 h-12 text-zinc-500 mb-8" />
        
        <div className="text-center space-y-4">
          <p className="text-xs font-black tracking-[0.3em] text-zinc-500 uppercase animate-pulse">
            Terminal TDT
          </p>
          
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase">
            Acceso en revisión
          </h1>
          
          <div className="h-px w-full bg-zinc-900 my-6"></div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono bg-black p-3 border border-zinc-900">
              <span className="text-zinc-500">ESTADO UID</span>
              <span className="text-green-500">[{profile.bingx_uid}] VINCULADO</span>
            </div>
            
            <div className="flex items-center justify-between text-xs font-mono bg-black p-3 border border-zinc-900">
              <span className="text-zinc-500">ASIGNACIÓN DE PLAZA</span>
              <span className="text-yellow-500 animate-pulse">[PENDIENTE]</span>
            </div>
          </div>
          
          <div className="pt-6">
            <p className="text-sm text-zinc-400 leading-relaxed font-mono">
              Tu solicitud está siendo procesada por el equipo TDT. 
              <br /><br />
              Recibirás acceso una vez que tu cuenta sea validada manualmente. 
              No es necesario que envíes tus datos de nuevo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
