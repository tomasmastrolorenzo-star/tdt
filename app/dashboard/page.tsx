import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardContent } from "@/components/dashboard/DashboardContent"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: userData } = await supabase.from("users").select("*, levels(*)").eq("id", user.id).single()

  const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", user.id).single()

  const { data: orders } = await supabase
    .from("orders")
    .select("*, services(name)")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  const { data: levels } = await supabase.from("levels").select("*").order("min_sales", { ascending: true })

  const { data: services } = await supabase.from("services").select("*").order("base_price", { ascending: true })

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
}
