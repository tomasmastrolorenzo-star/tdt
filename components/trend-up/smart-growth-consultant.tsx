"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, AlertTriangle, Activity, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

// --- TYPES & ENUMS ---
enum CoreStep {
    INPUT = 0,
    FETCHING = 1,
    IDENTITY_VERIFICATION = 2,
    TYPE_CONFIRMATION = 3,
    ASYMMETRY_FINDING = 4,
    ROUTING_OPTIONS = 5,
    MANUAL_FALLBACK = 99
}

interface AnalysisResult {
    username: string
    profilePicUrl?: string
    biography?: string
    asset_type: string // MEDIC, REAL_ESTATE, etc
    confidence: number
    last_post_date: string | null
    narrative_level: string
    routing_target: string
    indicators: any
}

const ASSET_TYPE_OPTIONS = [
    { id: 'MEDIC', label: 'Médico / Clínica' },
    { id: 'REAL_ESTATE', label: 'Real Estate / Inversión' },
    { id: 'ATHLETE', label: 'Deportista / Fitness' },
    { id: 'FOUNDER', label: 'Founder / Tech' },
    { id: 'BROKER', label: 'Broker / Finanzas' },
    { id: 'INFLUENCER', label: 'Marca Personal / Creator' },
    { id: 'OTHER', label: 'Otro' }
];

