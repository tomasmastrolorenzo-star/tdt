"use client";

import { useEffect, useState } from "react";
import { useAnalyzer } from "./context";
import { AlertTriangle, Check, Loader2, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function AssetValidation() {
    const { handle, setProfileData, setPhase, addLog } = useAnalyzer();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!handle) return;
            addLog(`INICIANDO PROTOCOLO DE VALIDACIÓN: ${handle.toUpperCase()}`);

            try {
                const res = await fetch('/api/forensic/instagram', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ handle: handle.trim(), mode: 'preview' })
                });

                if (!res.ok) throw new Error("Error de conexión con el servidor forense.");

                const data = await res.json();

                // Handle Apify/Server Errors
                if (data.status === 'error') {
                    // Check for "Private Profile" specifically from the API closure
                    if (data.closure?.verdict_code === 'PRIVATE_PROFILE') {
                        // We still want to show the UI for Private, so we construct a mock profile if possible or handle it via UI state
                        // Actually, the API returns 'status: error' for private profiles in preview mode.
                        // We need to handle this gracefully.
                        setError("PRIVATE");
                        setLoading(false);
                        return;
                    }
                    throw new Error(data.closure?.ux_controls?.message || "No se pudo validar el activo.");
                }

                if (!data.profile) throw new Error("Datos de perfil incompletos.");

                setProfileData(data.profile);
                setLoading(false);
                addLog(`ACTIVO VALIDADO: ${data.profile.username}`);

            } catch (err: any) {
                console.error(err);
                setError(err.message || "Error desconocido");
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // RENDER: LOADING (Skeleton)
    if (loading) return (
        <div className="grid md:grid-cols-2 gap-12 items-center animate-in fade-in duration-500 min-h-[400px]">
            {/* Left: Skeleton Profile */}
            <div className="space-y-6">
                <div className="w-32 h-32 rounded-full bg-[#1F2533] animate-pulse mx-auto md:mx-0" />
                <div className="space-y-3">
                    <div className="h-6 w-48 bg-[#1F2533] rounded animate-pulse" />
                    <div className="h-4 w-32 bg-[#1F2533] rounded animate-pulse" />
                </div>
            </div>
            {/* Right: System State */}
            <div className="space-y-6 border-l border-[#1F2533] pl-12 border-dashed h-full flex flex-col justify-center">
                <div className="flex items-center gap-3 text-[#9AA4B2]">
                    <Loader2 className="w-5 h-5 animate-spin text-[#C9A24D]" />
                    <span className="font-mono text-xs tracking-widest uppercase">Validando activo...</span>
                </div>
            </div>
        </div>
    );

    // RENDER: ERROR / PRIVATE
    if (error) return (
        <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in-95 min-h-[400px]">
            <div className={`p-1 rounded-full border-2 ${error === 'PRIVATE' ? 'border-[#E74C3C] bg-[#E74C3C]/10' : 'border-[#F1C40F] bg-[#F1C40F]/10'}`}>
                {error === 'PRIVATE' ? <Lock className="w-12 h-12 text-[#E74C3C] m-4" /> : <AlertTriangle className="w-12 h-12 text-[#F1C40F] m-4" />}
            </div>
            <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-[#E6E8EC] uppercase tracking-wide">
                    {error === 'PRIVATE' ? 'ACCESO RESTRINGIDO' : 'ERROR DE VALIDACIÓN'}
                </h3>
                <p className="text-[#9AA4B2] text-sm font-mono max-w-md mx-auto">
                    {error === 'PRIVATE' ? 'El activo debe ser público para continuar el análisis.' : error}
                </p>
            </div>
            <button
                onClick={() => setPhase("ACCESS")}
                className="px-8 py-3 bg-[#1F2533] text-[#E6E8EC] border border-[#E6E8EC]/10 hover:bg-[#252b3b] font-mono text-xs uppercase tracking-widest transition-colors"
            >
                Reiniciar Proceso
            </button>
        </div>
    );

    // RENDER: SUCCESS (Public Profile)
    return (
        <div className="grid md:grid-cols-2 gap-12 items-center animate-in fade-in slide-in-from-right-8 duration-500 min-h-[400px]">
            {/* Left: Profile Data */}
            <div className="flex flex-col items-center md:items-start space-y-6">
                <div className="relative">
                    {/* Public Ring Status */}
                    <div className="absolute -inset-2 rounded-full border border-[#2ECC71] opacity-50 animate-pulse" />
                    <img
                        src={`https://wsrv.nl/?url=${encodeURIComponent(useAnalyzer().profileData?.profilePicUrl || "")}`}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-[#131722] relative z-10"
                    />
                </div>
                <div className="text-center md:text-left space-y-1">
                    <h3 className="text-2xl font-bold text-[#E6E8EC]">
                        @{useAnalyzer().profileData?.username}
                    </h3>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-mono text-[#9AA4B2]">
                        <span>{(useAnalyzer().profileData?.followersCount || 0).toLocaleString()} Followers</span>
                        <span className="text-[#1F2533]">|</span>
                        <span>{(useAnalyzer().profileData?.followsCount || 0).toLocaleString()} Following</span>
                    </div>
                </div>
            </div>

            {/* Right: System State */}
            <div className="border-l border-[#1F2533] pl-12 border-dashed space-y-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#2ECC71] rounded-full" />
                        <span className="text-[#2ECC71] font-mono text-xs uppercase tracking-widest font-bold">ACTIVO PÚBLICO VERIFICADO</span>
                    </div>
                    <p className="text-[#9AA4B2] text-sm leading-relaxed">
                        Se han detectado vectores de datos legibles. <br />
                        El protocolo puede proceder a la extracción.
                    </p>
                </div>

                <button
                    onClick={() => setPhase("STATUS")}
                    className="w-full px-6 py-4 bg-[#1F2533] border border-[#2ECC71]/30 text-[#2ECC71] hover:bg-[#2ECC71]/10 font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-between group"
                >
                    Confirmar Identidad
                    <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </div>
    );
}
