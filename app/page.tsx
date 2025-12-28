"use client";

import { useState } from "react";
import SovereignEntry from "@/components/sovereign-entry";
import SmartGrowthConsultant from "@/components/trend-up/smart-growth-consultant";
import ProtocolCalibration, { IntentDeclaration } from "@/components/protocol-calibration";
import ProtocolDeepCalibration from "@/components/protocol-deep-calibration";
import AssetIdentification from "@/components/asset-identification";
import { OperatorContext } from "@/app/lib/forensic/intelligence";

type AppPhase = 'ENTRY' | 'CALIBRATION' | 'DEEP_CALIBRATION' | 'ASSET_ID' | 'ANALYSIS';

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>('ENTRY');

  // Data State
  const [lang, setLang] = useState<'EN' | 'ES' | 'PT'>('EN');
  const [intent, setIntent] = useState<IntentDeclaration | null>(null);
  const [operatorContext, setOperatorContext] = useState<OperatorContext | null>(null);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);

  // HANDLERS
  const handleEntryComplete = () => setPhase('CALIBRATION');

  const handleCalibrationComplete = (data: IntentDeclaration) => {
    setIntent(data);
    setPhase('DEEP_CALIBRATION');
  };

  const handleDeepComplete = (data: OperatorContext) => {
    setOperatorContext(data);
    setPhase('ASSET_ID');
  };

  const handleAssetComplete = (handle: string) => {
    setActiveHandle(handle);
    setPhase('ANALYSIS');
  };

  // RENDER LOGIC
  return (
    <main className="min-h-screen w-full bg-black text-white font-mono selection:bg-white selection:text-black">
      <SmartGrowthConsultant initialLang="ES" />
    </main>
  );
}
