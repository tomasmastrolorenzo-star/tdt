/**
 * Cryptomus Payment Gateway Client
 * Documentation: https://doc.cryptomus.com/
 */

import crypto from 'crypto'

export interface CryptomusPaymentRequest {
    amount: string
    currency: string
    order_id: string
    url_return?: string
    url_callback?: string
    is_payment_multiple?: boolean
    lifetime?: number
    to_currency?: string
    subtract?: number
    accuracy_payment_percent?: number
    additional_data?: string
    currencies?: string[]
    except_currencies?: string[]
    course_source?: string
    from_referral_code?: string
    discount_percent?: number
    is_refresh?: boolean
}

export interface CryptomusPaymentResponse {
    state: number
    result: {
        uuid: string
        order_id: string
        amount: string
        payment_amount: string
        payer_amount: string
        discount_percent: number
        discount: string
        payer_currency: string
        currency: string
        comments: string | null
        network: string
        address: string
        from: string | null
        txid: string | null
        payment_status: string
        url: string
        expired_at: number
        status: string
        is_final: boolean
        additional_data: string | null
        created_at: string
        updated_at: string
    }
}

export interface CryptomusPaymentInfo {
    uuid: string
    order_id: string
    amount: string
    payment_amount: string | null
    payer_amount: string | null
    discount_percent: number
    discount: string
    payer_currency: string | null
    currency: string
    comments: string | null
    network: string | null
    address: string | null
    from: string | null
    txid: string | null
    payment_status: string
    url: string
    expired_at: number
    status: string
    is_final: boolean
}

export class CryptomusClient {
    private merchantId: string
    private apiKey: string
    private paymentKey: string
    private baseUrl: string = 'https://api.cryptomus.com/v1'

    constructor(merchantId: string, apiKey: string, paymentKey: string) {
        this.merchantId = merchantId
        this.apiKey = apiKey
        this.paymentKey = paymentKey
    }

    /**
     * Generate signature for request
     */
    private generateSignature(data: any): string {
        const jsonData = JSON.stringify(data)
        const base64Data = Buffer.from(jsonData).toString('base64')
        return crypto
            .createHash('md5')
            .update(base64Data + this.apiKey)
            .digest('hex')
    }

    /**
     * Make API request to Cryptomus
     */
    private async request<T>(endpoint: string, data: any): Promise<T> {
        const signature = this.generateSignature(data)

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'merchant': this.merchantId,
                    'sign': signature,
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Cryptomus API Error: ${response.status} - ${errorText}`)
            }

            return await response.json()
        } catch (error) {
            console.error('Cryptomus Request Failed:', error)
            throw error
        }
    }

    /**
     * Create a new payment
     */
    async createPayment(params: CryptomusPaymentRequest): Promise<CryptomusPaymentResponse> {
        return this.request<CryptomusPaymentResponse>('/payment', params)
    }

    /**
     * Get payment information
     */
    async getPaymentInfo(uuid: string, order_id: string): Promise<{ state: number; result: CryptomusPaymentInfo }> {
        return this.request('/payment/info', { uuid, order_id })
    }

    /**
     * Verify webhook signature
     */
    verifyWebhookSignature(body: any, receivedSignature: string): boolean {
        const jsonData = JSON.stringify(body)
        const base64Data = Buffer.from(jsonData).toString('base64')
        const calculatedSignature = crypto
            .createHash('md5')
            .update(base64Data + this.paymentKey)
            .digest('hex')

        return calculatedSignature === receivedSignature
    }

    /**
     * Get list of available currencies
     */
    async getAvailableCurrencies(): Promise<any> {
        return this.request('/payment/services', {})
    }
}

// Singleton instance for easy importing
export const cryptomusClient = new CryptomusClient(
    process.env.CRYPTOMUS_MERCHANT_ID || '',
    process.env.CRYPTOMUS_API_KEY || '',
    process.env.CRYPTOMUS_PAYMENT_KEY || ''
)
