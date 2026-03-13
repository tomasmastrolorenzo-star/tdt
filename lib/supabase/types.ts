export type UserRole = "CEO" | "OPERATOR" | "VENDOR"
export type CommunityRole = "admin" | "member"
export type AcademyCategory = "novatos" | "estrategia" | "marca_personal"

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
  community_role: CommunityRole
  level_id: string | null
  nda_signed: boolean
  nda_signed_at: string | null
  telegram_username: string | null
  bingx_uid: string | null
  bingx_verified: boolean
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

export interface AcademyResource {
  id: string
  title: string
  description: string | null
  category: AcademyCategory
  file_url: string
  thumbnail_url: string | null
  order_index: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: string
  community_role: CommunityRole
  telegram_username: string | null
  bingx_uid: string | null
  bingx_verified: boolean
  created_at: string
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
      academy_resources: {
        Row: AcademyResource
        Insert: Omit<AcademyResource, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<AcademyResource, "id" | "created_at">>
      }
      transactions: {
        Row: Transaction
        Insert: Omit<Transaction, "id" | "created_at">
        Update: never
      }
    }
  }
}
