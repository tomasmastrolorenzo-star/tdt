import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Verify caller is admin
    const { data: adminProfile } = await supabase
        .from("users")
        .select("community_role, role")
        .eq("id", user.id)
        .single()

    if (adminProfile?.community_role !== "admin" && adminProfile?.role !== "CEO") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const formData = await req.formData()
    const memberId = formData.get("memberId") as string
    const verified = formData.get("verified") === "true"

    const { error } = await supabase
        .from("users")
        .update({ bingx_verified: verified })
        .eq("id", memberId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Redirect back to admin page
    return NextResponse.redirect(new URL("/admin", req.url))
}
