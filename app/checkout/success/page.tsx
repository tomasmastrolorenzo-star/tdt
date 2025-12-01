"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, Mail, MessageCircle, ArrowRight, Sparkles, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function SuccessContent() {
    const searchParams = useSearchParams()
    const [orderId, setOrderId] = useState("")
    const [email, setEmail] = useState("")

    useEffect(() => {
        // Simulate generating an order ID if one isn't provided
        const id = searchParams.get("order_id") || `TDT-${Math.floor(Math.random() * 1000000)}`
        setOrderId(id)
        setEmail(searchParams.get("email") || "tu correo")
    }, [searchParams])

    const handleCopyOrderId = () => {
        navigator.clipboard.writeText(orderId)
        // Could add a toast notification here
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
                {/* Header with Success Animation */}
                <div className="bg-green-500 p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <Sparkles className="w-full h-full text-white animate-pulse" />
                    </div>

                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                            ¡Orden Confirmada!
                        </h1>
                        <p className="text-green-100 text-lg">
                            Tu crecimiento en Instagram está por comenzar
                        </p>
                    </div>
                </div>

                {/* Order Details */}
                <div className="p-8 md:p-12 space-y-8">
                    <div className="text-center space-y-2">
                        <p className="text-slate-500 uppercase tracking-wide text-xs font-bold">
                            ID de Orden
                        </p>
                        <button
                            onClick={handleCopyOrderId}
                            className="text-2xl font-mono font-bold text-slate-900 flex items-center justify-center gap-2 hover:text-orange-500 transition-colors"
                        >
                            {orderId}
                            <Copy className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>

                    {/* Next Steps Timeline */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-2">
                            ¿Qué sigue ahora?
                        </h3>

                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                                    1
                                </div>
                                <div className="w-0.5 h-full bg-slate-100 my-1"></div>
                            </div>
                            <div className="pb-6">
                                <h4 className="font-bold text-slate-900 mb-1">Revisa tu Email</h4>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Enviamos un recibo y detalles a <span className="font-bold text-slate-900">{email}</span>.
                                    Si no lo ves, revisa la carpeta de Spam.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                    2
                                </div>
                                <div className="w-0.5 h-full bg-slate-100 my-1"></div>
                            </div>
                            <div className="pb-6">
                                <h4 className="font-bold text-slate-900 mb-1">Activación del Servicio</h4>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Nuestro sistema de IA está analizando tu perfil. Verás los primeros resultados en las próximas 1-12 horas.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm">
                                    3
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Soporte Prioritario</h4>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    ¿Tienes preguntas? Tu ID de orden te da acceso a soporte VIP.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid md:grid-cols-2 gap-4 pt-4">
                        <Button
                            onClick={() => window.open('https://wa.me/5491234567890', '_blank')}
                            className="w-full bg-white border-2 border-slate-200 text-slate-700 hover:border-green-500 hover:text-green-600 hover:bg-green-50 h-14 rounded-xl font-bold text-base"
                        >
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Contactar Soporte
                        </Button>

                        <Link href="/" className="w-full">
                            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white h-14 rounded-xl font-bold text-base">
                                Volver al Inicio
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    )
}
