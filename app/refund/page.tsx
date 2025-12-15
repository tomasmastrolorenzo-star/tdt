import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RefundPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 md:py-24">
            <div className="container px-4 md:px-6 max-w-4xl mx-auto">
                <Link href="/">
                    <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-orange-500 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al Inicio
                    </Button>
                </Link>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Política de Reembolso</h1>
                    <p className="text-slate-500 mb-8">Última actualización: 14 de Diciembre, 2025</p>

                    <div className="prose prose-slate max-w-none space-y-8 text-slate-600">
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">1. Visión General</h2>
                            <p>
                                En Trend Digital Trade (TDT), nos esforzamos por garantizar la satisfacción total de nuestros clientes.
                                Debido a la naturaleza de nuestros servicios digitales (bienes intangibles), ofrecemos reembolsos bajo condiciones específicas detalladas a continuación.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">2. Elegibilidad para Reembolso</h2>
                            <p>Usted es elegible para solicitar un reembolso total o parcial en los siguientes casos:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li><strong>Servicio no entregado:</strong> Si el servicio no ha comenzado a entregarse dentro de las 72 horas posteriores a la compra.</li>
                                <li><strong>Servicio incompleto:</strong> Si la cantidad entregada es menor a la contratada y no podemos completar el pedido en un plazo razonable.</li>
                                <li><strong>Servicio no conforme:</strong> Si el servicio entregado difiere sustancialmente de la descripción en nuestro sitio web.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">3. Casos No Reembolsables</h2>
                            <p>No se otorgarán reembolsos en las siguientes situaciones:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li><strong>Cambio de opinión:</strong> Una vez que el pedido ha sido procesado y enviado al servidor.</li>
                                <li><strong>Cuenta privada:</strong> Si su perfil/cuenta está en modo "Privado" durante la entrega.</li>
                                <li><strong>Error en la información:</strong> Si proporcionó un enlace incorrecto o un nombre de usuario mal escrito.</li>
                                <li><strong>Violación de Términos:</strong> Si su cuenta viola nuestros Términos de Servicio o los de la plataforma social correspondiente.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">4. Garantía de Reposición (Refill)</h2>
                            <p>
                                La mayoría de nuestros servicios incluyen una garantía de reposición de 30 días. Si nota una disminución (drop) en los seguidores/likes entregados:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>Contáctenos con su ID de orden.</li>
                                <li>Repondremos la cantidad perdida sin costo adicional durante el período de garantía.</li>
                                <li>Esto no cuenta como un reembolso monetario, sino como una garantía de servicio.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">5. Proceso de Solicitud</h2>
                            <p>Para solicitar un reembolso, por favor contáctenos a través de:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>Email: <strong>hola@trenddigitaltrade.com</strong></li>
                                <li>WhatsApp: Soporte en vivo</li>
                            </ul>
                            <p className="mt-4">
                                Incluya su número de orden y una descripción detallada del problema. Las solicitudes se procesan en un plazo de 24-48 horas hábiles.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    )
}
