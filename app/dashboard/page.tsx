import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardContent } from "@/components/dashboard/DashboardContent"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  // Check user role and redirect OPERATOR/CEO to their dashboard
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role === "CEO") {
    redirect("/dashboard/admin")
  }

  if (profile?.role === "OPERATOR") {
    redirect("/dashboard/operator/orders")
  }

  if (profile?.role === "VENDOR") {
    redirect("/dashboard/vendor")
  }

  try {
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (userError) {
      console.log("[v0] User query error:", userError.message)
    }

    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (walletError) {
      console.log("[v0] Wallet query error:", walletError.message)
    }

    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*, services(name)")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    if (ordersError) {
      console.log("[v0] Orders query error:", ordersError.message)
    }

    const { data: levels } = await supabase.from("levels").select("*").order("min_sales", { ascending: true })

    const { data: services } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("base_price", { ascending: true })

    return (
      <DashboardContent
        user={user}
        userData={userData}
        wallet={wallet}
        orders={orders || []}
        levels={levels || []}
        services={services || []}
      />
    )
  } catch (error) {
    console.log("[v0] Dashboard error:", error)
    // Return with empty data if queries fail
    return <DashboardContent user={user} userData={null} wallet={null} orders={[]} levels={[]} services={[]} />
  }
}
