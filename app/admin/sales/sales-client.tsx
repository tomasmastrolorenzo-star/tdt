"use client";

import { useState } from "react";
import { toast } from "sonner";
import { 
  Banknote, UploadCloud, CheckCircle2, DollarSign, 
  Calculator, AlertTriangle, ArrowRight, Wallet,
  ShieldCheck, TrendingUp, History, CreditCard
} from "lucide-react";
import { createBrowserClient } from '@supabase/ssr';

export function SalesClient({ pending, ledger }: { pending: any[], ledger: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [onboardingClient, setOnboardingClient] = useState<any | null>(null);
  
  // Form State
  const [paymentMethod, setPaymentMethod] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [beforeProfileFile, setBeforeProfileFile] = useState<File | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const calculateNet = (grossAmount: number, method: string) => {
    switch (method) {
      case 'paypal': return grossAmount * 0.94; // -6%
      case 'zelle': return grossAmount * 0.94; // -6%
      case 'cashapp': return grossAmount * 0.70; // -30%
      case 'western_union': return grossAmount; // 0%
      case 'crypto': return grossAmount * 0.99; // -1% network fee
      default: return grossAmount;
    }
  };

  const calculateFee = (method: string) => {
    switch (method) {
      case 'paypal': return '-6%';
      case 'zelle': return '-6%';
      case 'cashapp': return '-30%';
      case 'western_union': return '0%';
      case 'crypto': return '-1%';
      default: return '0%';
    }
  };

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod || !onboardingClient) return toast.error("Select payment method");

    setLoadingId('onboarding');
    try {
      let proofUrl = null;
      let beforeUrl = null;

      if (proofFile) {
        const ext = proofFile.name.split('.').pop();
        const pName = `proof_${onboardingClient.id}_${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('sales_assets').upload(pName, proofFile);
        if (upErr) throw upErr;
        proofUrl = supabase.storage.from('sales_assets').getPublicUrl(pName).data.publicUrl;
      }

      if (beforeProfileFile) {
        const ext = beforeProfileFile.name.split('.').pop();
        const bName = `before_${onboardingClient.id}_${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('sales_assets').upload(bName, beforeProfileFile);
        if (upErr) throw upErr;
        beforeUrl = supabase.storage.from('sales_assets').getPublicUrl(bName).data.publicUrl;
      }

      const grossNum = Number(onboardingClient.payment_amount) || 0;
      const netCalculated = calculateNet(grossNum, paymentMethod);

      const { error: patchErr } = await supabase.from('clients')
        .update({
          payment_method: paymentMethod,
          payment_proof_url: proofUrl,
          before_profile_url: beforeUrl,
          net_revenue: netCalculated,
          status: 'active'
        })
        .eq('id', onboardingClient.id);

      if (patchErr) throw patchErr;

      toast.success("Liquidación financiera confirmada. Cliente en ejecución.");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || 'Error processing onboarding');
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-10 p-2 bg-transparent min-h-screen">
      
      {/* ── TOP STATS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1D9E75]/5 blur-3xl pointer-events-none group-hover:bg-[#1D9E75]/10 transition-all"></div>
            <div className="flex items-center gap-3 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
               <History className="w-4 h-4" /> Recaudación Neta
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter">$12,450 <span className="text-sm font-bold text-zinc-600 block mt-1">Net profit detected</span></h2>
         </div>
         <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#1D9E75]">
               <ShieldCheck className="w-4 h-4" /> Verified Ops
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter">100% <span className="text-sm font-bold text-zinc-600 block mt-1">Audit compliance score</span></h2>
         </div>
         <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">
               <TrendingUp className="w-4 h-4" /> Growth Velocity
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter">+24% <span className="text-sm font-bold text-zinc-600 block mt-1">Vs last 30 days</span></h2>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── LEFT: PENDING QUEUE ── */}
        <div className="lg:col-span-4 flex flex-col gap-4">
           <div className="flex items-center justify-between mb-2">
              <h2 className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-600">Pending Liquidation</h2>
              <span className="bg-zinc-900 text-zinc-500 text-[10px] font-black px-2 py-0.5 rounded-full border border-zinc-800">{pending.length}</span>
           </div>
           
           <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
             {pending.length === 0 ? (
                <div className="bg-zinc-950/30 border border-zinc-900/50 rounded-2xl p-8 text-center border-dashed">
                   <p className="text-xs font-black text-zinc-700 uppercase tracking-widest">Queue empty. No pending payments.</p>
                </div>
             ) : pending.map(client => (
                <div 
                   key={client.id} 
                   onClick={() => setOnboardingClient(client)}
                   className={`group relative bg-zinc-950 border rounded-2xl p-6 cursor-pointer transition-all duration-300 ${onboardingClient?.id === client.id ? 'border-[#1D9E75] shadow-[0_0_30px_rgba(29,158,117,0.1)] scale-[1.02]' : 'border-zinc-900 hover:border-zinc-800'}`}
                >
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <h3 className="font-black text-white text-lg tracking-tight">@{client.leads?.instagram_username}</h3>
                       <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] uppercase tracking-widest font-black text-[#1D9E75] bg-[#1D9E75]/10 px-2 py-0.5 rounded">{client.service_type || 'Custom'}</span>
                          <span className="text-[9px] font-bold text-zinc-600">{new Date(client.created_at).toLocaleDateString()}</span>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="text-[10px] uppercase tracking-widest font-black text-zinc-600 mb-1">Intake</p>
                       <p className="text-2xl font-black text-white">${client.payment_amount}</p>
                     </div>
                   </div>
                   <div className="flex items-center justify-center w-full bg-zinc-900 group-hover:bg-[#1D9E75]/20 py-2 rounded-xl border border-zinc-800 group-hover:border-[#1D9E75]/30 transition-all">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-[#1D9E75]">Process Payment</span>
                   </div>
                </div>
             ))}
           </div>
        </div>

        {/* ── RIGHT: LIQUIDATION CONSOLE ── */}
        <div className="lg:col-span-8">
           {onboardingClient ? (
             <form onSubmit={handleOnboard} className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden backdrop-blur-3xl">
               
               <div className="absolute top-0 right-0 w-96 h-96 bg-[#1D9E75]/5 blur-[120px] pointer-events-none"></div>

               <div className="flex justify-between items-center mb-10 pb-6 border-b border-zinc-900">
                 <div>
                    <div className="flex items-center gap-2 mb-1">
                       <CreditCard className="w-4 h-4 text-[#1D9E75]" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1D9E75]">Payment Verification Terminal</span>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">@{onboardingClient.leads?.instagram_username}</h2>
                 </div>
                 <button type="button" onClick={() => setOnboardingClient(null)} className="text-[10px] uppercase font-black text-zinc-600 hover:text-white transition-colors">Discard</button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                  
                  {/* ENGINE VIEW */}
                  <div className="bg-black/50 border border-zinc-800/80 rounded-[2rem] p-8 shadow-inner relative">
                    <div className="flex items-center justify-between mb-8">
                       <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Mathematical Net</span>
                       <Calculator className="w-4 h-4 text-zinc-700" />
                    </div>
                    
                    <div className="space-y-6">
                       <div className="flex justify-between items-center text-sm font-bold text-zinc-500 uppercase tracking-widest">
                          <span>Gross Account</span>
                          <span className="text-lg text-white font-black">${onboardingClient.payment_amount}</span>
                       </div>
                       
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-rose-500/80 uppercase tracking-widest">Gateway Loss</span>
                          <div className="flex items-baseline gap-2">
                             <span className="text-xs font-black text-rose-500 bg-rose-950/30 px-2.5 py-1 rounded-lg">-{calculateFee(paymentMethod)}</span>
                             <span className="text-zinc-600 text-[10px] font-bold">-${(Number(onboardingClient.payment_amount) - calculateNet(Number(onboardingClient.payment_amount), paymentMethod)).toFixed(2)}</span>
                          </div>
                       </div>

                       <div className="pt-6 mt-6 border-t border-zinc-900">
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em]">Net TDT Revenue</span>
                          </div>
                          <p className={`text-5xl font-black ${paymentMethod ? 'text-[#1D9E75] drop-shadow-[0_0_15px_rgba(29,158,117,0.3)]' : 'text-zinc-800'} transition-all`}>
                             ${paymentMethod ? calculateNet(Number(onboardingClient.payment_amount), paymentMethod).toLocaleString() : '0.00'}
                          </p>
                       </div>
                    </div>
                  </div>

                  {/* ASSET UPLOADS */}
                  <div className="space-y-4">
                    <AssetUploader 
                      label="Payment Proof (Vault Upload)" 
                      file={proofFile} 
                      onChange={setProofFile} 
                      accept="image/*,.pdf"
                    />
                    <AssetUploader 
                      label="Before Profile (Historical Bench)" 
                      file={beforeProfileFile} 
                      onChange={setBeforeProfileFile} 
                      accept="image/*"
                    />
                    
                    {paymentMethod === 'cashapp' && (
                       <div className="p-4 bg-amber-950/20 border border-amber-900/40 rounded-2xl flex gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                          <p className="text-[10px] font-black text-amber-500 uppercase leading-relaxed tracking-wider">Warning: Critical fee detected. Verify alternative routing to maximize net profit.</p>
                       </div>
                    )}
                  </div>
               </div>

               <div className="mb-10">
                 <label className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-600 block mb-5">Select Settlement Channel</label>
                 <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {['paypal', 'zelle', 'cashapp', 'western_union', 'crypto'].map(method => (
                       <button
                         key={method}
                         type="button"
                         onClick={() => setPaymentMethod(method)}
                         className={`group py-4 px-4 flex flex-col items-center gap-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${paymentMethod === method ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105' : 'bg-zinc-900/40 border border-zinc-800/80 text-zinc-600 hover:text-white hover:border-zinc-700'}`}
                       >
                          <Wallet className={`w-4 h-4 ${paymentMethod === method ? 'text-black' : 'text-zinc-700 group-hover:text-zinc-400'}`} />
                          {method.replace('_', ' ')}
                       </button>
                    ))}
                 </div>
               </div>

               <button 
                  type="submit" 
                  disabled={loadingId === 'onboarding' || !paymentMethod || !proofFile}
                  className="w-full bg-[#1D9E75] text-white font-black uppercase tracking-[0.3em] text-[10px] py-6 rounded-2xl hover:bg-[#168260] transition-all flex items-center justify-center gap-3 disabled:opacity-20 shadow-[0_0_40px_rgba(29,158,117,0.2)] hover:shadow-[0_0_60px_rgba(29,158,117,0.3)] active:scale-[0.98]"
               >
                 {loadingId === 'onboarding' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Financial Settlement'}
               </button>

             </form>
           ) : (
             <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-zinc-950/20 border border-zinc-900/50 rounded-[3rem] border-dashed">
                <div className="p-8 bg-zinc-900/50 rounded-full border border-zinc-800 mb-6 group transition-all hover:scale-110">
                   <Banknote className="w-12 h-12 text-zinc-800 group-hover:text-[#1D9E75] transition-colors" />
                </div>
                <h3 className="text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px]">Financial Console Offline</h3>
                <p className="text-zinc-700 text-xs mt-2 font-bold uppercase tracking-widest">Select a candidate for liquidation</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}

function AssetUploader({ label, file, onChange, accept }: any) {
  return (
    <label className="block bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 cursor-pointer hover:bg-zinc-900/80 hover:border-zinc-700 transition-all group">
       <span className="text-[9px] uppercase font-black tracking-widest text-zinc-600 block mb-3 group-hover:text-zinc-400">{label}</span>
       <div className="flex items-center gap-4">
         <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${file ? 'bg-[#1D9E75]/20 text-[#1D9E75]' : 'bg-black text-zinc-800'}`}>
           <UploadCloud className="w-5 h-5" />
         </div>
         <span className={`text-xs font-black uppercase tracking-widest transition-all ${file ? 'text-white' : 'text-zinc-700'}`}>
            {file ? file.name : 'Upload File'}
         </span>
       </div>
       <input type="file" className="hidden" accept={accept} onChange={(e) => onChange(e.target.files?.[0] || null)} />
    </label>
  );
}
