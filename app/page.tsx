"use client";

import { useState } from "react";
import SovereignEntry from "@/components/sovereign-entry";
import SmartGrowthConsultant from "@/components/trend-up/smart-growth-consultant";
import ProtocolCalibration, { IntentDeclaration } from "@/components/ProtocolCalibration";

export default function Home() {
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const [intent, setIntent] = useState<IntentDeclaration | null>(null);

  // 1. ENTRY PHASE
  if (!activeHandle) {
    return (
      <main className="h-screen w-full bg-black text-slate-300 font-mono flex flex-col relative overflow-hidden selection:bg-[#d4af37] selection:text-black">
        <SovereignEntry onExecute={setActiveHandle} />
      </main>
    );
  }

  // 2. CALIBRATION PHASE (Phase 61)
  if (!intent) {
    return (
      <main className="h-screen w-full bg-[#050505] font-mono relative overflow-hidden">
        <ProtocolCalibration onComplete={setIntent} />
      </main>
    );
  }

  // 3. ANALYSIS PHASE
  return (
    <main className="h-screen w-full bg-black text-slate-300 font-mono flex flex-col relative overflow-hidden selection:bg-[#d4af37] selection:text-black">
      <SmartGrowthConsultant initialHandle={activeHandle} initialIntent={intent} />
    </main>
  );
}
