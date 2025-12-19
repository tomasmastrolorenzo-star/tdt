import { useState } from 'react';
import { validateUser } from '@/lib/security/username-validator';

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
        try {
            const res = await fetch('/api/create-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userData.email,
                    username: userData.username,
                    plan: planDetails.plan,
                    period: planDetails.period,
                    amount: planDetails.amount,
                    payment_method: planDetails.paymentMethod,
                    order_bump: planDetails.orderBump
                })
            });

            const data = await res.json();

            if (!res.ok) {
                // Rate limited or other error
                setStatus('ERROR');
                setError(data.error || "An error occurred. Please try again.");
                return;
            }

            // 4. Construct WhatsApp Link
            let link = "";
            if (planDetails.paymentMethod === "crypto") {
                const message = `[CRYPTO REQUEST] Plan: ${planDetails.plan.toUpperCase()} ($${planDetails.amount.toFixed(2)}). User: @${userData.username}. Email: ${userData.email}`;
                link = `https://wa.me/5492212235170?text=${encodeURIComponent(message)}`;
            } else {
                const planName = planDetails.plan === "starter" ? "GROWTH STARTER" : planDetails.plan === "pro" ? "VIRAL MOMENTUM" : "BRAND PARTNER";
                const message = `Hello TDT Support. I want to finalize payment for the ${planName} ($${planDetails.amount.toFixed(2)}). My email is ${userData.email}.
            
👤 User: @${userData.username}
📅 Billing: ${planDetails.period.toUpperCase()}

Please send payment details for Zelle/CashApp/Transfer.`;
                link = `https://wa.me/5492212235170?text=${encodeURIComponent(message)}`;
            }

            setWhatsappLink(link);

            // 5. Secure Redirect
            const newWindow = window.open(link, '_blank');

            // Check for popup blocker
            if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                setShowFallbackModal(true);
            }

            setStatus('REDIRECTED');

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
