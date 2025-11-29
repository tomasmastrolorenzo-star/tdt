import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/types/database'

type TransactionType = Database['public']['Tables']['transactions']['Row']['type']

export class TDTFinance {
    /**
     * Get current credit balance for a user
     */
    static async getBalance(userId: string): Promise<number> {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('credits')
            .select('balance')
            .eq('user_id', userId)
            .single()

        if (error) throw error
        return data?.balance || 0
    }

    /**
     * Add credits to a user's wallet (Deposit/Refund)
     */
    static async addCredits(userId: string, amount: number, description: string, type: TransactionType = 'deposit') {
        const supabase = await createClient()

        // 1. Get current balance
        const currentBalance = await this.getBalance(userId)

        // 2. Update balance
        const { error: updateError } = await supabase
            .from('credits')
            .update({ balance: currentBalance + amount })
            .eq('user_id', userId)

        if (updateError) throw updateError

        // 3. Log transaction
        const { error: txError } = await supabase
            .from('transactions')
            .insert({
                user_id: userId,
                amount: amount,
                type: type,
                description
            })

        if (txError) {
            console.error('Transaction log failed', txError)
        }

        return true
    }

    /**
     * Deduct credits from a user's wallet (Purchase)
     */
    static async deductCredits(userId: string, amount: number, description: string) {
        const supabase = await createClient()

        // 1. Get current balance
        const currentBalance = await this.getBalance(userId)

        if (currentBalance < amount) {
            throw new Error('Insufficient funds')
        }

        // 2. Update balance
        const { error: updateError } = await supabase
            .from('credits')
            .update({ balance: currentBalance - amount })
            .eq('user_id', userId)

        if (updateError) throw updateError

        // 3. Log transaction
        const { error: txError } = await supabase
            .from('transactions')
            .insert({
                user_id: userId,
                amount: -amount,
                type: 'purchase',
                description
            })

        if (txError) {
            console.error('Transaction log failed', txError)
        }

        return true
    }
}
