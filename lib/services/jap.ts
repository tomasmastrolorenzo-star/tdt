export interface JapUser {
    id: string;
    username: string;
    email: string;
    balance: string;
    spent: string;
    created: string;
    last_auth: string;
    discount: string;
    rates: string;
}

export interface JapService {
    id: string;
    name: string;
    rate: string;
    min: string;
    max: string;
    category: string;
}

export interface JapOrder {
    id: string;
    service: string;
    link: string;
    quantity: string;
    charge: string;
    status: 'Pending' | 'In progress' | 'Completed' | 'Partial' | 'Canceled' | 'Processing';
    date: string;
}

export class JapClient {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string, baseUrl: string = 'https://panel.trenddigitaltrade.com/api/v2') {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    // Placeholder for future implementation
    async getProfile(): Promise<JapUser | null> {
        // TODO: Implement API call
        return null;
    }

    async getServices(): Promise<JapService[]> {
        // TODO: Implement API call
        return [];
    }
}
