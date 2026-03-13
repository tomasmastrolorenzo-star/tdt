import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  // Protected routes: require authenticated session
  const protectedPaths = ["/office", "/gate", "/admin", "/dashboard", "/pending"]
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    return NextResponse.redirect(loginUrl)
  }

  if (user && isProtected) {
    // Determine exact state against database
    const { data: profile } = await supabase
      .from("users")
      .select("community_role, role, bingx_uid, bingx_verified")
      .eq("id", user.id)
      .single()

    const isAdmin = profile?.community_role === "admin" || profile?.role === "CEO"
    const hasUid = !!profile?.bingx_uid
    const isVerified = !!profile?.bingx_verified

    // Admin role check for /admin path
    if (pathname.startsWith("/admin") && !isAdmin) {
      const officeUrl = request.nextUrl.clone()
      officeUrl.pathname = "/office"
      return NextResponse.redirect(officeUrl)
    }

    // Role-based path enforcement for NON-admins
    if (!isAdmin) {
      // 1. Trying to access /office without verification
      if (pathname.startsWith("/office") && !isVerified) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = hasUid ? "/pending" : "/gate"
        return NextResponse.redirect(redirectUrl)
      }

      // 2. Trying to access /gate when already submitted
      if (pathname.startsWith("/gate") && hasUid) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = isVerified ? "/office" : "/pending"
        return NextResponse.redirect(redirectUrl)
      }

      // 3. Trying to access /pending when fully verified or missing UID
      if (pathname.startsWith("/pending")) {
        if (isVerified) {
          const redirectUrl = request.nextUrl.clone()
          redirectUrl.pathname = "/office"
          return NextResponse.redirect(redirectUrl)
        }
        if (!hasUid) {
          const redirectUrl = request.nextUrl.clone()
          redirectUrl.pathname = "/gate"
          return NextResponse.redirect(redirectUrl)
        }
      }
    }
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === "/login" || pathname === "/register") && user) {
    const { data: profile } = await supabase
      .from("users")
      .select("community_role, role, bingx_uid, bingx_verified")
      .eq("id", user.id)
      .single()

    let dest = "/office"
    if (profile?.community_role === "admin" || profile?.role === "CEO") dest = "/admin"
    else if (!profile?.bingx_verified) dest = profile?.bingx_uid ? "/pending" : "/gate"
    
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = dest
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
