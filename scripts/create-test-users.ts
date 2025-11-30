// Script para crear usuarios de prueba en Supabase Auth
// Ejecutar este script manualmente con: npx ts-node scripts/create-test-users.ts

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://hvgawmcwzsgmhagpqgin.supabase.co"
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

interface TestUser {
  email: string
  password: string
  name: string
  role: "CEO" | "OPERATOR" | "VENDOR"
  level_id: string
  existingId: string
}

const testUsers: TestUser[] = [
  {
    email: "ceo@tdt.com",
    password: "TdtCeo2024!",
    name: "Carlos CEO",
    role: "CEO",
    level_id: "83b1ef58-089c-4baa-bdb7-8e39df6d6706", // Master
    existingId: "11111111-1111-1111-1111-111111111111",
  },
  {
    email: "vendedor.novato@tdt.com",
    password: "TdtNovato2024!",
    name: "Juan Novato",
    role: "VENDOR",
    level_id: "0820ca6f-31d4-4a87-a38a-a66cabd919a6", // Novato
    existingId: "22222222-2222-2222-2222-222222222222",
  },
  {
    email: "vendedor.intermedio@tdt.com",
    password: "TdtIntermedio2024!",
    name: "Maria Intermedio",
    role: "VENDOR",
    level_id: "9bf9af85-cdd4-4c3c-a218-205780cb397a", // Intermedio
    existingId: "33333333-3333-3333-3333-333333333333",
  },
  {
    email: "vendedor.avanzado@tdt.com",
    password: "TdtAvanzado2024!",
    name: "Pedro Avanzado",
    role: "VENDOR",
    level_id: "d78bcd5c-8318-4737-9c5d-3dfcafe63282", // Avanzado
    existingId: "44444444-4444-4444-4444-444444444444",
  },
  {
    email: "vendedor.experto@tdt.com",
    password: "TdtExperto2024!",
    name: "Ana Experto",
    role: "VENDOR",
    level_id: "b4c8ff9d-37ee-48dc-a919-fa483664534b", // Experto
    existingId: "55555555-5555-5555-5555-555555555555",
  },
  {
    email: "vendedor.master@tdt.com",
    password: "TdtMaster2024!",
    name: "Luis Master",
    role: "VENDOR",
    level_id: "83b1ef58-089c-4baa-bdb7-8e39df6d6706", // Master
    existingId: "66666666-6666-6666-6666-666666666666",
  },
]

async function createTestUsers() {
  console.log("Starting test user creation...\n")

  for (const user of testUsers) {
    try {
      // First, delete the existing user from public.users table
      const { error: deleteError } = await supabaseAdmin.from("users").delete().eq("id", user.existingId)

      if (deleteError) {
        console.log(`Note: Could not delete existing user ${user.email}: ${deleteError.message}`)
      }

      // Delete wallet too
      await supabaseAdmin.from("wallets").delete().eq("user_id", user.existingId)

      // Create the user in Supabase Auth
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: user.name,
          role: user.role,
        },
      })

      if (error) {
        console.log(`ERROR creating ${user.email}: ${error.message}`)
        continue
      }

      console.log(`SUCCESS: Created ${user.email}`)
      console.log(`  - ID: ${data.user.id}`)
      console.log(`  - Password: ${user.password}`)
      console.log(`  - Role: ${user.role}`)
      console.log("")

      // The trigger should automatically create the user in public.users
      // But let's update the level_id
      const { error: updateError } = await supabaseAdmin
        .from("users")
        .update({
          level_id: user.level_id,
          role: user.role,
        })
        .eq("id", data.user.id)

      if (updateError) {
        console.log(`  Note: Could not update level: ${updateError.message}`)
      }
    } catch (err) {
      console.log(`EXCEPTION for ${user.email}:`, err)
    }
  }

  console.log("\n========================================")
  console.log("TEST USERS CREDENTIALS:")
  console.log("========================================\n")

  testUsers.forEach((user) => {
    console.log(`${user.role} - ${user.name}`)
    console.log(`  Email: ${user.email}`)
    console.log(`  Password: ${user.password}`)
    console.log("")
  })
}

createTestUsers()
