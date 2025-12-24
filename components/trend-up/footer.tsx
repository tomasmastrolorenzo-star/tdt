"use client"

import Link from "next/link"

export default function TrendUpFooter() {
  return (
    <footer className="py-20 bg-black border-t border-[#d4af37]/20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12 text-center md:text-left">

          {/* Institutional Branding */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif text-white tracking-tight italic">
              Trend Digital Trade
            </h3>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-[0.2em]">Bureau of Digital Intelligence</span>
              <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Est. 2024 · Geneva / Miami</span>
            </div>
          </div>

          {/* Legal / Custody Links */}
          <div className="flex gap-8">
            <Link href="#" className="text-[10px] font-mono text-slate-500 hover:text-[#d4af37] uppercase tracking-widest transition-colors">
              Authority Custody
            </Link>
            <Link href="#" className="text-[10px] font-mono text-slate-500 hover:text-[#d4af37] uppercase tracking-widest transition-colors">
              Legal Protocol
            </Link>
            <Link href="#" className="text-[10px] font-mono text-slate-500 hover:text-[#d4af37] uppercase tracking-widest transition-colors">
              Secure Access
            </Link>
          </div>

        </div>

        {/* Notarial Seal / Copyright */}
        <div className="mt-16 pt-8 border-t border-[#d4af37]/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">
            © {new Date().getFullYear()} TDT Structure. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2 opacity-30">
            <div className="w-2 h-2 rounded-full border border-white/20" />
            <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
            <span className="text-[9px] font-mono text-slate-500">SYSTEM_ACTIVE</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
