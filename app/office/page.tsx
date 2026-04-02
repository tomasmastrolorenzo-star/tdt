import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { LogoutButton } from "@/components/auth/logout-button";
import { ShieldAlert, Crosshair, HeartPulse, Clock, ArrowRight, BookOpen, Upload } from "lucide-react";
import { QuickAddLead } from '@/components/admin/quick-add-lead';
import Link from "next/link";

export default async function OfficePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch role for UI conditional rendering
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role?.toLowerCase();
  const isVendor = role === 'vendor';

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-zinc-800 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 pt-12">
        <header className="flex items-center justify-between pb-8 border-b border-zinc-900 mb-12">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black text-xl rounded-xl">T</div>
             <h1 className="text-3xl font-black tracking-tighter">Oficina<span className="text-zinc-500">Central</span></h1>
          </div>
          <div className="flex items-center gap-3">
            <QuickAddLead />
            <LogoutButton />
          </div>
        </header>

        <main className="w-full">
          <div className="flex items-center justify-between mb-8">
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest leading-none">
              <span className="text-white">Autorizado:</span> {user.email}
            </p>
            {role && (
              <span className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Rol: {role}
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* CEO Control (Hidden for Vendors) */}
            {!isVendor && (
              <Link href="/admin/ceo" className="group bg-gradient-to-br from-indigo-950/40 to-black border border-indigo-900/50 p-8 rounded-3xl shadow-xl hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:border-indigo-500/50 transition-all flex flex-col justify-between h-[280px]">
                <div className="flex items-start justify-between">
                  <div className="bg-indigo-500/10 p-4 rounded-full border border-indigo-500/20">
                    <ShieldAlert className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-zinc-600 group-hover:text-indigo-400 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">Panel de Control CEO</h2>
                  <p className="text-zinc-400 text-sm font-bold leading-relaxed">Capa de seguimiento matemático centralizado. Visualiza cuellos de botella en tiempo real, ingresos anuales y ratios de conversión absolutos.</p>
                </div>
              </Link>
            )}

            {/* CRM Kanban (Always Visible) */}
            <Link href="/admin/leads" className="group bg-gradient-to-br from-cyan-950/30 to-black border border-cyan-900/50 p-8 rounded-3xl shadow-xl hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] hover:border-cyan-500/50 transition-all flex flex-col justify-between h-[280px] col-span-1">
              <div className="flex items-start justify-between">
                <div className="bg-cyan-500/10 p-4 rounded-full border border-cyan-500/20">
                   <Crosshair className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
                <ArrowRight className="w-6 h-6 text-zinc-600 group-hover:text-cyan-400 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </div>
              <div>
                 <h2 className="text-3xl font-black text-white mb-2">Gestor de Prospectos</h2>
                 <p className="text-zinc-400 text-sm font-bold leading-relaxed">Matriz Kanban de alta velocidad. Capta y cierra objetivos inmediatamente con calificación inteligente de prospectos y seguimiento de prioridades.</p>
              </div>
            </Link>

            {/* Daily Routine (Hidden for Vendors) */}
            {!isVendor && (
              <Link href="/admin/daily" className="group bg-gradient-to-br from-orange-950/30 to-black border border-orange-900/50 p-8 rounded-3xl shadow-xl hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] hover:border-orange-500/50 transition-all flex flex-col justify-between h-[280px]">
                <div className="flex items-start justify-between">
                  <div className="bg-orange-500/10 p-4 rounded-full border border-orange-500/20">
                    <Clock className="w-8 h-8 text-orange-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-zinc-600 group-hover:text-orange-400 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">Operaciones Diarias</h2>
                  <p className="text-zinc-400 text-sm font-bold leading-relaxed">Checklist rígido de operaciones diarias. Registra y sincroniza tus DMs y respuestas diariamente para escalar antes de medianoche.</p>
                </div>
              </Link>
            )}

            {/* Financial Ledger (Hidden for Vendors) */}
            {!isVendor && (
              <Link href="/admin/clients" className="group bg-gradient-to-br from-green-950/30 to-black border border-green-900/50 p-8 rounded-3xl shadow-xl hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] hover:border-green-500/50 transition-all flex flex-col justify-between h-[280px]">
                <div className="flex items-start justify-between">
                  <div className="bg-green-500/10 p-4 rounded-full border border-green-500/20">
                    <HeartPulse className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-zinc-600 group-hover:text-green-400 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">Control de Ingresos</h2>
                  <p className="text-zinc-400 text-sm font-bold leading-relaxed">Gestión de clientes cerrados, suscripciones activas, ventanas de entrega de 48h y algoritmos de retención dinámica rigurosa.</p>
                </div>
              </Link>
            )}

            {/* Script Library (Hidden for Vendors) */}
            {!isVendor && (
              <Link href="/admin/scripts" className="group bg-gradient-to-br from-yellow-950/20 to-black border border-yellow-900/40 p-8 rounded-3xl shadow-xl hover:shadow-[0_0_30px_rgba(234,179,8,0.1)] hover:border-yellow-500/40 transition-all flex flex-col justify-between h-[280px]">
                <div className="flex items-start justify-between">
                  <div className="bg-yellow-500/10 p-4 rounded-full border border-yellow-500/20">
                    <BookOpen className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-zinc-600 group-hover:text-yellow-400 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">Librería de Scripts</h2>
                  <p className="text-zinc-400 text-sm font-bold leading-relaxed">Plantillas de mensajes validadas por nicho y etapa. Scripts ganadores, tasas de éxito y generación asistida por IA.</p>
                </div>
              </Link>
            )}

            {/* Bulk Import (Hidden for Vendors) */}
            {!isVendor && (
              <Link href="/admin/leads/import" className="group bg-gradient-to-br from-cyan-950/20 to-black border border-cyan-900/40 p-8 rounded-3xl shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:border-cyan-500/40 transition-all flex flex-col justify-between h-[280px]">
                <div className="flex items-start justify-between">
                  <div className="bg-cyan-500/10 p-4 rounded-full border border-cyan-500/20">
                    <Upload className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-zinc-600 group-hover:text-cyan-400 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">Importación Masiva</h2>
                  <p className="text-zinc-400 text-sm font-bold leading-relaxed">Importa prospectos masivamente vía CSV. Valida, previsualiza y omite duplicados de forma completamente automática.</p>
                </div>
              </Link>
            )}


          </div>
        </main>
      </div>
    </div>
  );
}
