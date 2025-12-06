"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Check, Sparkles, Shield, CreditCard, Bitcoin, MessageCircle, Lock, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { allServices, platforms } from "@/lib/trend-up/packages"
import { useI18n } from "@/lib/i18n/context"

function ServiceCheckoutContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { formatPrice } = useI18n()

    const [loading, setLoading] = useState(true)
    const [serviceData, setServiceData] = useState<any>(null)
    const [paymentMethod, setPaymentMethod] = useState<"crypto" | "manual">("crypto")

    // User Input State
    const [email, setEmail] = useState("")
    const [link, setLink] = useState("") // Username or Link depending on service
    const [segmentation, setSegmentation] = useState("") // New field for target audience/location

    // Get params
    const platformId = searchParams.get("platform")
    const serviceType = searchParams.get("service")
    const packageId = searchParams.get("package")

    useEffect(() => {
        if (platformId && serviceType && packageId) {
            // Find the package
            const platformServices = allServices[platformId as keyof typeof allServices]
            if (platformServices) {
                const services = platformServices[serviceType as keyof typeof platformServices] as any[]
                const foundPackage = services?.find(p => p.id === packageId)

                if (foundPackage) {
                    setServiceData({
                        ...foundPackage,
                        platformId,
                        serviceType
                    })
                }
            }
        }
        setLoading(false)
    }, [platformId, serviceType, packageId])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!serviceData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Paquete no encontrado</h1>
                <Button onClick={() => router.push("/servicios")}>Volver a Servicios</Button>
            </div>
        )
    }

    const cryptoDiscount = paymentMethod === "crypto" ? serviceData.price * 0.1 : 0
    const total = serviceData.price - cryptoDiscount

    const handleCheckout = () => {
        if (!email || !link) {
            alert("Por favor completa todos los campos")
            return
        }

        const orderId = `ORD-${Math.floor(Math.random() * 100000)}`

        if (paymentMethod === "crypto") {
            // Simulate Crypto Payment Redirect
            console.log("Processing crypto payment:", {
                total,
                service: serviceData.name || `${serviceData.amount} ${serviceData.serviceType}`,
                email,
                link,
                segmentation,
                japServiceId: serviceData.japServiceId
            })

            // Redirect to success page with params
            // Also redirect to success for demo flow
            const params = new URLSearchParams({
                order_id: orderId,
                email: email,
                service: serviceData.name || `${serviceData.amount} ${serviceData.serviceType}`,
                amount: serviceData.amount?.toString() || serviceData.followers?.toString(),
                price: formatPrice(total),
                jap_id: serviceData.japServiceId || "",
                link: link
            })
            router.push(`/checkout/success?${params.toString()}`)
        } else {
            // Manual Payment (WhatsApp)
            const segmentationText = segmentation ? `\n📍 Segmentación: ${segmentation}` : ""
            const message = `Hola! Quiero contratar el servicio: ${serviceData.name} (${serviceData.amount} ${serviceData.serviceType}) por $${formatPrice(total)}.\n🔗 Link: ${link}\n📧 Email: ${email}${segmentationText}`

            window.open(`https://wa.me/5492212235170?text=${encodeURIComponent(message)}`, '_blank')

            // Redirect to success/pending
            const params = new URLSearchParams({
                order_id: orderId,
                email: email,
                service: serviceData.name || `${serviceData.amount} ${serviceData.serviceType}`,
                amount: serviceData.amount?.toString() || serviceData.followers?.toString(),
                price: formatPrice(total),
                jap_id: serviceData.japServiceId || "",
                link: link,
                status: 'pending' // Indicate pending payment
            })
            router.push(`/checkout/success?${params.toString()}`)
        }
    }

    const getInputLabel = () => {
        if (serviceData.serviceType === "followers" || serviceData.serviceType === "subscribers") {
            return "Nombre de usuario / Link del canal"
        }
        return "Link de la publicación / video"
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
                            <Sparkles className="w-6 h-6 text-orange-500" />
                            <span className="font-bold text-xl">TDT</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span>Pago 100% Seguro</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left Column: Details & Input */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 mb-2">Finalizar Compra</h1>
                                <p className="text-slate-600">Completa tus datos para recibir el servicio.</p>
                            </div>

                            {/* Service Summary Card */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${platforms.find(p => p.id === serviceData.platformId)?.color || "from-slate-500 to-slate-700"
                                        } text-white`}>
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 capitalize">
                                            {serviceData.platformId} {serviceData.serviceType}
                                        </h3>
                                        <p className="text-slate-500">
                                            {serviceData.amount || serviceData.followers} {serviceData.unit || "cantidad"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-2 border-t border-slate-100 pt-4">
                                    <span className="text-3xl font-black text-slate-900">
                                        {formatPrice(serviceData.price)}
                                    </span>
                                    {serviceData.originalPrice && (
                                        <span className="text-slate-400 line-through text-sm">
                                            {formatPrice(serviceData.originalPrice)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Input Fields */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-2">
                                        Tu Email (para confirmación)
                                    </label>
                                    <Input
                                        type="email"
                                        placeholder="ejemplo@correo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-2">
                                        {getInputLabel()}
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder={serviceData.serviceType === "followers" ? "@usuario" : "https://..."}
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                        className="h-12"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        Asegúrate de que la cuenta sea pública.
                                    </p>
                                </div>

                                {/* Target Audience / Segmentation Input */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-2">
                                        País / Ubicación del público (Opcional)
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Ej: Estados Unidos, España, México..."
                                        value={segmentation}
                                        onChange={(e) => setSegmentation(e.target.value)}
                                        className="h-12"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        Ayúdanos a segmentar mejor tu audiencia (si aplica).
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Payment */}
                        <div className="space-y-6">
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                                <h3 className="font-bold text-slate-900 mb-4">Método de Pago</h3>

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <button
                                        onClick={() => setPaymentMethod("crypto")}
                                        className={`relative p-4 rounded-xl border-2 transition-all ${paymentMethod === "crypto"
                                            ? "border-green-500 bg-green-50"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                            }`}
                                    >
                                        {paymentMethod === "crypto" && (
                                            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                -10%
                                            </div>
                                        )}
                                        <Bitcoin className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                                        <div className="text-xs font-bold text-slate-900">Crypto</div>
                                    </button>

                                    <button
                                        onClick={() => setPaymentMethod("manual")}
                                        className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === "manual"
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                            }`}
                                    >
                                        <MessageCircle className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                                        <div className="text-xs font-bold text-slate-900">WhatsApp</div>
                                        <div className="text-[10px] text-slate-500">Transferencia/Efectivo</div>
                                    </button>
                                </div>

                                {/* Total Calculation */}
                                <div className="space-y-2 mb-6 pb-6 border-b border-slate-200">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Subtotal</span>
                                        <span className="font-medium">{formatPrice(serviceData.price)}</span>
                                    </div>
                                    {paymentMethod === "crypto" && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Descuento Crypto (10%)</span>
                                            <span className="font-medium">-{formatPrice(cryptoDiscount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-baseline pt-2">
                                        <span className="text-lg font-bold text-slate-900">Total a Pagar</span>
                                        <span className="text-2xl font-black text-slate-900">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleCheckout}
                                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg"
                                >
                                    {paymentMethod === "crypto" ? "Pagar con Crypto" : "Finalizar en WhatsApp"}
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>

                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                                    <Lock className="w-3 h-3" />
                                    <span>Transacción encriptada y segura</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default function ServiceCheckoutPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <ServiceCheckoutContent />
        </Suspense>
    )
}
