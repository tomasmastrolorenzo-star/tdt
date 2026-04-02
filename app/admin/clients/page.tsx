import { createServerClient } from '@supabase/ssr';
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/auth/logout-button';
import { Vault, CalendarClock, Briefcase } from 'lucide-react';
import { ClientsClient } from './clients-client';
import { NotificationBell } from '@/components/admin/notification-bell';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ClientsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll() } , setAll() {} }
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Securely query all closed clients 
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-zinc-800">
      <div className="max-w-[1400px] mx-auto px-6 pt-12">
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-900">
           <div className="flex gap-12 items-center">
             <div className="flex items-center gap-3">
                <Vault className="w-8 h-8 text-green-500" />
                <div>
                  <h1 className="text-3xl font-black tracking-tighter">Control de Ingresos</h1>
                  <p className="text-zinc-500 mt-2">Seguimiento financiero y post-venta en tiempo real.</p>
                </div>
             </div>

             {/* NATIVE NAVIGATION MENUS FOR TDT */}
             <nav className="hidden md:flex gap-6 items-center">
                <a href="/admin/leads" className="text-zinc-500 hover:text-white text-[10px] uppercase font-black tracking-widest flex items-center gap-2 transition-colors">
                  <Briefcase className="w-3.5 h-3.5" /> CRM Pipeline
                </a>
                <a href="/admin/daily" className="text-zinc-500 hover:text-white text-[10px] uppercase font-black tracking-widest flex items-center gap-2 transition-colors">
                  <CalendarClock className="w-3.5 h-3.5" /> Daily Operations
                </a>
             </nav>
           </div>
           
           <div className="flex gap-4 items-center">
              <NotificationBell />
              <LogoutButton />
           </div>
        </header>

        <ClientsClient initialClients={clients || []} />
      </div>
    </div>
  );
}
