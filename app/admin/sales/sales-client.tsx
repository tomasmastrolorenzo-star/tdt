"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Banknote, UploadCloud, CheckCircle2, DollarSign, Calculator, AlertTriangle, ArrowRight, Wallet } from "lucide-react";
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
      default: return grossAmount;
    }
  };

  const calculateFee = (method: string) => {
    switch (method) {
      case 'paypal': return '-6%';
      case 'zelle': return '-6%';
      case 'cashapp': return '-30%';
      case 'western_union': return '0%';
      default: return 'Pending';
    }
  };

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod || !onboardingClient) return toast.error("Select payment method");

    setLoadingId('onboarding');
    try {
      let proofUrl = null;
      let beforeUrl = null;

      // 1. Upload Assets if present
      if (proofFile) {
        const ext = proofFile.name.split('.').pop();
        const pName = `proof_${onboardingClient.id}_${Date.now()}.${ext}`;
        const { error: upErr, data: pData } = await supabase.storage.from('sales_assets').upload(pName, proofFile);
        if (upErr) throw upErr;
        proofUrl = supabase.storage.from('sales_assets').getPublicUrl(pName).data.publicUrl;
      }

      if (beforeProfileFile) {
        const ext = beforeProfileFile.name.split('.').pop();
        const bName = `before_${onboardingClient.id}_${Date.now()}.${ext}`;
        const { error: upErr, data: bData } = await supabase.storage.from('sales_assets').upload(bName, beforeProfileFile);
        if (upErr) throw upErr;
        beforeUrl = supabase.storage.from('sales_assets').getPublicUrl(bName).data.publicUrl;
      }

      // 2. Net Calculation
      const grossNum = Number(onboardingClient.payment_amount) || 0;
      const netCalculated = calculateNet(grossNum, paymentMethod);

      // 3. Update Client Record
      const { error: patchErr } = await supabase.from('clients')
        .update({
          payment_method: paymentMethod,
          payment_proof_url: proofUrl,
          before_profile_url: beforeUrl,
          net_revenue: netCalculated
        })
        .eq('id', onboardingClient.id);

      if (patchErr) throw patchErr;

      // 4. Fulfillment manually triggered later in Fulfillment Board
      toast.success("Onboarding Financiero completado exitosamente");
      window.location.reload(); // Refresh to resync SSR containers
    } catch (err: any) {
      toast.error(err.message || 'Error processing onboarding');
      setLoadingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* ── LEFT COLUMN: PENDING ONBOARDING ── */}
      <div className="lg:col-span-4 flex flex-col gap-6">
         <h2 className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-2">Required Onboarding ({pending.length})</h2>
         
         {pending.length === 0 ? (
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl p-6 text-center shadow-inner">
               <CheckCircle2 className="w-8 h-8 text-zinc-800 mx-auto mb-3" />
               <p className="text-xs font-bold text-zinc-600">All clients properly onboarded.</p>
            </div>
         ) : pending.map(client => (
            <div 
               key={client.id} 
               onClick={() => setOnboardingClient(client)}
               className={`bg-zinc-950 border rounded-2xl p-5 cursor-pointer transition-all ${onboardingClient?.id === client.id ? 'border-[#1D9E75] shadow-[0_0_20px_rgba(29,158,117,0.15)] scale-[1.02]' : 'border-zinc-900 hover:border-zinc-800'}`}
            >
               <div className="flex justify-between items-start mb-3">
                 <div>
                   <h3 className="font-black text-white text-lg">@{client.leads?.instagram_username || 'Unknown'}</h3>
                   <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded">{client.service_type || 'Custom Plan'}</span>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] uppercase tracking-widest font-black text-[#1D9E75]">Gross Base</p>
                   <p className="text-xl font-black text-white">${client.payment_amount || 0}</p>
                 </div>
               </div>
               
               <button className="w-full mt-2 bg-[#1b624a]/20 text-[#1D9E75] font-black uppercase tracking-widest text-[9px] py-2 rounded border border-[#1D9E75]/30 flex justify-center items-center gap-1.5">
                 Process Ledger <ArrowRight className="w-3 h-3" />
               </button>
            </div>
         ))}
      </div>

      {/* ── CENTRAL COLUMN: ACTIVE ONBOARDING FORM ── */}
      <div className="lg:col-span-8">
         {onboardingClient ? (
           <form onSubmit={handleOnboard} className="bg-zinc-950 border border-zinc-900 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
             
             <div className="flex justify-between items-center mb-8 pb-6 border-b border-zinc-900">
               <div>
                  <h2 className="text-2xl font-black text-white">@{onboardingClient.leads?.instagram_username}</h2>
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mt-1">Financial Liquidation Form</p>
               </div>
               <button type="button" onClick={() => setOnboardingClient(null)} className="text-[10px] uppercase font-black text-zinc-600 hover:text-white">Cancel</button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                
                {/* Mathematical Engine View */}
                <div className="bg-black border border-zinc-800 rounded-2xl p-6 shadow-inner relative">
                  <div className="flex items-center gap-2 text-[#1D9E75] text-[10px] uppercase font-black tracking-widest mb-4">
                     <Calculator className="w-3.5 h-3.5" /> Engine Deduction
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-xs text-zinc-500 font-bold">Gross Intake</span>
                     <span className="text-lg font-black text-white">${onboardingClient.payment_amount || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-zinc-900">
                     <span className="text-xs font-bold text-red-500">Gateway Fee Rate</span>
                     <span className="text-sm font-black text-red-400 bg-red-950/30 px-2 py-0.5 rounded">{calculateFee(paymentMethod)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-zinc-400 font-black uppercase tracking-widest">Net Profit</span>
                     <span className={`text-3xl font-black ${paymentMethod ? 'text-green-500' : 'text-zinc-700'}`}>
                        ${paymentMethod ? calculateNet(Number(onboardingClient.payment_amount), paymentMethod).toLocaleString() : '---'}
                     </span>
                  </div>

                  {paymentMethod === 'cashapp' && (
                     <div className="mt-4 flex gap-2 items-start bg-orange-950/20 border border-orange-900/50 p-3 rounded-lg">
                       <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                       <p className="text-[9px] uppercase font-black text-orange-400 leading-relaxed tracking-widest">Warning: CashApp enforces a massive 30% extraction fee. Profit hit is highly significant.</p>
                     </div>
                  )}
                </div>

                {/* File Uploads */}
                <div className="flex flex-col gap-4">
                  <label className="block bg-zinc-900 border border-zinc-800 rounded-xl p-4 cursor-pointer hover:bg-zinc-800 transition-colors">
                     <span className="text-[9px] uppercase font-black tracking-widest text-zinc-500 block mb-2">Payment Proof (Receipt)</span>
                     <div className="flex items-center gap-3">
                       <UploadCloud className={`w-5 h-5 ${proofFile ? 'text-[#1D9E75]' : 'text-zinc-600'}`} />
                       <span className={`text-xs font-bold ${proofFile ? 'text-white' : 'text-zinc-600'}`}>{proofFile ? proofFile.name : 'Upload Screenshot / PDF'}</span>
                     </div>
                     <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => setProofFile(e.target.files?.[0] || null)} />
                  </label>

                  <label className="block bg-zinc-900 border border-zinc-800 rounded-xl p-4 cursor-pointer hover:bg-zinc-800 transition-colors">
                     <span className="text-[9px] uppercase font-black tracking-widest text-zinc-500 block mb-2">Before Profile Screenshot</span>
                     <div className="flex items-center gap-3">
                       <UploadCloud className={`w-5 h-5 ${beforeProfileFile ? 'text-[#1D9E75]' : 'text-zinc-600'}`} />
                       <span className={`text-xs font-bold ${beforeProfileFile ? 'text-white' : 'text-zinc-600'}`}>{beforeProfileFile ? beforeProfileFile.name : 'Upload "Dead Profile" Image'}</span>
                     </div>
                     <input type="file" className="hidden" accept="image/*" onChange={(e) => setBeforeProfileFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
             </div>

             <div className="mb-8">
               <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 block mb-3">Gateway Method Used</label>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['paypal', 'zelle', 'cashapp', 'western_union'].map(method => (
                     <button
                       key={method}
                       type="button"
                       onClick={() => setPaymentMethod(method)}
                       className={`py-3 px-4 flex flex-col items-center gap-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${paymentMethod === method ? 'bg-white text-black shadow-lg scale-105 relative z-10' : 'bg-black border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600'}`}
                     >
                        <Wallet className="w-4 h-4" />
                        {method.replace('_', ' ')}
                     </button>
                  ))}
               </div>
             </div>

             <button 
                type="submit" 
                disabled={loadingId === 'onboarding'}
                className="w-full bg-[#1D9E75] text-white font-black uppercase tracking-widest text-xs py-5 rounded-xl hover:bg-[#168260] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:animate-pulse shadow-[0_0_30px_rgba(29,158,117,0.2)]"
             >
               {loadingId === 'onboarding' ? 'Persisting to Ledger...' : 'Commit Financial Onboarding'}
             </button>

           </form>
         ) : (
           <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-zinc-950/30 border border-zinc-900/50 rounded-[2rem] border-dashed">
              <Banknote className="w-16 h-16 text-zinc-800 mb-6" />
              <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Select a pending client to start financial liquidation.</h3>
           </div>
         )}
      </div>

    </div>
  );
}
