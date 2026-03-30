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

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-zinc-800 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 pt-12">
        <header className="flex items-center justify-between pb-8 border-b border-zinc-900 mb-12">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black text-xl rounded-xl">T</div>
             <h1 className="text-3xl font-black tracking-tighter">Office<span className="text-zinc-500">Hub</span></h1>
          </div>
          <div className="flex items-center gap-3">
            <QuickAddLead />
            <LogoutButton />
          </div>
        </header>

        <main className="w-full">
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-8">
            <span className="text-white">Authorized Access:</span> {user.email}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* CEO Control */}
            <Link href="/admin/ceo" className="group bg-gradient-to-br from-indigo-950/40 to-black border border-indigo-900/50 p-8 rounded-3xl shadow-xl hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:border-indigo-500/50 transition-all flex flex-col justify-between h-[280px]">
              <div className="flex items-start justify-between">
                <div className="bg-indigo-500/10 p-4 rounded-full border border-indigo-500/20">
                   <ShieldAlert className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition-transform" />
                </div>
                <ArrowRight className="w-6 h-6 text-zinc-600 group-hover:text-indigo-400 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </div>
              <div>
                 <h2 className="text-3xl font-black text-white mb-2">CEO Dashboard</h2>
                 <p className="text-zinc-400 text-sm font-bold leading-relaxed">Centralized mathematical tracking layer. View realtime pipeline bottlenecks, massive YTD revenue, and absolute conversion ratios.</p>
              </div>
            </Link>

            {/* CRM Kanban */}
            <Link href="/admin/leads" className="group bg-gradient-to-br from-cyan-950/30 to-black border border-cyan-900/50 p-8 rounded-3xl shadow-xl hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] hover:border-cyan-500/50 transition-all flex flex-col justify-between h-[280px]">
              <div className="flex items-start justify-between">
                <div className="bg-cyan-500/10 p-4 rounded-full border border-cyan-500/20">
                   <Crosshair className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
                <ArrowRight className="w-6 h-6 text-zinc-600 group-hover:text-cyan-400 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </div>
              <div>
                 <h2 className="text-3xl font-black text-white mb-2">Ops Pipeline</h2>
                 <p className="text-zinc-400 text-sm font-bold leading-relaxed">High-velocity operational Kanban matrix. Extract and close targets immediately with integrated smart AI intake qualification and priority tracking.</p>
              </div>
            </Link>

            {/* Daily Routine */}
            <Link href="/admin/daily" className="group bg-gradient-to-br from-orange-950/30 to-black border border-orange-900/50 p-8 rounded-3xl shadow-xl hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] hover:border-orange-500/50 transition-all flex flex-col justify-between h-[280px]">
              <div className="flex items-start justify-between">
                <div className="bg-orange-500/10 p-4 rounded-full border border-orange-500/20">
                   <Clock className="w-8 h-8 text-orange-400 group-hover:scale-110 transition-transform" />
                </div>
                <ArrowRight className="w-6 h-6 text-zinc-600 group-hover:text-orange-400 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </div>
              <div>
                 <h2 className="text-3xl font-black text-white mb-2">Daily Execution</h2>
                 <p className="text-zinc-400 text-sm font-bold leading-relaxed">Daily operations rigid checklist. Record and sync your daily DMs & replies natively scaling directly into the CEO Matrix before Midnight.</p>
              </div>
            </Link>

            {/* Financial Ledger */}
            <Link href="/admin/clients" className="group bg-gradient-to-br from-green-950/30 to-black border border-green-900/50 p-8 rounded-3xl shadow-xl hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] hover:border-green-500/50 transition-all flex flex-col justify-between h-[280px]">
              <div className="flex items-start justify-between">
                <div className="bg-green-500/10 p-4 rounded-full border border-green-500/20">
                   <HeartPulse className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" />
                </div>
                <ArrowRight className="w-6 h-6 text-zinc-600 group-hover:text-green-400 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </div>
              <div>
                 <h2 className="text-3xl font-black text-white mb-2">Financial Ledger</h2>
                 <p className="text-zinc-400 text-sm font-bold leading-relaxed">Track locked clients, active subscriptions, automated delivery 48h windows and rigorous dynamic retention algorithms organically.</p>
              </div>
            </Link>

            {/* Script Library */}
            <Link href="/admin/scripts" className="group bg-gradient-to-br from-yellow-950/20 to-black border border-yellow-900/40 p-8 rounded-3xl shadow-xl hover:shadow-[0_0_30px_rgba(234,179,8,0.1)] hover:border-yellow-500/40 transition-all flex flex-col justify-between h-[280px]">
              <div className="flex items-start justify-between">
                <div className="bg-yellow-500/10 p-4 rounded-full border border-yellow-500/20">
                   <BookOpen className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform" />
                </div>
                <ArrowRight className="w-6 h-6 text-zinc-600 group-hover:text-yellow-400 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </div>
              <div>
                 <h2 className="text-3xl font-black text-white mb-2">Script Library</h2>
                 <p className="text-zinc-400 text-sm font-bold leading-relaxed">Validated message templates organized by niche and stage. Winner scripts, tasa de éxito, and AI generation.</p>
              </div>
            </Link>

            {/* Bulk Import */}
            <Link href="/admin/leads/import" className="group bg-gradient-to-br from-cyan-950/20 to-black border border-cyan-900/40 p-8 rounded-3xl shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:border-cyan-500/40 transition-all flex flex-col justify-between h-[280px]">
              <div className="flex items-start justify-between">
                <div className="bg-cyan-500/10 p-4 rounded-full border border-cyan-500/20">
                   <Upload className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
                <ArrowRight className="w-6 h-6 text-zinc-600 group-hover:text-cyan-400 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </div>
              <div>
                 <h2 className="text-3xl font-black text-white mb-2">Bulk Import</h2>
                 <p className="text-zinc-400 text-sm font-bold leading-relaxed">Drag and drop a CSV to mass-import leads into the pipeline. Validates, previews, and skips duplicates automatically.</p>
              </div>
            </Link>

          </div>
        </main>
      </div>
    </div>
  );
}
