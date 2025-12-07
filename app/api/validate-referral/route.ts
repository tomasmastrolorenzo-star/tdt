
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase Admin client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const code = searchParams.get('code')

        if (!code) {
            return NextResponse.json({ valid: false, message: 'Código requerido' }, { status: 400 })
        }

        // Query profiles table for the code
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('name')
            .eq('referral_code', code)
            .single()

        if (error || !data) {
            return NextResponse.json({ valid: false, message: 'Código inválido' })
        }

        return NextResponse.json({
            valid: true,
            vendorName: data.name
        })

    } catch (error) {
        console.error('Error validating referral:', error)
        return NextResponse.json({ valid: false, error: 'Internal server error' }, { status: 500 })
    }
}
