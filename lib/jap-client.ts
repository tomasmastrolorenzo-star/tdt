export class JAPClient {
    private apiKey: string;
    private apiUrl: string;

    constructor() {
        this.apiKey = process.env.JAP_API_KEY || '';
        this.apiUrl = process.env.JAP_API_URL || 'https://justanotherpanel.com/api/v2';
    }

    private async request(action: string, params: Record<string, any> = {}) {
        if (!this.apiKey) {
            throw new Error('JAP_API_KEY is not configured');
        }

        const body = new URLSearchParams({
            key: this.apiKey,
            action,
            ...params,
        });

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                body: body,
            });

            if (!response.ok) {
                throw new Error(`JAP API Error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(`JAP API Error: ${data.error}`);
            }

            return data;
        } catch (error) {
            console.error('JAP Request Failed:', error);
            throw error;
        }
    }

    async getBalance() {
        return this.request('balance');
    }

    async getServices() {
        return this.request('services');
    }

    async addOrder(serviceId: number, link: string, quantity: number) {
        return this.request('add', {
            service: serviceId,
            link,
            quantity
        });
    }

    async getOrderStatus(orderId: number) {
        return this.request('status', { order: orderId });
    }
}
