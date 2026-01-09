"use client";

import { AnalyzerProvider, useAnalyzer } from "./context";
import AccessControl from "./step-00-access";
import AssetValidation from "./step-01-validation";
import VerificationStatus from "./step-02-status";
import EliteNiche from "./step-03-niche";
import AlgorithmicHealth from "./step-04-health";
import ScaleAmbition from "./step-05-ambition";
import AudienceSegmentation from "./step-06-segmentation";
import Processing from "./step-07-processing";
import FinalGate from "./step-08-gate";

function AnalyzerContent() {
    const { phase } = useAnalyzer();

    return (
        <section className="py-24 bg-[#0B0D10] min-h-screen flex items-center justify-center relative border-t border-[#1F2533]">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-50" />

            <div className="w-full max-w-5xl mx-auto px-6 relative z-10">
                <div className="bg-[#131722] border border-[#1F2533] rounded-sm shadow-2xl min-h-[600px] flex flex-col justify-center p-8 md:p-12 relative overflow-hidden">
                    {/* Decorative Top Line */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A24D]/50 to-transparent" />

                    {phase === "ACCESS" && <AccessControl />}
                    {phase === "VALIDATION" && <AssetValidation />}
                    {phase === "STATUS" && <VerificationStatus />}
                    {phase === "NICHE" && <EliteNiche />}
                    {phase === "HEALTH" && <AlgorithmicHealth />}
                    {phase === "AMBITION" && <ScaleAmbition />}
                    {phase === "SEGMENTATION" && <AudienceSegmentation />}
                    {phase === "PROCESSING" && <Processing />}
                    {phase === "GATE" && <FinalGate />}
                </div>
            </div>
        </section>
    );
}

export default function Analyzer() {
    return (
        <AnalyzerProvider>
            <AnalyzerContent />
        </AnalyzerProvider>
    );
}
