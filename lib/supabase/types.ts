<<<<<<< HEAD
export type UserRole = 'CEO' | 'OPERATOR' | 'VENDOR'
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED'
export type CommissionType = 'SALE' | 'AFFILIATE' | 'BONUS'
export type CommissionStatus = 'PENDING' | 'APPROVED' | 'PAID'
export type WalletMovementType = 'COMMISSION' | 'WITHDRAWAL' | 'ADJUSTMENT' | 'AFFILIATE_BONUS'

export interface Level {
    id: string
    name: string
    min_sales: number
    commission_rate: number
    created_at: string
}

export interface User {
    id: string
    email: string
    name: string
    role: UserRole
    level_id: string | null
    level?: Level
    referral_code: string | null
    referred_by: string | null
    total_sales: number
    is_active: boolean
    created_at: string
}

export interface Wallet {
    id: string
    user_id: string
    balance: number
    pending_balance: number
    total_earned: number
    created_at: string
}

export interface WalletMovement {
    id: string
    wallet_id: string
    type: WalletMovementType
    amount: number
    description: string | null
    order_id: string | null
    created_at: string
}

export interface Service {
    id: string
    name: string
    description: string | null
    base_price: number
    category: string | null
    is_active: boolean
    created_at: string
}

export interface Order {
    id: string
    vendor_id: string
    vendor?: User
    service_id: string
    service?: Service
    client_name: string
    client_email: string | null
    client_phone: string | null
    sale_price: number
    cost_price: number
    vendor_commission: number | null
    trenzo_margin: number | null
    status: OrderStatus
    notes: string | null
    created_at: string
    confirmed_at: string | null
    paid_at: string | null
}

export interface Commission {
    id: string
    order_id: string
    user_id: string
    type: CommissionType
    amount: number
    status: CommissionStatus
    created_at: string
}

export interface Affiliate {
    id: string
    referrer_id: string
    referred_id: string
    first_sale_commission: number | null
    is_first_sale_paid: boolean
    created_at: string
}

export interface Ranking {
    id: string
    user_id: string
    user?: User
    period: string
    total_sales: number
    total_revenue: number
    total_commission: number
    position: number | null
    created_at: string
=======
export type UserRole = "CEO" | "OPERATOR" | "VENDOR"

export interface Level {
  id: string
  name: string
  min_sales: number
  commission_rate: string
  created_at: string
}

export interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
  level_id: string | null
  total_sales: number
  referred_by: string | null
  is_active: boolean
  created_at: string
  levels?: Level
}

export interface Wallet {
  id: string
  user_id: string
  balance: string
  pending_balance: string
  created_at: string
}

export interface WalletMovement {
  id: string
  wallet_id: string
  amount: string
  type: "COMMISSION" | "WITHDRAWAL" | "BONUS" | "AFFILIATE"
  description: string | null
  order_id: string | null
  created_at: string
}

export interface Service {
  id: string
  name: string
  description: string | null
  base_price: string
  is_active: boolean
  created_at: string
}

export interface Order {
  id: string
  seller_id: string
  service_id: string
  client_name: string
  client_email: string | null
  sale_price: string
  cost_price: string
  margin_trenzo: string
  seller_commission: string
  status: "PENDING" | "CONFIRMED" | "PAID" | "CANCELLED"
  payment_confirmed_at: string | null
  created_at: string
  services?: Service
  users?: User
}

export interface Commission {
  id: string
  order_id: string
  user_id: string
  amount: string
  type: "SALE" | "AFFILIATE"
  status: "PENDING" | "PAID"
  created_at: string
}

export interface Affiliate {
  id: string
  referrer_id: string
  referred_id: string
  commission_paid: boolean
  commission_amount: string | null
  created_at: string
}

export interface Ranking {
  id: string
  user_id: string
  period: string
  total_sales: number
  total_commission: string
  position: number | null
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, "id" | "created_at" | "total_sales">
        Update: Partial<Omit<User, "id" | "created_at">>
      }
      levels: {
        Row: Level
        Insert: Omit<Level, "id" | "created_at">
        Update: Partial<Omit<Level, "id" | "created_at">>
      }
      wallets: {
        Row: Wallet
        Insert: Omit<Wallet, "id" | "created_at">
        Update: Partial<Omit<Wallet, "id" | "created_at">>
      }
      wallet_movements: {
        Row: WalletMovement
        Insert: Omit<WalletMovement, "id" | "created_at">
        Update: never
      }
      services: {
        Row: Service
        Insert: Omit<Service, "id" | "created_at">
        Update: Partial<Omit<Service, "id" | "created_at">>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, "id" | "created_at">
        Update: Partial<Omit<Order, "id" | "created_at">>
      }
      commissions: {
        Row: Commission
        Insert: Omit<Commission, "id" | "created_at">
        Update: Partial<Omit<Commission, "id" | "created_at">>
      }
      affiliates: {
        Row: Affiliate
        Insert: Omit<Affiliate, "id" | "created_at">
        Update: Partial<Omit<Affiliate, "id" | "created_at">>
      }
      rankings: {
        Row: Ranking
        Insert: Omit<Ranking, "id" | "created_at">
        Update: Partial<Omit<Ranking, "id" | "created_at">>
      }
    }
  }
>>>>>>> c6d9e1528dae0ab229b8b40bbed32fa27bc52452
}
