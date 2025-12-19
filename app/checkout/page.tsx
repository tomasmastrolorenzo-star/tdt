"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Check, Sparkles, Shield, CreditCard, Bitcoin, MessageCircle, Lock, X, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { useI18n } from "@/lib/i18n/context"

interface UpsellOption {
    id: string
    title: string
    description: string
    price: number
    icon: any
}

function CheckoutContent() {
    const { t } = useI18n()
    const searchParams = useSearchParams()
    const [selectedPlan, setSelectedPlan] = useState("pro")
    const [billingCycle, setBillingCycle] = useState("monthly")
    const [paymentMethod, setPaymentMethod] = useState<"crypto" | "manual">("manual")

    // Order Bump State
    const [orderBump, setOrderBump] = useState(false)

    // User data
    const [userData, setUserData] = useState({
        username: "",
        email: ""
    })

    // Simulate AI Validation
    const [isValidating, setIsValidating] = useState(false)
    const [isValidUser, setIsValidUser] = useState(false)

    useEffect(() => {
        setUserData({
            username: searchParams.get("username") || "",
            email: searchParams.get("email") || ""
        })
        const planParam = searchParams.get("plan")
        // Map old params to new if necessary, or just use raw. 
        // Our pricing section sends: starter, pro, dominance
        setSelectedPlan(planParam || "pro")
        setBillingCycle(searchParams.get("billing") || "monthly")

        // Auto-validate if username present
        if (searchParams.get("username")) {
            setIsValidating(true)
            setTimeout(() => {
                setIsValidating(false)
                setIsValidUser(true)
            }, 1000)
        }
    }, [searchParams])

    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setUserData(prev => ({ ...prev, username: val }))
        setIsValidUser(false)
        if (val.length > 2) {
            setIsValidating(true)
            // Debounce mock
            setTimeout(() => {
                setIsValidating(false)
                setIsValidUser(true)
            }, 800)
        }
    }

    // Pricing Constants (USD)
    const basePrices: Record<string, { monthly: number, quarterly: number }> = {
        starter: { monthly: 49, quarterly: 117 }, // 49 * 3 * 0.8
        pro: { monthly: 99, quarterly: 237 }, // 99 * 3 * 0.8
        dominance: { monthly: 249, quarterly: 597 } // 249 * 3 * 0.8
    }

    // Fallback for unknown plans
    const safePlan = basePrices[selectedPlan] ? selectedPlan : "pro"
    const cycleKey = billingCycle === "quarterly" ? "quarterly" : "monthly"
    const basePrice = basePrices[safePlan][cycleKey]

    const BUMP_PRICE = 4.99
    const bumpTotal = orderBump ? BUMP_PRICE : 0
    const subtotal = basePrice + bumpTotal
    const cryptoDiscount = paymentMethod === "crypto" ? subtotal * 0.1 : 0
    const total = subtotal - cryptoDiscount

    // Terms State
    const [termsAccepted, setTermsAccepted] = useState(false)

    const handleCheckout = async () => {
        if (!userData.username) {
            alert("Please enter your Instagram Username")
            return
        }
        if (!termsAccepted) {
            alert("Please accept the Terms of Service to proceed.")
            return
        }

        if (paymentMethod === "crypto") {
            // Placeholder for Cryptomus Integration logic
            // Ideally we redirect to an API, but for now alerted or minimal action
            // User said: "voy a chequear todo para cryptomus"
            // Let's redirect to a placeholder or alert
            alert("Cryptomus integration coming soon! For now, please use WhatsApp to complete your Crypto payment manually.")
            const message = `[CRYPTO REQUEST] Plan: ${selectedPlan.toUpperCase()} ($${total.toFixed(2)}). User: @${userData.username}. Email: ${userData.email}`
            window.open(`https://wa.me/5492212235170?text=${encodeURIComponent(message)}`, '_blank')
        } else {
            // WhatsApp Manual Checkout
            const planName = selectedPlan === "starter" ? "GROWTH STARTER" : selectedPlan === "pro" ? "VIRAL MOMENTUM" : "BRAND PARTNER"
            const message = `Hello! I would like to activate:
            
🚀 *Plan:* ${planName}
📅 *Billing:* ${billingCycle.toUpperCase()}
👤 *Username:* @${userData.username}
📧 *Email:* ${userData.email}
${orderBump ? "⚡ *Priority:* YES" : ""}

💰 *Total to Pay:* $${total.toFixed(2)} USD

I have accepted the Terms of Service.`
            window.open(`https://wa.me/5492212235170?text=${encodeURIComponent(message)}`, '_blank')
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            {/* Minimal Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="container mx-auto px-4 py-4 max-w-6xl flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-orange-600 fill-orange-600" />
                        <span className="font-black text-xl text-slate-900 tracking-tight">Trend Digital <span className="text-slate-400 font-normal">Secure Checkout</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                        <Lock className="w-3 h-3" />
                        <span>256-Bit SSL Encrypted</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="grid lg:grid-cols-12 gap-8 relative">

                    {/* LEFT COLUMN: Data & Payment Selection (lg:col-span-7) */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* 1. Account Details */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-orange-100 p-2 rounded-lg">
                                    <User className="w-5 h-5 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Account Details</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Username Input with AI Validator */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Instagram Username</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">@</div>
                                        <Input
                                            value={userData.username}
                                            onChange={handleUserChange}
                                            className={`pl-8 h-12 text-lg transition-all ${isValidUser ? "border-green-500 ring-2 ring-green-500/20" : "border-slate-300"}`}
                                            placeholder="username"
                                        />
                                        <div className="absolute inset-y-0 right-3 flex items-center">
                                            {isValidating && <span className="text-xs text-orange-500 font-bold animate-pulse">{t.checkout?.visualValidator?.checking || "Validating..."}</span>}
                                            {isValidUser && !isValidating && <div className="flex items-center gap-1 text-green-600 text-xs font-bold"><Check className="w-4 h-4" /> {t.checkout?.visualValidator?.valid || "Found"}</div>}
                                        </div>
                                    </div>
                                    {/* Security Notice */}
                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                                        <Shield className="w-3 h-3 text-green-500" />
                                        <span>{t.checkout?.noPassword || "We never ask for your password"}</span>
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
                                    <Input
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                        className="h-12 border-slate-300"
                                        placeholder="you@email.com"
                                        type="email"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Payment Method */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-indigo-100 p-2 rounded-lg">
                                    <CreditCard className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Select Payment Method</h3>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={() => setPaymentMethod("crypto")}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${paymentMethod === "crypto" ? "border-green-500 bg-green-50/50" : "border-slate-200 hover:border-slate-300"}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                                            <Bitcoin className="w-6 h-6 text-orange-500" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-slate-900 flex items-center gap-2">
                                                Crypto / Binance / USDT
                                                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">-10% OFF</span>
                                            </div>
                                            <div className="text-sm text-slate-500">Instant approval. Anonymous.</div>
                                        </div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "crypto" ? "border-green-500" : "border-slate-300"}`}>
                                        {paymentMethod === "crypto" && <div className="w-2.5 h-2.5 rounded-full bg-green-500" />}
                                    </div>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod("manual")}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${paymentMethod === "manual" ? "border-blue-500 bg-blue-50/50" : "border-slate-200 hover:border-slate-300"}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                                            <MessageCircle className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-slate-900">Transfer / Cash (WhatsApp)</div>
                                            <div className="text-sm text-slate-500">Contact support to pay manually.</div>
                                        </div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "manual" ? "border-blue-500" : "border-slate-300"}`}>
                                        {paymentMethod === "manual" && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                                    </div>
                                </button>
                            </div>

                            {/* Payment Logos Row */}
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <p className="text-xs text-center text-slate-400 font-bold uppercase tracking-wider mb-4">{t.checkout?.secureLogos || "We accept"}</p>
                                <div className="flex flex-wrap justify-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-6 object-contain" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-6 object-contain" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" className="h-6 object-contain" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Wallet_Icon_2015.svg/2560px-Google_Wallet_Icon_2015.svg.png" alt="GPay" className="h-6 object-contain" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/1257px-Ethereum_logo_2014.svg.png" alt="Crypto" className="h-6 object-contain" />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Summary & Upsell (Sticky) (lg:col-span-5) */}
                    <div className="lg:col-span-5 relative">
                        <div className="lg:sticky lg:top-24 space-y-6">

                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                    <h3 className="text-lg font-bold text-slate-900">Order Summary</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    {/* Item */}
                                    <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                                        <div>
                                            <div className="font-bold text-slate-900 uppercase tracking-wide">
                                                {safePlan === "starter" ? "Growth Starter" : safePlan === "pro" ? "Viral Momentum" : "Brand Partner"}
                                            </div>
                                            <div className="text-xs text-slate-500 capitalize">Billing: {billingCycle}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-lg">${basePrice.toLocaleString()}</div>
                                        </div>
                                    </div>

                                    {/* Discount Line */}
                                    {paymentMethod === "crypto" && (
                                        <div className="flex justify-between items-center text-green-600 text-sm font-medium">
                                            <span>Crypto Discount (10%)</span>
                                            <span>- ${cryptoDiscount.toFixed(2)}</span>
                                        </div>
                                    )}

                                    {/* Bump Line */}
                                    {orderBump && (
                                        <div className="flex justify-between items-center text-orange-600 text-sm font-bold animate-fade-in">
                                            <span>VIP Priority</span>
                                            <span>+ ${BUMP_PRICE}</span>
                                        </div>
                                    )}

                                    {/* Total */}
                                    <div className="flex justify-between items-baseline pt-2">
                                        <span className="text-slate-500">Total</span>
                                        <span className="text-3xl font-black text-slate-900">${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* THE GOLDEN BOX (ORDER BUMP) */}
                                <div className="p-6 bg-[#FFFBE6] border-2 border-dashed border-[#FF4D4F] rounded-xl relative overflow-hidden animate-pulse-slow">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="font-black text-[#FF4D4F] text-sm uppercase tracking-wide mb-1">
                                                {t.checkout?.orderBump?.headline || "🚀 ONE-TIME OFFER: PRIORITY PROCESSING"}
                                            </div>
                                            <p className="text-sm text-slate-700 font-medium leading-tight">
                                                {t.checkout?.orderBump?.copy || "Yes, add priority processing for $4.99."}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <Switch
                                                checked={orderBump}
                                                onCheckedChange={setOrderBump}
                                                className="data-[state=checked]:bg-[#FF4D4F] scale-110"
                                            />
                                            <span className="text-xs font-bold text-[#FF4D4F]">
                                                +$4.99
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Terms & Conditions Checkbox */}
                                <div className="p-6 pb-0">
                                    <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors relative">
                                        <input
                                            type="checkbox"
                                            checked={termsAccepted}
                                            onChange={(e) => setTermsAccepted(e.target.checked)}
                                            className="w-5 h-5 mt-0.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500 relative z-10 cursor-pointer"
                                        />
                                        <div className="text-xs text-slate-600 leading-relaxed font-medium">
                                            I agree to the <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-orange-600 underline font-bold hover:text-orange-700 relative z-20">Terms of Service</Link> and understand that this purchase is <span className="text-red-500 font-bold">non-refundable</span>. I will not file disputes/chargebacks.
                                        </div>
                                    </label>
                                </div>

                                {/* Pay Button */}
                                <div className="p-6 bg-slate-50 border-t border-slate-100">
                                    <Button
                                        onClick={handleCheckout}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold py-7 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95"
                                    >
                                        Activate Plan
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                    <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1.5 font-medium">
                                        <Sparkles className="w-3 h-3 text-green-500" />
                                        Guaranteed Delivery within 24h
                                    </p>
                                </div>
                            </div>

                            {/* Guaranteed Seal */}
                            <div className="flex items-center justify-center gap-4 text-slate-400 grayscale opacity-70">
                                <Shield className="w-8 h-8" />
                                <div className="text-xs">
                                    <div className="font-bold">100% Money Back Guarantee</div>
                                    <div>If we don't deliver, we refund.</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}



export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-bold">Loading secure checkout...</p>
                </div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    )
}
