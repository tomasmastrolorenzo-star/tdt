"use client";

import { useState } from "react";
import { toast } from "sonner";
import { 
  ShieldCheck, Save, RefreshCw, Key, 
  CreditCard, Wallet, Landmark, Bitcoin,
  AlertCircle, Lock
} from "lucide-react";
import { createBrowserClient } from '@supabase/ssr';

export function VaultClient({ initialConfig }: { initialConfig: any[] }) {
  const [config, setConfig] = useState(initialConfig);
  const [loading, setLoading] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const updateKey = async (key: string, value: string) => {
    setLoading(key);
    try {
      const { error } = await supabase
        .from('system_config')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key);

      if (error) throw error;
      
      setConfig(prev => prev.map(c => c.key === key ? { ...c, value } : c));
      toast.success(`${key} actualizado en la Bóveda.`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(null);
    }
  };

  const icons: Record<string, any> = {
    active_cashapp: CreditCard,
    active_zelle: Landmark,
    active_usdt_trc20: Bitcoin,
    active_wise: Wallet
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      
      <div className="flex items-center justify-between mb-12">
         <div>
            <div className="flex items-center gap-2 mb-2">
               <Lock className="w-4 h-4 text-[#1D9E75]" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Security / Financial Ops</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter">The Payment Vault</h1>
         </div>
         <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-900 px-4 py-2 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-[#1D9E75]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Encrypted Session</span>
         </div>
      </div>

      <div className="grid gap-6">
         {config.map((item: any) => {
            const Icon = icons[item.key] || Key;
            return (
               <div key={item.key} className="bg-zinc-950 border border-zinc-900 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-8 transition-all hover:border-zinc-800 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] blur-3xl pointer-events-none"></div>
                  
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                     <Icon className="w-8 h-8 text-zinc-500 group-hover:text-[#1D9E75] transition-colors" />
                  </div>

                  <div className="flex-1 w-full">
                     <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{item.key.replace('active_', '').replace('_', ' ')}</label>
                        <span className="text-[8px] font-bold text-zinc-700 uppercase">Last updated: {new Date(item.updated_at).toLocaleString()}</span>
                     </div>
                     <input 
                        type="text" 
                        defaultValue={item.value}
                        onBlur={(e) => {
                           if (e.target.value !== item.value) {
                              updateKey(item.key, e.target.value);
                           }
                        }}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-4 text-white font-mono text-sm focus:outline-none focus:border-[#1D9E75] transition-colors"
                        placeholder="Enter value..."
                     />
                     <p className="text-[10px] text-zinc-600 mt-2 font-medium italic">{item.description}</p>
                  </div>

                  <div className="shrink-0">
                     {loading === item.key ? (
                        <RefreshCw className="w-6 h-6 text-[#1D9E75] animate-spin" />
                     ) : (
                        <div className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-700">
                           <Save className="w-5 h-5" />
                        </div>
                     )}
                  </div>
               </div>
            );
         })}
      </div>

      <div className="mt-12 p-6 bg-amber-950/20 border border-amber-900/40 rounded-2xl flex gap-4">
         <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
         <div>
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">CEO Operational Protocol</p>
            <p className="text-sm text-amber-200/60 leading-relaxed">Changes in the Vault are applied in real-time to the Sales AI. Any active closing conversation will immediately start using these updated accounts to prevent financial leakage.</p>
         </div>
      </div>

    </div>
  );
}
