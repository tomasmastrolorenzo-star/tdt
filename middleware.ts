import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Protected routes strictly maintained by session mapping
  const protectedPaths = ["/office", "/admin"]
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  // 1. If hitting protected route without an active session -> Block and redirect
  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    return NextResponse.redirect(loginUrl)
  }

  // 2. Role-based Access Control (RBAC)
  if (user && isProtected) {
    // Fetch profile for role verification
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role?.toLowerCase()
    
    // Restricted routes for Setters (vendors)
    const CEO_ONLY_ROUTES = [
      '/admin/ceo',
      '/admin/clients',
      '/admin/traffic',
      '/admin/scripts',
      '/admin/scripts/generate',
      '/admin/leads/import'
    ]

    const isCeoRoute = CEO_ONLY_ROUTES.some(p => pathname.startsWith(p))

    if (role === 'vendor' && isCeoRoute) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = "/admin/leads"
      return NextResponse.redirect(redirectUrl)
    }
  }

  // 3. If already logged in but visiting auth routes or landing -> Redirect to dashboard
  if (user && (pathname === "/login" || pathname === "/register" || pathname === "/")) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/office"
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|api|favicon.ico|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
