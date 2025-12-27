"use client";

import { useState } from "react";
import SovereignEntry from "@/components/sovereign-entry";
import SmartGrowthConsultant from "@/components/trend-up/smart-growth-consultant";
import ProtocolCalibration, { IntentDeclaration } from "@/components/protocol-calibration";
import ProtocolDeepCalibration from "@/components/protocol-deep-calibration";
import { OperatorContext } from "@/app/lib/forensic/intelligence";

export default function Home() {
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const [intent, setIntent] = useState<IntentDeclaration | null>(null);
  const [operatorContext, setOperatorContext] = useState<OperatorContext | null>(null);
  const [lang, setLang] = useState<'EN' | 'ES' | 'PT'>('EN');

  // 1. ENTRY PHASE
  if (!activeHandle) {
    return (
      <main className="h-screen w-full bg-black text-slate-300 font-mono flex flex-col relative overflow-hidden selection:bg-[#d4af37] selection:text-black">
        <SovereignEntry onExecute={setActiveHandle} lang={lang} setLang={setLang} />
      </main>
    );
  }

  // 2. CALIBRATION PHASE (Phase 61)
  if (!intent) {
    return (
      <main className="h-screen w-full bg-[#050505] font-mono relative overflow-hidden">
        <ProtocolCalibration onComplete={setIntent} lang={lang} />
      </main>
    );
  }

  // 3. DEEP CALIBRATION PHASE (Phase 65)
  if (!operatorContext) {
    return (
      <main className="h-screen w-full bg-[#050505] font-mono relative overflow-hidden">
        <ProtocolDeepCalibration onComplete={setOperatorContext} />
      </main>
    );
  }

  // 4. ANALYSIS PHASE
  return (
    <main className="h-screen w-full bg-black text-slate-300 font-mono flex flex-col relative overflow-hidden selection:bg-[#d4af37] selection:text-black">
      <SmartGrowthConsultant
        initialHandle={activeHandle}
        initialIntent={intent}
        initialLang={lang}
        initialContext={operatorContext}
      />
    </main>
  );
}
