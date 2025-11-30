import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Trend Digital Trade
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Plataforma de servicios digitales con sistema de créditos y comisiones
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white px-8">
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 px-8 bg-transparent"
            >
              Registrarse
            </Button>
          </Link>
        </div>

        <div className="pt-8 grid grid-cols-3 gap-8 max-w-lg mx-auto text-center">
          <div>
            <div className="text-2xl font-bold text-cyan-400">TDT</div>
            <div className="text-xs text-slate-500">Sistema</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">60/40</div>
            <div className="text-xs text-slate-500">Split</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">5%</div>
            <div className="text-xs text-slate-500">Afiliados</div>
          </div>
        </div>
      </div>
    </div>
  )
}
