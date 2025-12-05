import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Mail, MessageSquare, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
    title: "Contacto - Trend Digital Trade",
    description: "Contáctanos para cualquier consulta sobre nuestros servicios",
}

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <Link href="/">
                    <Button variant="ghost" className="mb-8 text-slate-400 hover:text-white">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al inicio
                    </Button>
                </Link>

                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Contáctanos
                </h1>
                <p className="text-slate-400 mb-12 text-lg">
                    Estamos aquí para ayudarte. Elige el canal que prefieras para comunicarte con nosotros.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {/* Email Support */}
                    <Card className="bg-slate-900 border-slate-800 hover:border-pink-500 transition-colors">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 bg-pink-500/20 rounded-lg">
                                    <Mail className="h-6 w-6 text-pink-500" />
                                </div>
                                <CardTitle className="text-white">Email de Soporte</CardTitle>
                            </div>
                            <CardDescription className="text-slate-400">
                                Respuesta en menos de 24 horas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <a
                                href="mailto:support@trenddigitaltrade.com"
                                className="text-pink-500 hover:text-pink-400 font-medium"
                            >
                                support@trenddigitaltrade.com
                            </a>
                            <p className="text-sm text-slate-500 mt-2">
                                Para consultas generales, problemas técnicos y soporte
                            </p>
                        </CardContent>
                    </Card>

                    {/* Sales */}
                    <Card className="bg-slate-900 border-slate-800 hover:border-purple-500 transition-colors">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 bg-purple-500/20 rounded-lg">
                                    <MessageSquare className="h-6 w-6 text-purple-500" />
                                </div>
                                <CardTitle className="text-white">Ventas y Consultas</CardTitle>
                            </div>
                            <CardDescription className="text-slate-400">
                                Información sobre servicios y paquetes
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <a
                                href="mailto:sales@trenddigitaltrade.com"
                                className="text-purple-500 hover:text-purple-400 font-medium"
                            >
                                sales@trenddigitaltrade.com
                            </a>
                            <p className="text-sm text-slate-500 mt-2">
                                Para consultas sobre servicios, precios y paquetes personalizados
                            </p>
                        </CardContent>
                    </Card>

                    {/* Business */}
                    <Card className="bg-slate-900 border-slate-800 hover:border-blue-500 transition-colors">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 bg-blue-500/20 rounded-lg">
                                    <MapPin className="h-6 w-6 text-blue-500" />
                                </div>
                                <CardTitle className="text-white">Alianzas Comerciales</CardTitle>
                            </div>
                            <CardDescription className="text-slate-400">
                                Oportunidades de colaboración
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <a
                                href="mailto:business@trenddigitaltrade.com"
                                className="text-blue-500 hover:text-blue-400 font-medium"
                            >
                                business@trenddigitaltrade.com
                            </a>
                            <p className="text-sm text-slate-500 mt-2">
                                Para propuestas de negocio, alianzas y colaboraciones
                            </p>
                        </CardContent>
                    </Card>

                    {/* Hours */}
                    <Card className="bg-slate-900 border-slate-800 hover:border-green-500 transition-colors">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 bg-green-500/20 rounded-lg">
                                    <Clock className="h-6 w-6 text-green-500" />
                                </div>
                                <CardTitle className="text-white">Horario de Atención</CardTitle>
                            </div>
                            <CardDescription className="text-slate-400">
                                Soporte disponible 24/7
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Lunes - Viernes:</span>
                                    <span className="text-white font-medium">24 horas</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Sábado - Domingo:</span>
                                    <span className="text-white font-medium">24 horas</span>
                                </div>
                                <p className="text-slate-500 mt-4">
                                    Nuestro equipo está disponible en todo momento para asistirte
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* FAQ Link */}
                <Card className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-500/30">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    ¿Tienes una pregunta rápida?
                                </h3>
                                <p className="text-slate-400">
                                    Consulta nuestras preguntas frecuentes para obtener respuestas inmediatas
                                </p>
                            </div>
                            <Link href="/#faq">
                                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                                    Ver FAQ
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Info */}
                <div className="mt-12 p-6 bg-slate-900 rounded-lg border border-slate-800">
                    <h3 className="text-lg font-semibold text-white mb-4">Información Adicional</h3>
                    <div className="space-y-3 text-sm text-slate-400">
                        <p>
                            <strong className="text-white">Tiempo de respuesta promedio:</strong> Menos de 2 horas en horario laboral
                        </p>
                        <p>
                            <strong className="text-white">Idiomas disponibles:</strong> Español, Inglés, Portugués
                        </p>
                        <p>
                            <strong className="text-white">Soporte técnico:</strong> Disponible 24/7 por email
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
