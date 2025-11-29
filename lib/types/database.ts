export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            credits: {
                Row: {
                    id: string
                    user_id: string
                    balance: number
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    balance?: number
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    balance?: number
                    updated_at?: string
                }
            }
            transactions: {
                Row: {
                    id: string
                    user_id: string
                    amount: number
                    type: 'deposit' | 'purchase' | 'refund' | 'adjustment'
                    description: string | null
                    reference_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    amount: number
                    type: 'deposit' | 'purchase' | 'refund' | 'adjustment'
                    description?: string | null
                    reference_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    amount?: number
                    type?: 'deposit' | 'purchase' | 'refund' | 'adjustment'
                    description?: string | null
                    reference_id?: string | null
                    created_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string
                    service_id: number
                    service_name: string | null
                    link: string
                    quantity: number
                    cost: number
                    status: 'pending' | 'processing' | 'completed' | 'partial' | 'canceled' | 'refunded'
                    jap_order_id: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    service_id: number
                    service_name?: string | null
                    link: string
                    quantity: number
                    cost: number
                    status?: 'pending' | 'processing' | 'completed' | 'partial' | 'canceled' | 'refunded'
                    jap_order_id?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    service_id?: number
                    service_name?: string | null
                    link?: string
                    quantity?: number
                    cost?: number
                    status?: 'pending' | 'processing' | 'completed' | 'partial' | 'canceled' | 'refunded'
                    jap_order_id?: number | null
                    created_at?: string
                    updated_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    full_name: string | null
                    role: 'user' | 'admin' | 'reseller'
                    created_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    full_name?: string | null
                    role?: 'user' | 'admin' | 'reseller'
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    full_name?: string | null
                    role?: 'user' | 'admin' | 'reseller'
                    created_at?: string
                }
            }
        }
    }
}
