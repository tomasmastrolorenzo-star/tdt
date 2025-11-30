export type UserRole = "CEO" | "OPERATOR" | "VENDOR"
export type OrderStatus = "PENDING_PAYMENT" | "PAYMENT_REJECTED" | "PAYMENT_CONFIRMED" | "PROCESSING" | "COMPLETED"

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
  name: string | null
  role: UserRole
  level_id: string | null
  nda_signed: boolean
  nda_signed_at: string | null
  created_at: string
  updated_at: string
  levels?: Level
}

export interface Wallet {
  id: string
  user_id: string
  balance: number
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  description: string | null
  base_price: number
  is_active: boolean
  created_at: string
}

export interface Order {
  id: string
  seller_id: string
  service_id: string
  client_name: string
  client_email: string | null
  link: string | null
  price_final: number
  seller_commission: number
  margin_trenzo: number
  status: OrderStatus
  notes: string | null
  jap_order_id: number | null
  created_at: string
  updated_at: string
  services?: Service
  users?: User
}

// Additional types for compatibility
export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
}

export interface Credit {
  id: string
  user_id: string
  balance: number
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  amount: number
  type: string
  description: string | null
  reference_id: string | null
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<User, "id" | "created_at">>
      }
      levels: {
        Row: Level
        Insert: Omit<Level, "id" | "created_at">
        Update: Partial<Omit<Level, "id" | "created_at">>
      }
      wallets: {
        Row: Wallet
        Insert: Omit<Wallet, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Wallet, "id" | "created_at">>
      }
      services: {
        Row: Service
        Insert: Omit<Service, "id" | "created_at">
        Update: Partial<Omit<Service, "id" | "created_at">>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Order, "id" | "created_at">>
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, "id" | "created_at">
        Update: Partial<Omit<Profile, "id" | "created_at">>
      }
      credits: {
        Row: Credit
        Insert: Omit<Credit, "id" | "updated_at">
        Update: Partial<Omit<Credit, "id">>
      }
      transactions: {
        Row: Transaction
        Insert: Omit<Transaction, "id" | "created_at">
        Update: never
      }
    }
  }
}
