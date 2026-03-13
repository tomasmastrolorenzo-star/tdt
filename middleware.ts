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
  const protectedPaths = ["/office", "/gate", "/admin", "/dashboard"]
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    return NextResponse.redirect(loginUrl)
  }

  // Admin-only routes
  if (pathname.startsWith("/admin") && user) {
    const { data: profile } = await supabase
      .from("users")
      .select("community_role, role")
      .eq("id", user.id)
      .single()

    if (profile?.community_role !== "admin" && profile?.role !== "CEO") {
      const officeUrl = request.nextUrl.clone()
      officeUrl.pathname = "/office"
      return NextResponse.redirect(officeUrl)
    }
  }

  // Redirect authenticated users away from login/register
  if ((pathname === "/login" || pathname === "/register") && user) {
    const officeUrl = request.nextUrl.clone()
    officeUrl.pathname = "/office"
    return NextResponse.redirect(officeUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
