"use client";

import { useState } from "react";
import EntryProtocol from "@/app/components/EntryProtocol";
import SmartGrowthConsultant from "@/components/trend-up/smart-growth-consultant";

export default function Home() {
  const [activeHandle, setActiveHandle] = useState<string | null>(null);

  return (
    <main className="h-screen w-full bg-black text-slate-300 font-mono flex flex-col relative overflow-hidden selection:bg-[#d4af37] selection:text-black">

      {/* PHASE 60: STATE MANAGER */}
      {!activeHandle ? (
        <EntryProtocol onExecute={setActiveHandle} />
      ) : (
        <SmartGrowthConsultant initialHandle={activeHandle} />
      )}

    </main>
  );
}
