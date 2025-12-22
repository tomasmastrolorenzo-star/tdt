import { useState } from 'react';
import { validateUser } from '@/lib/security/username-validator';
import { funnelTracker } from '@/lib/analytics/funnel';

export type CheckoutStatus = 'IDLE' | 'VALIDATING' | 'PROCESSING' | 'REDIRECTED' | 'ERROR';

interface UseSecureCheckoutProps {
    userData: { username: string; email: string };
    planDetails: { plan: string; amount: number; period: string; paymentMethod: string; orderBump: boolean };
    termsAccepted: boolean;
}

export function useSecureCheckout() {
    const [status, setStatus] = useState<CheckoutStatus>('IDLE');
    const [error, setError] = useState<string | null>(null);
    const [whatsappLink, setWhatsappLink] = useState<string>('');
    const [showFallbackModal, setShowFallbackModal] = useState(false);

    const processCheckout = async (props: UseSecureCheckoutProps) => {
        const { userData, planDetails, termsAccepted } = props;

        // 1. Reset State
        setError(null);
        setStatus('VALIDATING');

        // 2. Frontend Validation
        if (!userData.username) {
            setError("Please enter your Instagram Username");
            setStatus('IDLE');
            return;
        }

        const userValidation = validateUser(userData.username, 'instagram');
        if (!userValidation.valid) {
            setError(userValidation.msg || "Invalid username");
            setStatus('IDLE');
            return;
        }

        if (!userData.email) {
            setError("Please enter your email address.");
            setStatus('IDLE');
            return;
        }

        if (!termsAccepted) {
            setError("Please accept the Terms of Service to proceed.");
            setStatus('IDLE');
            return;
        }

        // 3. Backend Capture (INITIATED)
        setStatus('PROCESSING');
        funnelTracker.track('lead_attempt', { plan: planDetails.plan });

        try {
            // --- SECURITY: Fetch Lead Token ---
            const tokenRes = await fetch('/api/security/get-token');
            const { token } = await tokenRes.json();

            const searchParams = new URLSearchParams(window.location.search);
            const niche = searchParams.get('interest') || 'Universal';
            const location = searchParams.get('location') || 'Global';

            const res = await fetch('/api/create-lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: userData.email,
                    username: userData.username,
                    plan: planDetails.plan,
                    period: planDetails.period,
                    amount: planDetails.amount,
                    payment_method: planDetails.paymentMethod,
                    order_bump: planDetails.orderBump,
                    niche,
                    location,
                    funnel_history: funnelTracker.getHistory() // Attach the journey
                })
            });

            const data = await res.json();

            if (!res.ok) {
                // Rate limited or other error
                setStatus('ERROR');
                setError(data.error || "An error occurred. Please try again.");
                return;
            }

            const { orderId } = data; // Proof of persistence

            // 4. Handle Payment Flow
            let redirectUrl = "";
            const planName = planDetails.plan === "starter" ? "GROWTH STARTER" : planDetails.plan === "pro" ? "VIRAL MOMENTUM" : "BRAND PARTNER";

            if (planDetails.paymentMethod === "crypto") {
                try {
                    // Create Cryptomus Invoice
                    const cryptoRes = await fetch('/api/cryptomus/create-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            amount: planDetails.amount,
                            orderId: orderId,
                            customerEmail: userData.email
                        })
                    });

                    const cryptoData = await cryptoRes.json();
                    if (cryptoData.success && cryptoData.payment?.url) {
                        redirectUrl = cryptoData.payment.url;
                    } else {
                        throw new Error("Cryptomus invoice creation failed");
                    }
                } catch (cryptoErr) {
                    console.error("Cryptomus Error, falling back to WhatsApp:", cryptoErr);
                    // Fallback to WhatsApp if Cryptomus fails
                    const message = `[RESERVATION: #${orderId}] 🚀 CRYPTO ACTIVATION (FALLBACK)\n\nI prefer paying with Crypto for @${userData.username}. Please send the address for the ${planName} ($${planDetails.amount.toFixed(2)}).\n\n📧 Email: ${userData.email}`;
                    redirectUrl = `https://wa.me/5492212235170?text=${encodeURIComponent(message)}`;
                }
            } else {
                // Manual / Concierge Flow
                const message = `[RESERVATION: #${orderId}] ⚡ STRATEGY SECURED\n\nHi TDT Team! I just finished the El Faro analysis for @${userData.username}. I'm ready to activate my ${planName} ($${planDetails.amount.toFixed(2)}) immediately.\n\n🌍 Target: ${niche.toUpperCase()} / ${location.toUpperCase()}\n📧 Email: ${userData.email}\n\nI'm ready. Please provide the Zelle / CashApp / Transfer details to bypass the algorithm today. 🚀`;
                redirectUrl = `https://wa.me/5492212235170?text=${encodeURIComponent(message)}`;
            }

            setWhatsappLink(redirectUrl);

            // 5. Secure Redirect
            const newWindow = window.open(redirectUrl, '_blank');

            // Check for popup blocker
            if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                setShowFallbackModal(true);
            }

            setStatus('REDIRECTED');
            funnelTracker.track('STEP_4_WHATSAPP_REDIRECT', { method: planDetails.paymentMethod });
            funnelTracker.clear(); // Session complete

        } catch (err) {
            console.error("Checkout flow error:", err);
            setError("Connection error. Please check your internet connection.");
            setStatus('ERROR');
        }
    };

    return {
        status,
        error,
        whatsappLink,
        showFallbackModal,
        setShowFallbackModal,
        processCheckout
    };
}
