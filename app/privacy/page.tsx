import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
    title: "Política de Privacidad - Trend Digital Trade",
    description: "Política de privacidad y protección de datos de Trend Digital Trade",
}

export default function PrivacyPage() {
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
                    Política de Privacidad
                </h1>

                <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="h-6 w-6 text-pink-500" />
                            <h2 className="text-2xl font-semibold text-white">1. Información que Recopilamos</h2>
                        </div>
                        <p>
                            En Trend Digital Trade, recopilamos la siguiente información:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li><strong>Información de cuenta:</strong> Nombre, correo electrónico, y datos de perfil</li>
                            <li><strong>Información de pago:</strong> Datos de transacciones (procesados de forma segura por nuestros proveedores)</li>
                            <li><strong>Información de uso:</strong> Datos sobre cómo utiliza nuestros servicios</li>
                            <li><strong>Información técnica:</strong> Dirección IP, tipo de navegador, sistema operativo</li>
                        </ul>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Database className="h-6 w-6 text-purple-500" />
                            <h2 className="text-2xl font-semibold text-white">2. Cómo Usamos su Información</h2>
                        </div>
                        <p>
                            Utilizamos la información recopilada para:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>Proporcionar y mejorar nuestros servicios</li>
                            <li>Procesar sus pedidos y pagos</li>
                            <li>Comunicarnos con usted sobre su cuenta y servicios</li>
                            <li>Enviar actualizaciones y ofertas promocionales (con su consentimiento)</li>
                            <li>Prevenir fraudes y garantizar la seguridad de la plataforma</li>
                            <li>Cumplir con obligaciones legales</li>
                        </ul>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="h-6 w-6 text-blue-500" />
                            <h2 className="text-2xl font-semibold text-white">3. Protección de Datos</h2>
                        </div>
                        <p>
                            Implementamos medidas de seguridad técnicas y organizativas para proteger su información:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>Cifrado SSL/TLS para todas las transmisiones de datos</li>
                            <li>Almacenamiento seguro en servidores protegidos</li>
                            <li>Acceso restringido a datos personales solo para personal autorizado</li>
                            <li>Auditorías de seguridad regulares</li>
                            <li>Cumplimiento con estándares internacionales de protección de datos</li>
                        </ul>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <Eye className="h-6 w-6 text-green-500" />
                            <h2 className="text-2xl font-semibold text-white">4. Compartir Información</h2>
                        </div>
                        <p>
                            No vendemos ni alquilamos su información personal a terceros. Podemos compartir información con:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li><strong>Proveedores de servicios:</strong> Para procesar pagos y entregar servicios</li>
                            <li><strong>Autoridades legales:</strong> Cuando sea requerido por ley</li>
                            <li><strong>Socios comerciales:</strong> Solo con su consentimiento explícito</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Cookies y Tecnologías Similares</h2>
                        <p>
                            Utilizamos cookies y tecnologías similares para:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>Mantener su sesión activa</li>
                            <li>Recordar sus preferencias</li>
                            <li>Analizar el uso de la plataforma</li>
                            <li>Personalizar su experiencia</li>
                        </ul>
                        <p className="mt-4">
                            Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del sitio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Sus Derechos</h2>
                        <p>
                            Usted tiene derecho a:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li><strong>Acceder:</strong> Solicitar una copia de sus datos personales</li>
                            <li><strong>Rectificar:</strong> Corregir información inexacta o incompleta</li>
                            <li><strong>Eliminar:</strong> Solicitar la eliminación de sus datos (derecho al olvido)</li>
                            <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado</li>
                            <li><strong>Oposición:</strong> Oponerse al procesamiento de sus datos</li>
                            <li><strong>Retirar consentimiento:</strong> En cualquier momento</li>
                        </ul>
                        <p className="mt-4">
                            Para ejercer estos derechos, contáctenos en{" "}
                            <a href="mailto:hola@trenddigitaltrade.com" className="text-pink-500 hover:text-pink-400">
                                hola@trenddigitaltrade.com
                            </a>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Retención de Datos</h2>
                        <p>
                            Conservamos su información personal solo durante el tiempo necesario para cumplir con los propósitos descritos en esta política, a menos que la ley requiera o permita un período de retención más largo.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Transferencias Internacionales</h2>
                        <p>
                            Sus datos pueden ser transferidos y procesados en países fuera de su jurisdicción. Garantizamos que estas transferencias cumplan con las leyes de protección de datos aplicables.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">9. Menores de Edad</h2>
                        <p>
                            Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos intencionalmente información de menores. Si descubrimos que hemos recopilado datos de un menor, los eliminaremos de inmediato.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">10. Cambios a esta Política</h2>
                        <p>
                            Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre cambios significativos publicando la nueva política en esta página y actualizando la fecha de "última actualización".
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">11. Contacto</h2>
                        <p>
                            Para preguntas sobre esta Política de Privacidad o el manejo de sus datos:
                        </p>
                        <div className="mt-4 space-y-2">
                            <p>
                                Email:{" "}
                                <a href="mailto:hola@trenddigitaltrade.com" className="text-pink-500 hover:text-pink-400">
                                    hola@trenddigitaltrade.com
                                </a>
                            </p>
                        </div>
                        <p className="text-sm text-slate-500 mt-8 pt-8 border-t border-slate-800">
                            Última actualización: {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
