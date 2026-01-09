"use client";

import { useAnalyzer } from "./context";
import { useState } from "react";
import { Lock, FileCheck } from "lucide-react";

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwKHz55cnRkdUc4vLpig4kFWe-eScWwJ40ub9oVvO1jNjTC4S3y8itep4y-VxlFoN5d5Q/exec";

export default function FinalGate() {
    const context = useAnalyzer();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        if (!name || !email) return;
        setSubmitting(true);

        const payload = {
            timestamp: new Date().toISOString(),
            handle: context.handle,
            niche: context.niche,
            verification_status: context.verificationStatus,
            health_status: context.healthStatus,
            growth_goal: context.growthGoal,
            geo: context.geo,
            gender: context.gender,
            age: context.age,
            contact_name: name,
            contact_email: email,
            contact_phone: phone,
            source: "TDT_ANALYZER_V5"
        };

        try {
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // Assume success (no-cors)
            setSuccess(true);
        } catch (e) {
            console.error(e);
            setSuccess(true); // Fallback to avoid trapping user
        }
    };

    if (success) return (
        <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in-95 duration-500 min-h-[400px] text-center">
            <div className="w-20 h-20 bg-[#2ECC71]/10 rounded-full flex items-center justify-center border border-[#2ECC71]/30">
                <FileCheck className="w-10 h-10 text-[#2ECC71]" />
            </div>
            <div className="space-y-4">
                <h3 className="text-2xl font-serif text-[#E6E8EC]">Solicitud Confirmada</h3>
                <p className="text-[#9AA4B2] max-w-md mx-auto leading-relaxed">
                    Su Blueprint de Autoridad ha sido agendado para despacho. <br />
                    Un consultor senior revisará su caso en las próximas 24 horas.
                </p>
            </div>
            <button
                onClick={() => window.location.reload()}
                className="text-[#C9A24D] text-xs font-mono uppercase tracking-widest hover:underline"
            >
                Volver al inicio
            </button>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500 max-w-md mx-auto">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1 border border-[#C9A24D]/30 bg-[#C9A24D]/5 rounded-full text-[#C9A24D] text-[10px] uppercase tracking-widest mb-4">
                    <Lock className="w-3 h-3" /> Protocolo Completado
                </div>
                <h3 className="text-2xl font-semibold text-[#E6E8EC]">Entrega Privada</h3>
                <p className="text-[#9AA4B2] text-sm leading-relaxed">
                    El Blueprint de Autoridad de su activo está listo para ser despachado.
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="text-[10px] text-[#C9A24D] font-mono uppercase tracking-widest mb-2 block">Nombre</label>
                    <input
                        value={name} onChange={e => setName(e.target.value)}
                        className="w-full bg-[#0B0D10] border border-[#1F2533] text-[#E6E8EC] p-4 outline-none focus:border-[#C9A24D] transition-colors placeholder:text-[#9AA4B2]/20"
                        placeholder="NOMBRE COMPLETO"
                    />
                </div>
                <div>
                    <label className="text-[10px] text-[#C9A24D] font-mono uppercase tracking-widest mb-2 block">Email Corporativo</label>
                    <input
                        value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full bg-[#0B0D10] border border-[#1F2533] text-[#E6E8EC] p-4 outline-none focus:border-[#C9A24D] transition-colors placeholder:text-[#9AA4B2]/20"
                        placeholder="EMAIL"
                    />
                </div>
                <div>
                    <label className="text-[10px] text-[#C9A24D] font-mono uppercase tracking-widest mb-2 block">WhatsApp (Opcional)</label>
                    <input
                        value={phone} onChange={e => setPhone(e.target.value)}
                        className="w-full bg-[#0B0D10] border border-[#1F2533] text-[#E6E8EC] p-4 outline-none focus:border-[#C9A24D] transition-colors placeholder:text-[#9AA4B2]/20"
                        placeholder="+54 9 ..."
                    />
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={submitting || !name || !email}
                className="w-full bg-[#C9A24D] text-[#0B0D10] h-14 font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#b08d44] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {submitting ? "Enviando..." : "Solicitar propuesta privada"}
            </button>

            <div className="text-center">
                <p className="text-[10px] text-[#9AA4B2]/40 font-mono uppercase tracking-widest">
                    No estoy dejando datos. Estoy autorizando una entrega.
                </p>
            </div>
        </div>
    );
}
