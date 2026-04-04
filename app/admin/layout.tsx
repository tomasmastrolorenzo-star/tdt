"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, CreditCard, Lock, 
  TrendingUp, Settings, LogOut, Menu, X, 
  ChevronRight, Bell, Zap, Terminal
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", icon: LayoutDashboard, label: "Command Center" },
  { href: "/admin/leads", icon: Users, label: "Leads / CRM" },
  { href: "/admin/sales", icon: CreditCard, label: "Sales Ledger" },
  { href: "/admin/vault", icon: Lock, label: "The Vault" },
  { href: "/admin/traffic", icon: TrendingUp, label: "Traffic IDE" },
  { href: "/admin/today", icon: Zap, label: "SMM Panel Sync" },
  { href: "/admin/ceo", icon: Terminal, label: "CEO Console" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (res.ok) window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden selection:bg-[#1D9E75]/30">
      
      {/* ── DESKTOP SIDEBAR ── */}
      <aside 
        className={`hidden md:flex flex-col border-r border-zinc-900 bg-zinc-950/80 backdrop-blur-3xl transition-all duration-500 ease-in-out relative z-30 ${collapsed ? 'w-20' : 'w-72'}`}
      >
        {/* Brand / Logo */}
        <div className={`p-8 mb-6 flex items-center gap-3 transition-opacity duration-300 ${collapsed ? 'justify-center opacity-70' : 'opacity-100'}`}>
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
             <span className="text-black font-black text-xl italic">T</span>
          </div>
          {!collapsed && (
             <div className="flex flex-col">
               <span className="font-black text-xs uppercase tracking-[0.4em]">TDT Élite</span>
               <span className="text-[9px] text-[#1D9E75] font-bold uppercase tracking-widest">Growth Engine</span>
             </div>
          )}
        </div>

        {/* Action Button: Collapse */}
        <button 
           onClick={() => setCollapsed(!collapsed)}
           className="absolute -right-3 top-32 w-6 h-6 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors z-40"
        >
           <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-500 ${collapsed ? '' : 'rotate-180'}`} />
        </button>

        {/* Navigation Grid */}
        <nav className="flex-1 px-4 space-y-2 custom-scrollbar overflow-y-auto">
          <div className={`mb-4 px-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? 'OPS' : 'Operations Command'}
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all relative overflow-hidden ${
                  isActive 
                    ? 'bg-white text-black font-black shadow-[0_10px_30px_rgba(255,255,255,0.1)]' 
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-black' : 'group-hover:scale-110 transition-transform duration-300'}`} />
                {!collapsed && <span className="text-[11px] uppercase tracking-widest leading-none">{item.label}</span>}
                {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Panel */}
        <div className="p-4 mt-auto border-t border-zinc-900/50">
          <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-4 px-4 py-4 text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/5 transition-all rounded-2xl"
          >
             <LogOut className="w-5 h-5" />
             {!collapsed && <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit System</span>}
          </button>
        </div>
      </aside>

      {/* ── MOBILE HEADER ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between px-6 z-50">
          <Menu className="w-6 h-6 text-zinc-400" onClick={() => setMobileOpen(true)} />
          <span className="font-black italic text-lg">TDT</span>
          <Bell className="w-5 h-5 text-zinc-600" />
      </div>

      {/* ── MOBILE OVERLAY ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] flex flex-col p-10 animate-in fade-in zoom-in duration-300">
           <X className="w-8 h-8 text-zinc-500 self-end mb-10" onClick={() => setMobileOpen(false)} />
           <div className="flex flex-col gap-6">
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="text-2xl font-black tracking-tighter hover:text-[#1D9E75] transition-colors">{item.label}</Link>
              ))}
              <button 
                 onClick={handleLogout} 
                 className="mt-10 text-rose-500 text-lg font-black uppercase tracking-widest text-left"
              >
                Log Out
              </button>
           </div>
        </div>
      )}

      {/* ── MAIN VIEWPORT ── */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
         {/* Background Orbs */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1D9E75]/[0.02] blur-[150px] pointer-events-none rounded-full z-0"></div>
         
         {/* Internal Content (Rendered here) */}
         <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pt-16 md:pt-0">
            {children}
         </div>
      </main>

    </div>
  );
}
