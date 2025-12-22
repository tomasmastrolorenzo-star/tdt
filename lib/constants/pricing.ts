export interface PricingTier {
    id: string;
    name: string;
    monthlyPrice: number;
    quarterlyPrice: number;
    description: string;
    features: string[];
    badge?: string;
    highlight?: boolean;
}

export const TICKER_PLANS: Record<string, PricingTier> = {
    starter: {
        id: 'starter',
        name: "GROWTH STARTER",
        monthlyPrice: 49,
        quarterlyPrice: 117,
        description: "Ideal for new accounts starting from zero authority.",
        features: ["Foundation Build", "Basic Audience Expansion", "Organic Optimization", "24/7 Support Access"],
        badge: "Safe Entry"
    },
    pro: {
        id: 'pro',
        name: "VIRAL MOMENTUM",
        monthlyPrice: 99,
        quarterlyPrice: 237,
        description: "Aggressive growth to trigger algorithm recommendations.",
        features: ["Accelerated Growth Engine", "AI Viral Strategy", "Viral Hashtag Cluster", "Regional Targeted Audience", "Priority Optimization"],
        badge: "🔥 BEST FOR AI GROWTH",
        highlight: true
    },
    dominance: {
        id: 'dominance',
        name: "BRAND PARTNER",
        monthlyPrice: 249,
        quarterlyPrice: 597,
        description: "Full-scale reputation management & authority building.",
        features: ["Maximum Velocity", "Dedicated Account Manager", "Full-Scale Reputation Mgmt", "Authority Building", "VIP Support"],
        badge: "MAXIMUM ROI"
    }
};

export const GLOBAL_DISCOUNTS = {
    crypto: 0.10, // 10% discount
    quarterly: 0.20 // 20% discount (already reflected in quarterlyPrice)
};

export const ORDER_BUMP = {
    id: 'priority_processing',
    name: 'Priority Processing',
    price: 4.99,
    description: 'Yes, add priority processing for $4.99.'
};
