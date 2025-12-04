
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

const users = [
    {
        email: 'admin@tdt.com',
        password: 'adminPassword123!',
        role: 'CEO',
        name: 'Admin User'
    },
    {
        email: 'operator@tdt.com',
        password: 'operatorPassword123!',
        role: 'OPERATOR',
        name: 'Traffic Operator'
    },
    {
        email: 'vendor@tdt.com',
        password: 'vendorPassword123!',
        role: 'VENDOR',
        name: 'Vendor User'
    }
]

async function seedUsers() {
    console.log('🌱 Seeding users...')

    for (const user of users) {
        try {
            console.log(`Creating user: ${user.email} (${user.role})...`)

            // 1. Create user in Supabase Auth
            const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
                email: user.email,
                password: user.password,
                email_confirm: true,
                user_metadata: {
                    full_name: user.name
                }
            })

            if (authError) {
                console.error(`Error creating auth user ${user.email}:`, authError.message)
                continue
            }

            if (!authUser.user) {
                console.error(`User created but no user object returned for ${user.email}`)
                continue
            }

            const userId = authUser.user.id

            // 2. Create user in public.users table
            const { error: dbError } = await supabase
                .from('users')
                .upsert({
                    id: userId,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    nda_signed: true, // Auto-sign NDA for test users
                    nda_signed_at: new Date().toISOString()
                })

            if (dbError) {
                console.error(`Error creating DB user ${user.email}:`, dbError.message)
            } else {
                console.log(`✅ User ${user.email} created successfully!`)
            }

        } catch (err) {
            console.error(`Unexpected error for ${user.email}:`, err)
        }
    }

    console.log('✨ Seeding completed!')
}

seedUsers()
