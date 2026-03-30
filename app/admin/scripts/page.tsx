import { createServerClient } from '@supabase/ssr';
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/auth/logout-button';
import { BookOpen } from 'lucide-react';
import { ScriptLibraryClient } from './script-library-client';
import { NotificationBell } from '@/components/admin/notification-bell';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ScriptLibraryPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll() }, setAll() {} }
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: scripts } = await supabase
    .from('scripts')
    .select('id, nicho, etapa, contenido, es_ganador, usos, conversiones, created_at')
    .order('es_ganador', { ascending: false })
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-zinc-800 pb-20">
      <div className="max-w-[1100px] mx-auto px-6 pt-12">
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-900">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-2xl">
              <BookOpen className="w-7 h-7 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter">Script Library</h1>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-0.5">Mensajes validados por nicho · Fuente de verdad</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/admin/leads" className="text-zinc-500 hover:text-white text-[10px] uppercase font-black tracking-widest transition-colors">← Pipeline</a>
            <NotificationBell />
            <LogoutButton />
          </div>
        </header>
        <ScriptLibraryClient initialScripts={scripts || []} />
      </div>
    </div>
  );
}
