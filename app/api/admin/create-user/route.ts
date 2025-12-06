import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Cliente admin con Service Role Key
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

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // 1. Verificar que quien hace la petición es Admin
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autenticado' }, 
        { status: 401 }
      )
    }

    // 2. Verificar rol de admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'No tienes permisos para crear usuarios' }, 
        { status: 403 }
      )
    }

    // 3. Obtener datos del nuevo usuario
    const { email, password, name, role, initial_level } = await request.json()

    // 4. Validar datos
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: email, password, name, role' },
        { status: 400 }
      )
    }

    if (!['vendor', 'operator', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Rol inválido. Debe ser: vendor, operator, o admin' },
        { status: 400 }
      )
    }

    // Validar nivel inicial si es vendor
    if (role === 'vendor' && initial_level) {
      if (!['novato', 'pro', 'experto', 'elite'].includes(initial_level)) {
        return NextResponse.json(
          { error: 'Nivel inválido. Debe ser: novato, pro, experto, o elite' },
          { status: 400 }
        )
      }
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // 5. Verificar si el email ya existe
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
    const emailExists = existingUser?.users?.some(u => u.email === email)

    if (emailExists) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      )
    }

    // 6. Crear usuario en Supabase Auth usando Admin API
    const { data: newUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        name,
        role
      }
    })

    if (authError) {
      console.error('Error creating user in Auth:', authError)
      return NextResponse.json(
        { error: `Error al crear usuario: ${authError.message}` },
        { status: 400 }
      )
    }

    // 7. Crear perfil en tabla profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: newUser.user.id,
        email,
        name,
        role,
        created_at: new Date().toISOString(),
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
      
      // Si falla la creación del perfil, eliminar usuario de Auth
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
      
      return NextResponse.json(
        { error: `Error al crear perfil: ${profileError.message}` },
        { status: 400 }
      )
    }

    // 8. Si es vendor, crear entrada en vendor_stats con nivel inicial
    if (role === 'vendor') {
      const vendorLevel = initial_level || 'novato' // Default a novato si no se especifica
      
      const { error: statsError } = await supabase
        .from('vendor_stats')
        .insert({
          vendor_id: newUser.user.id,
          total_sales: 0,
          total_commission: 0,
          current_level: vendorLevel,
          created_at: new Date().toISOString(),
        })

      if (statsError) {
        console.error('Error creating vendor stats:', statsError)
        // No es crítico, continuar
      }
    }

    // 9. Retornar éxito
    return NextResponse.json({
      success: true,
      user: {
        id: newUser.user.id,
        email,
        name,
        role,
        level: role === 'vendor' ? (initial_level || 'novato') : undefined
      },
      message: `Usuario ${name} creado exitosamente como ${role}${role === 'vendor' ? ` (Nivel: ${initial_level || 'novato'})` : ''}`
    })

  } catch (error: any) {
    console.error('Unexpected error in create-user API:', error)
    return NextResponse.json(
      { error: `Error inesperado: ${error.message}` },
      { status: 500 }
    )
  }
}
