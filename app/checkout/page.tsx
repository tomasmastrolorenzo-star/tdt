"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Check, Sparkles, Shield, CreditCard, Bitcoin, MessageCircle, Lock, X, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useI18n } from "@/lib/i18n/context"
import { validateUser } from "@/lib/security/username-validator"
import { useSecureCheckout } from "@/hooks/use-secure-checkout"

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

        if (val.length > 0) {
            setIsValidating(true)
            // Debounce mock
            setTimeout(() => {
                setIsValidating(false)
                const validation = validateUser(val, "instagram")
                setIsValidUser(validation.valid)
            }, 600)
        } else {
            setIsValidating(false)
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

    // Security Hook
    const {
        status,
        error: checkoutError,
        whatsappLink,
        showFallbackModal,
        setShowFallbackModal,
        processCheckout
    } = useSecureCheckout()

    const isProcessing = status === 'PROCESSING' || status === 'VALIDATING'

    // Effect to show errors from hook
    useEffect(() => {
        if (checkoutError) {
            alert(checkoutError)
        }
    }, [checkoutError])

    const handleCheckout = () => {
        processCheckout({
            userData,
            planDetails: {
                plan: selectedPlan,
                amount: total,
                period: billingCycle,
                paymentMethod,
                orderBump
            },
            termsAccepted
        })
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
                                {/* Email Input (First) */}
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

                                {/* Username Input with AI Validator (Second) */}
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
                                            {isValidating && <span className="text-xs text-orange-500 font-bold animate-pulse">Validating...</span>}
                                            {isValidUser && !isValidating && <div className="flex items-center gap-1 text-green-600 text-xs font-bold"><Check className="w-4 h-4" /> Available</div>}
                                        </div>
                                    </div>
                                    {/* Security Notice */}
                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                                        <Shield className="w-3 h-3 text-green-500" />
                                        <span>We never ask for your password</span>
                                    </div>
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
                                {/* Option A: Instant Crypto */}
                                <button
                                    onClick={() => setPaymentMethod("crypto")}
                                    className={`relative w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all overflow-hidden ${paymentMethod === "crypto" ? "border-green-500 bg-green-50/50" : "border-slate-200 hover:border-slate-300 opacity-60"}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                                            <Bitcoin className="w-6 h-6 text-yellow-500" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-slate-900 flex items-center gap-2">
                                                Pay with Crypto
                                                <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Coming Soon</span>
                                            </div>
                                            <div className="text-sm text-slate-500">Instant Activation (USDT/BTC/ETH)</div>
                                        </div>
                                    </div>
                                    {paymentMethod === "crypto" && <div className="absolute top-0 right-0 p-1"><div className="w-2.5 h-2.5 rounded-full bg-green-500" /></div>}
                                </button>

                                {/* Option B: VIP Manual Processing */}
                                <button
                                    onClick={() => setPaymentMethod("manual")}
                                    className={`relative w-full p-0 rounded-xl border-2 transition-all shadow-sm group ${paymentMethod === "manual" ? "border-[#D4AF37] bg-amber-50/10 ring-1 ring-[#D4AF37]/50" : "border-slate-200 hover:border-[#D4AF37]/50"}`}
                                >
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center shadow-lg">
                                                <Shield className="w-6 h-6 text-[#D4AF37]" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-black text-slate-900 text-lg flex items-center gap-2">
                                                    Manual Processing (Zelle / CashApp)
                                                </div>
                                                <div className="text-sm text-slate-600 font-medium">Connect with a VIP Agent to process your payment securely.</div>
                                            </div>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === "manual" ? "border-[#D4AF37]" : "border-slate-300"}`}>
                                            {paymentMethod === "manual" && <div className="w-3 h-3 rounded-full bg-[#D4AF37]" />}
                                        </div>
                                    </div>

                                    {/* Trust Footer */}
                                    <div className="bg-[#D4AF37]/5 px-4 py-2 border-t border-[#D4AF37]/10 flex items-center gap-2">
                                        <Lock className="w-3 h-3 text-[#D4AF37]" />
                                        <p className="text-[11px] text-slate-600 font-medium">
                                            For security and fraud prevention, high-ticket orders are verified manually by our billing team.
                                        </p>
                                    </div>
                                </button>
                            </div>

                            {/* Payment Logos Row (Clean SVGs) */}
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <p className="text-xs text-center text-slate-400 font-bold uppercase tracking-wider mb-4">{t.checkout?.secureLogos || "We accept"}</p>
                                <div className="flex flex-wrap justify-center gap-3 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                                    {/* Visa */}
                                    <div className="h-6 w-10 flex items-center justify-center bg-white border border-slate-200 rounded">
                                        <svg className="w-8 h-5" viewBox="0 0 48 32" fill="none">
                                            <rect width="48" height="32" rx="4" fill="white" />
                                            <path d="M20.5 11h-3.2l-2 12h3.2l2-12zm8.5 7.7c0-3.2-4.4-3.4-4.4-4.8 0-.4.4-.9 1.3-.9.7 0 1.3.1 1.9.3l.3-1.9c-.6-.2-1.4-.4-2.4-.4-2.5 0-4.3 1.3-4.3 3.2 0 1.4 1.2 2.1 2.2 2.6 1 .5 1.4.8 1.4 1.2 0 .7-.8 1-1.6 1-.9 0-1.8-.2-2.6-.6l-.4 2c.8.4 1.9.6 3.1.6 2.7 0 4.5-1.3 4.5-3.3zm6.8 4.3h2.8l-2.4-12h-2.6c-.6 0-1 .3-1.3.8l-4.5 11.2h2.7l.5-1.5h3.3l.5 1.5zm-2.9-3.5l1.4-3.8.8 3.8h-2.2zm-13.4-8.5l-3.1 12h-2.7l-1.5-9.3c-.1-.4-.2-.6-.5-.8-.5-.3-1.4-.6-2.2-.8l.1-.4h3.8c.5 0 .9.3 1 .9l.9 4.8 2.2-5.7h2.7z" fill="#1434CB" />
                                        </svg>
                                    </div>
                                    {/* Mastercard */}
                                    <div className="h-6 w-10 flex items-center justify-center bg-white border border-slate-200 rounded">
                                        <svg className="w-8 h-5" viewBox="0 0 48 32" fill="none">
                                            <rect width="48" height="32" rx="4" fill="white" />
                                            <circle cx="18" cy="16" r="7" fill="#EB001B" />
                                            <circle cx="30" cy="16" r="7" fill="#F79E1B" />
                                            <path d="M24 10.5c-1.4 1.3-2.3 3.2-2.3 5.5s.9 4.2 2.3 5.5c1.4-1.3 2.3-3.2 2.3-5.5s-.9-4.2-2.3-5.5z" fill="#FF5F00" />
                                        </svg>
                                    </div>
                                    {/* Amex */}
                                    <div className="h-6 w-10 flex items-center justify-center bg-white border border-slate-200 rounded">
                                        <svg className="w-8 h-5" viewBox="0 0 48 32" fill="none">
                                            <rect width="48" height="32" rx="4" fill="#006FCF" />
                                            <path d="M14 12h-2l-1.5 4-1.5-4h-2l2.5 6h2l2.5-6zm3 0h-2v6h2v-6zm4 0h-2l-1.5 4v-4h-2v6h2l1.5-4v4h2v-6zm8 0h-4v6h4v-1.5h-2v-1h2v-1.5h-2v-1h2v-1.5zm4 0h-2l-1.5 4-1.5-4h-2l2.5 6h2l2.5-6z" fill="white" />
                                        </svg>
                                    </div>
                                    {/* Bitcoin/Crypto */}
                                    <div className="h-6 w-10 flex items-center justify-center bg-white border border-slate-200 rounded">
                                        <Bitcoin className="w-5 h-5 text-orange-500" />
                                    </div>
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
                                        disabled={!isValidUser || isProcessing}
                                        className={`w-full text-white text-lg font-bold py-7 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 ${!isValidUser ? "bg-slate-400 cursor-not-allowed text-slate-200" : "bg-slate-900 hover:bg-slate-800"}`}
                                    >
                                        Proceed to Payment 🔒
                                    </Button>
                                    {!isValidUser && userData.username.length > 0 && !isValidating && (
                                        <p className="text-center text-xs text-red-500 mt-2 font-bold animate-pulse">
                                            Please enter a valid Instagram username to proceed.
                                        </p>
                                    )}
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
            {/* FALLBACK MODAL FOR BLOCKED POPUPS */}
            <Dialog open={showFallbackModal} onOpenChange={setShowFallbackModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" />
                            Order Saved! ✅
                        </DialogTitle>
                        <DialogDescription>
                            Your browser blocked the redirect. Click below to complete activation.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2 py-4">
                        <div className="grid flex-1 gap-2">
                            <Button
                                onClick={() => window.open(whatsappLink, '_blank')}
                                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold"
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Click to Open WhatsApp
                            </Button>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogDescription className="text-xs">
                            If the button doesn't work, ensure you have WhatsApp installed.
                        </DialogDescription>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main >
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
