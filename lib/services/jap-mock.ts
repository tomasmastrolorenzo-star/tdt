/**
 * Mock JAP Client for Development/Testing
 * Use this while you're waiting to get your real API Key
 */

export interface MockJapService {
    service: string
    name: string
    type: string
    rate: string
    min: string
    max: string
    category: string
    refill: boolean
    cancel: boolean
}

export class MockJapClient {
    private mockServices: MockJapService[] = [
        // Instagram Services
        {
            service: "101",
            name: "Instagram Followers - High Quality - Real - Refill 30D",
            type: "Default",
            category: "Instagram",
            rate: "3.50",
            min: "100",
            max: "50000",
            refill: true,
            cancel: true
        },
        {
            service: "102",
            name: "Instagram Followers - Premium - Active - Refill 60D",
            type: "Default",
            category: "Instagram",
            rate: "7.80",
            min: "100",
            max: "50000",
            refill: true,
            cancel: true
        },
        {
            service: "103",
            name: "Instagram Followers - Elite - Engaged - Refill 90D",
            type: "Default",
            category: "Instagram",
            rate: "14.50",
            min: "100",
            max: "100000",
            refill: true,
            cancel: true
        },
        {
            service: "104",
            name: "Instagram Followers - VIP - Influencer Quality - Refill 120D",
            type: "Default",
            category: "Instagram",
            rate: "26.00",
            min: "500",
            max: "100000",
            refill: true,
            cancel: true
        },
        {
            service: "105",
            name: "Instagram Followers - Celebrity - Premium Active - Refill 180D",
            type: "Default",
            category: "Instagram",
            rate: "55.00",
            min: "1000",
            max: "100000",
            refill: true,
            cancel: true
        },

        // TikTok Services
        {
            service: "201",
            name: "TikTok Followers - High Quality - Real - Refill 30D",
            type: "Default",
            category: "TikTok",
            rate: "2.80",
            min: "100",
            max: "100000",
            refill: true,
            cancel: true
        },
        {
            service: "202",
            name: "TikTok Followers - Premium - Active - Refill 60D",
            type: "Default",
            category: "TikTok",
            rate: "6.50",
            min: "100",
            max: "100000",
            refill: true,
            cancel: true
        },
        {
            service: "203",
            name: "TikTok Followers - Elite - Engaged - Refill 90D",
            type: "Default",
            category: "TikTok",
            rate: "12.00",
            min: "100",
            max: "100000",
            refill: true,
            cancel: true
        },
        {
            service: "204",
            name: "TikTok Followers - VIP - Influencer Quality - Refill 120D",
            type: "Default",
            category: "TikTok",
            rate: "22.00",
            min: "500",
            max: "100000",
            refill: true,
            cancel: true
        },
        {
            service: "205",
            name: "TikTok Followers - Celebrity - Premium Active - Refill 180D",
            type: "Default",
            category: "TikTok",
            rate: "48.00",
            min: "1000",
            max: "100000",
            refill: true,
            cancel: true
        },

        // YouTube Services
        {
            service: "301",
            name: "YouTube Subscribers - High Quality - Real - Refill 30D",
            type: "Default",
            category: "YouTube",
            rate: "5.50",
            min: "50",
            max: "10000",
            refill: true,
            cancel: true
        },
        {
            service: "302",
            name: "YouTube Subscribers - Premium - Active - Refill 60D",
            type: "Default",
            category: "YouTube",
            rate: "9.80",
            min: "50",
            max: "10000",
            refill: true,
            cancel: true
        },
        {
            service: "303",
            name: "YouTube Subscribers - Elite - Engaged - Refill 90D",
            type: "Default",
            category: "YouTube",
            rate: "20.00",
            min: "100",
            max: "10000",
            refill: true,
            cancel: true
        },
        {
            service: "304",
            name: "YouTube Subscribers - VIP - Influencer Quality - Refill 120D",
            type: "Default",
            category: "YouTube",
            rate: "38.00",
            min: "100",
            max: "10000",
            refill: true,
            cancel: true
        },
        {
            service: "305",
            name: "YouTube Subscribers - Celebrity - Premium Active - Refill 180D",
            type: "Default",
            category: "YouTube",
            rate: "68.00",
            min: "500",
            max: "10000",
            refill: true,
            cancel: true
        }
    ]

    async getBalance() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        return {
            balance: "1234.56",
            currency: "USD"
        }
    }

    async getServices() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        return this.mockServices
    }

    async addOrder(serviceId: string, link: string, quantity: number) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        return {
            order: Math.floor(Math.random() * 100000)
        }
    }

    async getOrderStatus(orderId: string) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        return {
            charge: "10.50",
            start_count: "1000",
            status: "In progress" as const,
            remains: "500",
            currency: "USD"
        }
    }
}

// Export mock instance for development
export const mockJapClient = new MockJapClient()
