import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
    title: "Términos y Condiciones - Trend Digital Trade",
    description: "Términos y condiciones de uso de Trend Digital Trade",
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <Link href="/">
                    <Button variant="ghost" className="mb-8 text-slate-400 hover:text-white">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al inicio
                    </Button>
                </Link>

                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Términos y Condiciones
                </h1>

                <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Aceptación de los Términos</h2>
                        <p>
                            Al acceder y utilizar los servicios de Trend Digital Trade (en adelante, "TDT"), usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Descripción del Servicio</h2>
                        <p>
                            TDT es una plataforma de marketing digital que ofrece servicios de crecimiento en redes sociales, incluyendo pero no limitado a:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Seguidores para Instagram, TikTok, YouTube y otras plataformas</li>
                            <li>Likes, comentarios y engagement</li>
                            <li>Visualizaciones de videos</li>
                            <li>Suscriptores y otros servicios de marketing digital</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Uso del Servicio</h2>
                        <p>
                            Al utilizar nuestros servicios, usted se compromete a:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Proporcionar información precisa y actualizada</li>
                            <li>No utilizar los servicios para actividades ilegales o fraudulentas</li>
                            <li>No revender o redistribuir nuestros servicios sin autorización</li>
                            <li>Cumplir con los términos de servicio de las plataformas de redes sociales</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Pagos y Reembolsos</h2>
                        <p>
                            <strong>Pagos:</strong> Aceptamos pagos a través de criptomonedas y otros métodos especificados en nuestra plataforma. Todos los precios están en USD.
                        </p>
                        <p className="mt-4">
                            <strong>Reembolsos:</strong> Ofrecemos garantía de entrega. Si un servicio no se completa según lo prometido, puede solicitar un reembolso dentro de los 30 días posteriores a la compra.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Garantías y Limitaciones</h2>
                        <p>
                            Garantizamos la entrega de los servicios contratados. Sin embargo, no podemos garantizar resultados específicos en términos de engagement orgánico o crecimiento a largo plazo.
                        </p>
                        <p className="mt-4">
                            TDT no se hace responsable de:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Cambios en los algoritmos de las plataformas de redes sociales</li>
                            <li>Suspensión o cierre de cuentas por parte de las plataformas</li>
                            <li>Pérdida de seguidores debido a factores externos</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Privacidad y Datos</h2>
                        <p>
                            Nos comprometemos a proteger su privacidad. Para más información sobre cómo manejamos sus datos, consulte nuestra{" "}
                            <Link href="/privacy" className="text-pink-500 hover:text-pink-400">
                                Política de Privacidad
                            </Link>
                            .
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Modificaciones del Servicio</h2>
                        <p>
                            TDT se reserva el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio en cualquier momento, con o sin previo aviso.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Contacto</h2>
                        <p>
                            Para cualquier pregunta sobre estos Términos y Condiciones, puede contactarnos en:
                        </p>
                        <p className="mt-2">
                            Email:{" "}
                            <a href="mailto:support@trenddigitaltrade.com" className="text-pink-500 hover:text-pink-400">
                                support@trenddigitaltrade.com
                            </a>
                        </p>
                    </section>

                    <section className="mt-8 pt-8 border-t border-slate-800">
                        <p className="text-sm text-slate-500">
                            Última actualización: {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
