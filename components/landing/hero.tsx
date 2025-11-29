import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-32">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            <div className="container relative z-10 mx-auto px-4 text-center">
                <div className="mx-auto max-w-3xl space-y-8">
                    <div className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-400 backdrop-blur-xl">
                        <span className="flex h-2 w-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
                        Nuevo Sistema TDT v2 Disponible
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent pb-2">
                        Domina las Redes Sociales con <span className="text-cyan-500">Trend Digital Trade</span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg text-slate-400">
                        La plataforma líder para potenciar tu presencia digital. Servicios automatizados, entrega instantánea y los mejores precios del mercado.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link href="/register">
                            <Button size="lg" className="h-12 bg-cyan-600 px-8 text-lg hover:bg-cyan-500 shadow-lg shadow-cyan-500/20">
                                Comenzar Ahora <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="#pricing">
                            <Button size="lg" variant="outline" className="h-12 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                                Ver Precios
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-cyan-500" /> Entrega Automática
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-cyan-500" /> Soporte 24/7
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-cyan-500" /> Pagos Seguros
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