export default function SmartGrowthConsultant() {
    const router = useRouter()

    // State
    const [step, setStep] = useState<CoreStep>(CoreStep.INPUT)
    const [handle, setHandle] = useState("")
    const [error, setError] = useState("")
    const [data, setData] = useState<AnalysisResult | null>(null)
    const [manualType, setManualType] = useState("")

    // --- ACTIONS ---

    const validateAndStart = async () => {
        if (!handle.startsWith('@')) {
            setError("Error Técnico: Formato de handle inválido. Debe iniciar con @.")
            return
        }
        if (handle.length < 3) {
            setError("Error Técnico: Handle demasiado corto.")
            return
        }
        setError("")
        setStep(CoreStep.FETCHING)

        try {
            const response = await fetch('/api/forensic/instagram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ handle })
            })

            if (!response.ok) throw new Error("API Failure")

            const result = await response.json()

            if (result.status === 'restricted') {
                setStep(CoreStep.MANUAL_FALLBACK)
                return
            }

            setData(result)

            // DELAY 1: Simulate "Localizing..." for 1.5s then show Identity
            setTimeout(() => {
                setStep(CoreStep.IDENTITY_VERIFICATION)
            }, 1500)

        } catch (e) {
            console.error(e)
            setStep(CoreStep.MANUAL_FALLBACK)
        }
    }

    const confirmIdentity = () => {
        if (!data) return

        // Logic: If confidence is low, go to Manual Type Selection
        if (data.confidence < 0.4 || data.asset_type === 'OTHER') {
            setStep(CoreStep.TYPE_CONFIRMATION)
        } else {
            // High confidence -> Asymmetry
            setTimeout(() => setStep(CoreStep.ASYMMETRY_FINDING), 500)
        }
    }

    const selectManualType = (typeId: string) => {
        setManualType(typeId)
        // Update local data context
        if (data) data.asset_type = typeId
        setStep(CoreStep.ASYMMETRY_FINDING)
    }

    const goToRouting = () => {
        setStep(CoreStep.ROUTING_OPTIONS)
    }

    const handleRouteAction = (action: string) => {
        // Simple routing mapping
        const routeValues: any = {
            'CHECKOUT': '/checkout?product=audit_protocol',
            'VSL': '/briefing/logic-v2',
            'APPLICATION': '/apply/consultant',
            'WAITLIST': '/waitlist',
        }
        // Default to VSL or user choice logic
        // For Core V1, we map the backend routing_target to a URL
        const target = data?.routing_target || 'CHECKOUT';
        const url = routeValues[target] || '/checkout?product=audit_protocol';
        router.push(url);
    }


    // --- RENDERERS ---

    // 1. INPUT
    if (step === CoreStep.INPUT) {
        return (
            <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in">
                <div className="bg-[#02040a] border border-white/10 p-2 flex items-center gap-4 rounded-lg focus-within:border-[#d4af37]/50 transition-colors">
                    <input
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        placeholder="@usuario_instagram"
                        className="bg-transparent border-none text-white font-mono text-lg py-3 w-full focus:ring-0 placeholder:text-slate-700 outline-none text-center"
                        onKeyDown={(e) => e.key === 'Enter' && validateAndStart()}
                    />
                </div>
                {error && <p className="text-[10px] text-red-500 font-mono text-center uppercase tracking-widest">{error}</p>}

                <button
                    onClick={validateAndStart}
                    className="w-full bg-[#d4af37] hover:bg-white text-black transition-colors py-4 font-mono text-xs uppercase tracking-[0.2em] font-bold"
                >
                    INICIAR DIAGNÓSTICO DE ARQUITECTURA
                </button>
            </div>
        )
    }

    // 2. FETCHING
    if (step === CoreStep.FETCHING) {
        return (
            <div className="w-full max-w-md mx-auto text-center space-y-4">
                <div className="inline-block animate-spin duration-1000">
                    <Activity className="w-6 h-6 text-[#d4af37]" />
                </div>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest animate-pulse">
                    Estableciendo enlace forense...
                </p>
            </div>
        )
    }

    // 3. IDENTITY VERIFICATION (SCREENER REAL)
    if (step === CoreStep.IDENTITY_VERIFICATION && data) {
        const lastDate = data.last_post_date ? new Date(data.last_post_date).toLocaleDateString() : 'N/A';

        return (
            <div className="w-full max-w-md mx-auto bg-[#02040a] border border-white/10 p-6 space-y-8 animate-in zoom-in-95 duration-500">
                <div className="flex items-center gap-6 border-b border-white/5 pb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10">
                        {data.profilePicUrl && <img src={`https://wsrv.nl/?url=${encodeURIComponent(data.profilePicUrl)}`} className="w-full h-full object-cover grayscale" />}
                    </div>
                    <div className="text-left space-y-1">
                        <div className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Identidad Localizada</div>
                        <div className="text-lg text-white font-mono">@{data.username}</div>
                        <div className="text-[9px] text-[#d4af37] font-mono uppercase">Última Emisión: {lastDate}</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-xs text-slate-400 font-mono leading-relaxed">
                        Sistema listo para auditar arquitectura de autoridad. Confirme identidad para proceder.
                    </p>
                    <button
                        onClick={confirmIdentity}
                        className="w-full bg-slate-100 hover:bg-white text-black py-3 font-mono text-xs uppercase tracking-widest font-bold"
                    >
                        CONFIRMAR ACTIVO
                    </button>
                </div>
            </div>
        )
    }

    // 3b. TYPE CONFIRMATION (Fallback)
    if (step === CoreStep.TYPE_CONFIRMATION) {
        return (
            <div className="w-full max-w-md mx-auto bg-[#02040a] border border-white/10 p-6 space-y-6 animate-in fade-in">
                <p className="text-xs text-slate-400 font-mono text-center uppercase tracking-widest">
                    Clasificación Forense Requerida
                </p>
                <div className="grid grid-cols-1 gap-2">
                    {ASSET_TYPE_OPTIONS.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => selectManualType(opt.id)}
                            className="text-left px-4 py-3 border border-white/5 hover:border-[#d4af37]/50 text-slate-300 hover:text-white font-mono text-xs transition-colors"
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    // 4. ASYMMETRY FINDING
    if (step === CoreStep.ASYMMETRY_FINDING && data) {
        return (
            <div className="w-full max-w-lg mx-auto bg-[#02040a] border border-white/10 p-8 space-y-8 animate-in slide-in-from-bottom-5 duration-700">
                <div className="flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-[#d4af37] opacity-80" />
                </div>

                <div className="text-center space-y-2">
                    <h3 className="text-lg font-serif italic text-white">Asimetría Estructural Detectada</h3>
                    <div className="w-12 h-[1px] bg-[#d4af37]/50 mx-auto" />
                </div>

                <p className="text-sm font-mono text-slate-400 leading-relaxed text-justify border-l-2 border-[#d4af37]/20 pl-4">
                    El activo proyecta una autoridad superior a su capacidad actual de captura de valor. Se detecta "Lucro Cesante" en la brecha entre el posicionamiento visible ({data.asset_type}) y la infraestructura de conversión.
                </p>

                <div className="pt-4">
                    <button
                        onClick={goToRouting}
                        className="w-full bg-transparent border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black py-4 font-mono text-xs uppercase tracking-[0.2em] transition-all"
                    >
                        VER PROTOCOLO DE CORRECCIÓN
                    </button>
                </div>
            </div>
        )
    }

    // 5. ROUTING OPTIONS
    if (step === CoreStep.ROUTING_OPTIONS && data) {
        return (
            <div className="w-full max-w-lg mx-auto bg-[#02040a] border border-white/10 p-8 space-y-8 animate-in fade-in">
                <div className="text-center space-y-2">
                    <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest">Protocolo Asignado</h3>
                    <h2 className="text-xl font-serif text-white italic">{data.ux.title}</h2>
                </div>

                <div className="space-y-4 border-t border-white/5 pt-8">
                    <p className="text-xs font-mono text-slate-400 mb-4">Opciones de Ejecución:</p>

                    {/* Primary Option */}
                    <button
                        onClick={() => handleRouteAction('primary')}
                        className="w-full flex items-center justify-between p-4 bg-[#d4af37] text-black hover:bg-white transition-colors group"
                    >
                        <span className="font-mono text-xs uppercase font-bold tracking-widest">01 / Ejecución Inmediata</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Secondary Option (Info) */}
                    <button
                        onClick={() => handleRouteAction('secondary')}
                        className="w-full flex items-center justify-between p-4 border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-colors"
                    >
                        <span className="font-mono text-xs uppercase tracking-widest">02 / Briefing Técnico (VSL)</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="text-center pt-8">
                    <p className="text-[9px] text-slate-600 font-mono uppercase">
                        Vortex Intelligence // System Core
                    </p>
                </div>
            </div>
        )
    }

    // 99. MANUAL FALLBACK
    if (step === CoreStep.MANUAL_FALLBACK) {
        return (
            <div className="w-full max-w-md mx-auto bg-[#02040a] border border-white/10 p-8 space-y-6 text-center animate-in fade-in">
                <Lock className="w-8 h-8 text-red-900/50 mx-auto" />
                <div className="space-y-2">
                    <h3 className="text-white font-mono text-sm uppercase">Acceso Restringido</h3>
                    <p className="text-xs text-slate-500 font-mono">
                        La capa pública del activo no permite lectura remota o no existe.
                    </p>
                </div>
                <button
                    onClick={() => setStep(CoreStep.INPUT)}
                    className="text-[#d4af37] font-mono text-xs uppercase underline tracking-widest"
                >
                    Intentar con otro activo
                </button>
            </div>
        )
    }

    return null
}
