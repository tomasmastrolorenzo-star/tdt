import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400">
            <div className="container mx-auto px-4 grid gap-8 md:grid-cols-4">
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">TDT Platform</h3>
                    <p className="text-sm">
                        La solución definitiva para el crecimiento en redes sociales. Automatización, seguridad y resultados garantizados.
                    </p>
                </div>

                <div>
                    <h4 className="mb-4 text-sm font-semibold text-white">Servicios</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="#" className="hover:text-cyan-400">Instagram Followers</Link></li>
                        <li><Link href="#" className="hover:text-cyan-400">TikTok Likes</Link></li>
                        <li><Link href="#" className="hover:text-cyan-400">YouTube Views</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="mb-4 text-sm font-semibold text-white">Legal</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="#" className="hover:text-cyan-400">Términos de Servicio</Link></li>
                        <li><Link href="#" className="hover:text-cyan-400">Política de Privacidad</Link></li>
                        <li><Link href="#" className="hover:text-cyan-400">Reembolsos</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="mb-4 text-sm font-semibold text-white">Contacto</h4>
                    <ul className="space-y-2 text-sm">
                        <li>support@trenddigitaltrade.com</li>
                        <li>Telegram: @TDTSupport</li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto mt-12 px-4 text-center text-xs text-slate-600">
                © 2024 Trend Digital Trade. Todos los derechos reservados.
            </div>
        </footer>
    )
}
