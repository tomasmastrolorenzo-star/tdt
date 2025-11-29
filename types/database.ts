export interface Service {
    id: string
    platform: 'INSTAGRAM' | 'TIKTOK'
    service_type: 'FOLLOWERS' | 'LIKES' | 'VIEWS'
    quality: 'ACTIVE' | 'PREMIUM' | 'VIP'
    quantity: number
    price: number
    bonus_percentage: number
    actual_quantity: number
    delivery_time: string
    features?: string[]
}

export interface Package {
    id: string
    platform: 'INSTAGRAM' | 'TIKTOK'
    name: string
    level: number
    followers: number
    likes: number
    comments: number
    comments_posts: number
    price: number
    is_best_seller: boolean
}

export interface Order {
    id: string
    order_number: string
    customer_email: string
    customer_username: string
    service_id?: string
    package_id?: string
    platform: string
    service_type?: string
    quality?: string
    quantity: number
    price: number
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED'
    payment_status: 'PENDING' | 'CONFIRMED' | 'REJECTED'
    created_at: string
}
