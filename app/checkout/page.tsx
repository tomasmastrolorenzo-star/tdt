const BUMP_PRICE = ORDER_BUMP.price

function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState(1200) // 20 minutes in seconds

    useEffect(() => {
        if (timeLeft <= 0) return
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
        return () => clearInterval(timer)
    }, [timeLeft])

    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    return (
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full text-orange-700 font-bold text-sm animate-pulse-slow">
            <Lock className="w-4 h-4" />
            <span>Spot reserved for: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
        </div>
    )
}

function RecentActivity() {
    const [isVisible, setIsVisible] = useState(false)
    const [activity, setActivity] = useState({ name: "Juan M.", action: "purchased", plan: "PRO" })

    const activities = [
        { name: "Juan M.", action: "purchased", plan: "PRO AUTHORITY" },
        { name: "Sarah J.", action: "purchased", plan: "INFLUENCER STARTER" },
        { name: "Yuki T.", action: "purchased", plan: "PRO AUTHORITY" },
        { name: "Mateo R.", action: "purchased", plan: "CELEBRITY STATUS" },
        { name: "Elena K.", action: "purchased", plan: "VIRAL MOMENTUM" },
    ]

    useEffect(() => {
        const trigger = () => {
            setTimeout(() => {
                setActivity(activities[Math.floor(Math.random() * activities.length)])
                setIsVisible(true)
                setTimeout(() => setIsVisible(false), 5000)
            }, 3000)
        }

        const interval = setInterval(trigger, 15000)
        trigger() // Initial trigger
        return () => clearInterval(interval)
    }, [])

    if (!isVisible) return null

    return (
        <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl p-4 flex items-center gap-4 max-w-sm">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-900">{activity.name} just {activity.action}</p>
                    <p className="text-xs text-slate-500">{activity.plan} Pack • Verified Buyer</p>
                </div>
                <X className="w-4 h-4 text-slate-400 cursor-pointer absolute top-2 right-2" onClick={() => setIsVisible(false)} />
            </div>
        </div>
    )
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
        setSelectedPlan(planParam || "pro")
        setBillingCycle(searchParams.get("billing") || "monthly")

        if (searchParams.get("username")) {
            setIsValidating(true)
            setTimeout(() => {
                setIsValidating(false)
                setIsValidUser(true)
            }, 1000)
        }

        funnelTracker.track('STEP_3_CHECKOUT_ENTRY', {
            plan: searchParams.get("plan") || "pro",
            username: searchParams.get("username"),
            niche: searchParams.get("interest"),
            location: searchParams.get("location")
        })
    }, [searchParams])

    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setUserData(prev => ({ ...prev, username: val }))
        setIsValidUser(false)

        if (val.length > 0) {
            setIsValidating(true)
            setTimeout(() => {
                setIsValidating(false)
                const validation = validateUser(val, "instagram")
                setIsValidUser(validation.valid)
            }, 600)
        } else {
            setIsValidating(false)
        }
    }

    const safePlanId = TICKER_PLANS[selectedPlan] ? selectedPlan : "pro"
    const planData = TICKER_PLANS[safePlanId]
    const basePrice = billingCycle === "quarterly" ? planData.quarterlyPrice : planData.monthlyPrice
    const subtotal = basePrice + (orderBump ? BUMP_PRICE : 0)
    const cryptoDiscount = paymentMethod === "crypto" ? subtotal * GLOBAL_DISCOUNTS.crypto : 0
    const total = subtotal - cryptoDiscount

    const [termsAccepted, setTermsAccepted] = useState(false)
    const { status, error: checkoutError, whatsappLink, showFallbackModal, setShowFallbackModal, processCheckout } = useSecureCheckout()
    const isProcessing = status === 'PROCESSING' || status === 'VALIDATING'

    useEffect(() => {
        if (checkoutError) toast.error(checkoutError)
    }, [checkoutError])

    const handleCheckout = () => {
        processCheckout({
            userData,
            planDetails: { plan: selectedPlan, amount: total, period: billingCycle, paymentMethod, orderBump },
            termsAccepted
        })
    }

    return (
        <main className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100">
            <RecentActivity />

            {/* Urgency Banner */}
            <div className="bg-slate-900 text-white py-2 px-4 text-center text-xs font-bold uppercase tracking-widest border-b border-indigo-500/20">
                <span className="text-indigo-400">Limited Availability:</span> High demand detected for {userData.username ? `@${userData.username}` : 'your niche'}. Strategy reserved for 20 minutes.
            </div>

            {/* Minimal Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="container mx-auto px-4 py-4 max-w-6xl flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Sparkles className="w-6 h-6 text-indigo-600 fill-indigo-600 transition-transform group-hover:rotate-12" />
                        <span className="font-extrabold text-xl text-slate-900 tracking-tight">Trend Digital</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <CountdownTimer />
                        <div className="hidden md:flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                            <Lock className="w-3 h-3" />
                            <span>256-Bit SSL Encrypted</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="grid lg:grid-cols-12 gap-8 relative">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* 1. Account Details */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-indigo-50 p-2.5 rounded-xl">
                                    <User className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Account Recovery Details</h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email Address</label>
                                    <Input
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                        className="h-12 border-slate-200 focus-visible:ring-indigo-500 rounded-xl"
                                        placeholder="you@email.com"
                                        type="email"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-2 px-1">For order confirmation and strategy report.</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Instagram Identity</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold">@</div>
                                        <Input
                                            value={userData.username}
                                            onChange={handleUserChange}
                                            className={`pl-8 h-12 text-base font-bold transition-all rounded-xl ${isValidUser ? "border-emerald-500 ring-4 ring-emerald-500/10 bg-emerald-50/20" : "border-slate-200"}`}
                                            placeholder="username"
                                        />
                                        <div className="absolute inset-y-0 right-3 flex items-center">
                                            {isValidating && <Activity className="h-4 w-4 text-indigo-500 animate-spin" />}
                                            {isValidUser && !isValidating && <div className="flex items-center gap-1 text-emerald-600 text-xs font-black uppercase tracking-tighter"><Check className="w-4 h-4" /> Ready</div>}
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-100 p-1.5 rounded-lg w-fit">
                                        <Shield className="w-3 h-3 text-indigo-500" />
                                        <span>Encrypted Transfer • No Password Required</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Payment Method */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-indigo-50 p-2.5 rounded-xl">
                                    <CreditCard className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Security-First Checkout</h3>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={() => setPaymentMethod("manual")}
                                    className={`relative w-full p-0 rounded-2xl border-2 transition-all group overflow-hidden ${paymentMethod === "manual" ? "border-indigo-600 bg-white ring-4 ring-indigo-600/5 shadow-lg" : "border-slate-100 hover:border-slate-200"}`}
                                >
                                    <div className="p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${paymentMethod === "manual" ? "bg-indigo-600 text-white rotate-3 shadow-lg shadow-indigo-200" : "bg-slate-100 text-slate-400"}`}>
                                                <Shield className="w-7 h-7" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-black text-slate-900 text-lg flex items-center gap-2">
                                                    Concierge Verification
                                                    <span className="bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest shadow-sm">Recommend</span>
                                                </div>
                                                <div className="text-sm text-slate-500 font-medium">Zelle / CashApp / Crypto via VIP Agent.</div>
                                            </div>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === "manual" ? "border-indigo-600 bg-indigo-50" : "border-slate-200"}`}>
                                            {paymentMethod === "manual" && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-in zoom-in" />}
                                        </div>
                                    </div>
                                    <div className={`px-5 py-2.5 text-[11px] font-bold text-slate-500 border-t transition-all ${paymentMethod === "manual" ? "bg-indigo-50/50 border-indigo-100" : "bg-slate-50 border-slate-100"}`}>
                                        High-profile account protection enabled. Every transaction is manually verified by our security team for fraud prevention.
                                    </div>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod("crypto")}
                                    className={`relative w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${paymentMethod === "crypto" ? "border-emerald-500 bg-emerald-50/10 shadow-lg" : "border-slate-100 hover:border-slate-200 opacity-60 grayscale"}`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
                                            <Bitcoin className="w-7 h-7 text-emerald-400" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-black text-slate-900 text-lg">Instant Crypto Activation</div>
                                            <div className="text-sm text-slate-500 font-medium font-mono">10% OFF • USDT / BTC / ETH</div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-100 text-slate-500 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">Manual Only</div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-5 relative">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            <div className="bg-white rounded-[32px] shadow-2xl shadow-indigo-900/10 border border-slate-200 overflow-hidden">
                                <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Strategy Summary</h3>
                                        <Badge variant="outline" className="border-indigo-100 text-indigo-600 bg-indigo-50/50">Growth #{Math.floor(Math.random() * 90000) + 10000}</Badge>
                                    </div>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-black text-slate-900 text-sm uppercase tracking-widest mb-1">{planData.name}</div>
                                            <div className="text-xs text-slate-400 font-bold uppercase tracking-tight">Billing: {billingCycle} Acceleration</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-black text-2xl text-slate-900">${basePrice}</div>
                                        </div>
                                    </div>

                                    {orderBump && (
                                        <div className="flex justify-between items-center text-rose-600 text-sm font-black animate-in slide-in-from-top-2">
                                            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> VIP Priority Processing</span>
                                            <span>+ ${BUMP_PRICE}</span>
                                        </div>
                                    )}

                                    {paymentMethod === "crypto" && (
                                        <div className="flex justify-between items-center text-emerald-600 text-sm font-black">
                                            <span>Crypto Discount (10%)</span>
                                            <span>- ${(subtotal * GLOBAL_DISCOUNTS.crypto).toFixed(2)}</span>
                                        </div>
                                    )}

                                    <div className="pt-6 border-t border-slate-100">
                                        <div className="flex justify-between items-end">
                                            <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Total Investment</span>
                                            <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* ORDER BUMP */}
                                <div className="mx-8 mb-8 p-6 bg-amber-50 rounded-3xl border-2 border-dashed border-amber-200 group hover:border-amber-400 transition-colors cursor-pointer" onClick={() => setOrderBump(!orderBump)}>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="font-black text-amber-600 text-[10px] uppercase tracking-[0.2em] mb-1">Elite Add-on</div>
                                            <p className="text-xs text-slate-700 font-black leading-snug">Add VIP Priority Processing for instant queue bypass.</p>
                                        </div>
                                        <Switch checked={orderBump} onCheckedChange={setOrderBump} className="data-[state=checked]:bg-amber-600" />
                                    </div>
                                </div>

                                <div className="px-8 space-y-4 mb-8">
                                    <label className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors">
                                        <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="w-5 h-5 mt-0.5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                                        <span className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-tight">I understand that due to the nature of AI delivery, sales are <span className="text-rose-500">non-refundable</span>. I agree to the <Link href="/terms" className="text-indigo-600 underline underline-offset-2">Terms of Service</Link>.</span>
                                    </label>

                                    <Button
                                        onClick={handleCheckout}
                                        disabled={!isValidUser || isProcessing || !termsAccepted}
                                        className={`w-full py-8 text-xl font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all duration-300 ${!isValidUser || !termsAccepted ? 'bg-slate-200 text-slate-400 opacity-50' : 'bg-slate-900 text-white hover:bg-indigo-600 hover:-translate-y-1 active:scale-95 shadow-indigo-200'}`}
                                    >
                                        {isProcessing ? <Activity className="animate-spin h-6 w-6" /> : "Authorize Payment →"}
                                    </Button>

                                    <div className="flex items-center justify-center gap-6 py-2">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-3 grayscale opacity-30" alt="Visa" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-5 grayscale opacity-30" alt="Mastercard" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" className="h-3 grayscale opacity-30" alt="PayPal" />
                                    </div>
                                </div>
                            </div>

                            {/* Trust Seals */}
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="space-y-2">
                                    <div className="flex justify-center"><Shield className="h-8 w-8 text-indigo-200" /></div>
                                    <p className="text-[9px] font-black uppercase tracking-tighter text-slate-400">100% Secure<br />Verification</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-center"><Sparkles className="h-8 w-8 text-indigo-200" /></div>
                                    <p className="text-[9px] font-black uppercase tracking-tighter text-slate-400">Guaranteed<br />Refill Policy</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-center"><Lock className="h-8 w-8 text-indigo-200" /></div>
                                    <p className="text-[9px] font-black uppercase tracking-tighter text-slate-400">AES-256 Bit<br />Encryption</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={showFallbackModal} onOpenChange={setShowFallbackModal}>
                <DialogContent className="sm:max-w-md bg-white border-2 border-emerald-500 rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl font-black text-slate-900">
                            <Check className="w-8 h-8 text-emerald-500" />
                            Security Bridge ✅
                        </DialogTitle>
                        <DialogDescription className="text-slate-600 font-medium">
                            Your browser high-security protocol blocked the payment link. Unlock it below to finalize your growth strategy.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                        <Button
                            onClick={() => window.open(whatsappLink, '_blank')}
                            className="w-full h-16 bg-[#25D366] hover:bg-[#128C7E] text-white text-xl font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-200"
                        >
                            <MessageCircle className="w-6 h-6 mr-3" />
                            Unlock via WhatsApp
                        </Button>
                    </div>
                    <DialogFooter className="bg-slate-50 p-4 -mx-6 -mb-6 rounded-b-3xl">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center w-full">Verified Concierge Service Enabled</p>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    )
}

function LoadingCheckout() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm text-center">
                <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 border-8 border-indigo-100 rounded-full"></div>
                    <div className="absolute inset-0 border-8 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                    <Lock className="absolute inset-x-0 inset-y-0 m-auto h-8 w-8 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Establishing Secure Channel</h2>
                <p className="text-slate-500 font-medium">Please wait while we encrypt your session data...</p>
            </div>
        </div>
    )
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<LoadingCheckout />}>
            <CheckoutContent />
        </Suspense>
    )
}
