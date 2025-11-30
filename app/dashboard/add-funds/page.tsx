"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, CreditCard, Wallet, Bitcoin, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

const PRESET_AMOUNTS = [50, 100, 250, 500, 1000]

export default function AddFundsPage() {
    const router = useRouter()
    const [amount, setAmount] = useState<string>("")
    const [paymentMethod, setPaymentMethod] = useState("crypto")
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

    const handleAmountSelect = (value: number) => {
        setAmount(value.toString())
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!amount || isNaN(Number(amount))) return

        setLoading(true)
        setStatus("idle")

        try {
            // Simulation of payment processing
            await new Promise((resolve) => setTimeout(resolve, 2000))

            // In a real app, we would redirect to a payment gateway here
            // For now, we'll just simulate a successful request to add funds

            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Create a transaction record (simulated)
                // In production this would be handled by a webhook from the payment provider
                console.log("Processing payment for user:", user.id, "Amount:", amount)
            }

            setStatus("success")
            setTimeout(() => {
                router.push("/dashboard")
            }, 2000)
        } catch (error) {
            console.error("Payment error:", error)
            setStatus("error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6">
            <div className="max-w-2xl mx-auto">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al Dashboard
                </Link>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-emerald-500" />
                            Agregar Fondos
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Recarga tu saldo para realizar pedidos. El saldo no vence.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {status === "success" ? (
                            <div className="text-center py-12 space-y-4">
                                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white">¡Pago Procesado!</h3>
                                <p className="text-zinc-400">
                                    Tu saldo se actualizará en breve. Redirigiendo...
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Amount Selection */}
                                <div className="space-y-4">
                                    <Label className="text-zinc-300">Selecciona un monto</Label>
                                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                        {PRESET_AMOUNTS.map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => handleAmountSelect(val)}
                                                className={`py-2 px-3 rounded-md text-sm font-medium transition-all ${amount === val.toString()
                                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                                                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                                                    }`}
                                            >
                                                ${val}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="custom-amount" className="text-zinc-300">
                                            O ingresa otro monto (USD)
                                        </Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                                            <Input
                                                id="custom-amount"
                                                type="number"
                                                min="10"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="pl-7 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-emerald-500/50"
                                            />
                                        </div>
                                        <p className="text-xs text-zinc-500">Mínimo de recarga: $10.00 USD</p>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="space-y-4">
                                    <Label className="text-zinc-300">Método de Pago</Label>
                                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className={`relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all ${paymentMethod === "crypto"
                                                ? "border-emerald-500 bg-emerald-500/10"
                                                : "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800"
                                            }`}>
                                            <RadioGroupItem value="crypto" id="crypto" className="border-zinc-500 text-emerald-500" />
                                            <Label htmlFor="crypto" className="flex items-center gap-3 cursor-pointer w-full">
                                                <div className="p-2 rounded-full bg-zinc-800 border border-zinc-700">
                                                    <Bitcoin className="w-5 h-5 text-orange-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-white">Criptomonedas</p>
                                                    <p className="text-xs text-zinc-400">USDT, BTC, ETH (Automático)</p>
                                                </div>
                                            </Label>
                                        </div>

                                        <div className={`relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all ${paymentMethod === "card"
                                                ? "border-emerald-500 bg-emerald-500/10"
                                                : "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800"
                                            }`}>
                                            <RadioGroupItem value="card" id="card" className="border-zinc-500 text-emerald-500" />
                                            <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer w-full">
                                                <div className="p-2 rounded-full bg-zinc-800 border border-zinc-700">
                                                    <CreditCard className="w-5 h-5 text-blue-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-white">Tarjeta / Stripe</p>
                                                    <p className="text-xs text-zinc-400">Crédito o Débito</p>
                                                </div>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Summary */}
                                {amount && !isNaN(Number(amount)) && Number(amount) > 0 && (
                                    <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-zinc-400">Monto a recargar</span>
                                            <span className="text-white font-medium">${Number(amount).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-zinc-400">Comisión (0%)</span>
                                            <span className="text-emerald-400 font-medium">$0.00</span>
                                        </div>
                                        <div className="pt-2 border-t border-zinc-700 flex justify-between items-center">
                                            <span className="text-white font-medium">Total a pagar</span>
                                            <span className="text-xl font-bold text-white">${Number(amount).toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}

                                {status === "error" && (
                                    <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        Hubo un error al procesar la solicitud. Intenta nuevamente.
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading || !amount || Number(amount) < 10}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Procesando...
                                        </>
                                    ) : (
                                        `Pagar $${amount ? Number(amount).toFixed(2) : "0.00"}`
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
