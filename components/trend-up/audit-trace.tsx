import { MotionConfig, motion } from "framer-motion";
import { X, ShieldAlert, Fingerprint, Activity, Lock } from "lucide-react";
import { IntentDeclaration } from "../protocol-calibration";

interface AuditTraceProps {
    data: any; // Diagnosis
    intent?: IntentDeclaration;
    onClose: () => void;
}

export default function AuditTrace({ data, intent, onClose }: AuditTraceProps) {
    if (!data) return null;

    const timestamp = new Date().toISOString();
    const sessionID = "TX-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-2xl bg-[#050505] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="w-4 h-4 text-[#d4af37]" />
                        <span className="font-mono text-xs tracking-widest text-[#d4af37] uppercase">FORENSIC AUDIT RECORD // FINAL</span>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* CONTENT SCROLL */}
                <div className="p-6 overflow-y-auto font-mono text-xs space-y-6 text-gray-400">

                    {/* METADATA */}
                    <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-6">
                        <div>
                            <span className="block text-[10px] uppercase text-gray-600 mb-1">SESSION ID</span>
                            <span className="text-white tracking-wider">{sessionID}</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-[10px] uppercase text-gray-600 mb-1">TIMESTAMP (UTC)</span>
                            <span className="text-white tracking-wider">{timestamp}</span>
                        </div>
                    </div>

                    {/* SECTION 1: DECLARED INTENT (PHASE 61) */}
                    {intent && (
                        <div className="space-y-3">
                            <h3 className="text-[10px] text-[#1877F2] tracking-[0.2em] uppercase flex items-center gap-2">
                                <Fingerprint className="w-3 h-3" />
                                DECLARED INTENT PARAMS
                            </h3>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8 p-4 border border-white/5 bg-white/[0.02]">
                                <div>
                                    <span className="block text-[10px] text-gray-600 uppercase">ASSET NATURE</span>
                                    <span className="text-white uppercase">[{intent.nature || 'N/A'}]</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] text-gray-600 uppercase">TARGET MARKET</span>
                                    <span className="text-white uppercase">[{intent.market || 'N/A'}]</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] text-gray-600 uppercase">OBJECTIVE</span>
                                    <span className="text-white uppercase">[{intent.objective || 'N/A'}]</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] text-gray-600 uppercase">COMMITMENT</span>
                                    <span className="text-[#d4af37] uppercase font-bold">[{intent.commitment || 'N/A'}]</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECTION 2: FORENSIC DIAGNOSIS */}
                    <div className="space-y-3">
                        <h3 className="text-[10px] text-[#1877F2] tracking-[0.2em] uppercase flex items-center gap-2">
                            <Activity className="w-3 h-3" />
                            DETECTED SIGNALS
                        </h3>
                        <div className="grid grid-cols-3 gap-4 p-4 border border-white/5 bg-white/[0.02]">
                            <div>
                                <span className="block text-[10px] text-gray-600 uppercase">CLASSIFICATION</span>
                                <span className="text-white uppercase">{data.asset_classification?.type}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] text-gray-600 uppercase">DETECTED STAGE</span>
                                <span className="text-white uppercase">{data.asset_stage?.stage}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] text-gray-600 uppercase">RISK FACTOR</span>
                                <span className={`uppercase font-bold ${data.asset_stage?.dimension_scores?.riesgo > 0.7 ? 'text-red-500' : 'text-green-500'}`}>
                                    {(data.asset_stage?.dimension_scores?.riesgo * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: JUDGMENT */}
                    <div className="space-y-3">
                        <h3 className="text-[10px] text-[#1877F2] tracking-[0.2em] uppercase flex items-center gap-2">
                            <Lock className="w-3 h-3" />
                            ENGINE JUDGMENT
                        </h3>
                        <div className="p-4 border border-white/10 bg-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] text-gray-500 uppercase">ASSIGNED TIER</span>
                                <span className="text-[#d4af37] font-bold tracking-widest uppercase">
                                    {data.intervention_decision?.tier || 'RESTRICTED'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-gray-500 uppercase">PROTOCOL LABEL</span>
                                <span className="text-white font-mono uppercase text-xs">
                                    {data.intervention_decision?.label || 'UNKNOWN'}
                                </span>
                            </div>
                            {data.intervention_decision?.reason && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <span className="block text-[10px] text-gray-600 uppercase mb-1">RATIONALE</span>
                                    <p className="text-gray-300 italic">"{data.intervention_decision.reason}"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-center pt-6 space-y-2 opacity-50">
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <p className="text-[8px] uppercase tracking-[0.3em]">Bureau of Digital Intelligence // Audit V1.2</p>
                    </div>

                </div>
            </div>
        </div>
    );
}
