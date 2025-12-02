export interface JapUser {
    balance: string;
    currency: string;
}

export interface JapService {
    service: string;
    name: string;
    type: string;
    rate: string;
    min: string;
    max: string;
    category: string;
}

export interface JapOrderResponse {
    order: number;
    error?: string;
}

export interface JapStatusResponse {
    charge: string;
    start_count: string;
    status: 'Pending' | 'In progress' | 'Completed' | 'Partial' | 'Canceled' | 'Processing' | 'Fail';
    remains: string;
    currency: string;
}

export class JapClient {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string, baseUrl: string = 'https://justanotherpanel.com/api/v2') {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    private async request<T>(params: Record<string, string>): Promise<T> {
        const body = new URLSearchParams({
            key: this.apiKey,
            ...params
        });

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body.toString(),
            });

            if (!response.ok) {
                throw new Error(`JAP API Error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('JAP Request Failed:', error);
            throw error;
        }
    }

    async getBalance(): Promise<JapUser> {
        return this.request<JapUser>({ action: 'balance' });
    }

    async getServices(): Promise<JapService[]> {
        return this.request<JapService[]>({ action: 'services' });
    }

    async addOrder(serviceId: string, link: string, quantity: number): Promise<JapOrderResponse> {
        return this.request<JapOrderResponse>({
            action: 'add',
            service: serviceId,
            link: link,
            quantity: quantity.toString()
        });
    }

    async getOrderStatus(orderId: string): Promise<JapStatusResponse> {
        return this.request<JapStatusResponse>({
            action: 'status',
            order: orderId
        });
    }
}
