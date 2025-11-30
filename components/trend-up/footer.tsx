"use client"

import Link from "next/link"
import { Instagram, Twitter, Youtube, Mail } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export default function TrendUpFooter() {
  const { t } = useI18n()

  return (
    <footer className="py-12 bg-slate-950 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Trend Digital Trade
            </h3>
            <p className="text-slate-400 text-sm mt-1">{t.footer.tagline}</p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">
              {t.footer.terms}
            </Link>
            <Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">
              {t.footer.privacy}
            </Link>
            <Link href="/contact" className="text-slate-400 hover:text-white text-sm transition-colors">
              {t.footer.contact}
            </Link>
            <Link href="/login" className="text-slate-400 hover:text-white text-sm transition-colors">
              {t.footer.login}
            </Link>
          </nav>

          {/* Social */}
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 bg-slate-800 hover:bg-pink-500 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-slate-800 hover:bg-blue-500 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-slate-800 hover:bg-red-500 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="mailto:support@trenddigitaltrade.com"
              className="w-10 h-10 bg-slate-800 hover:bg-purple-500 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Trend Digital Trade. {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
