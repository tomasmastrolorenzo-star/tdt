import { createClient } from "@/lib/supabase/client"

export interface VendorLevel {
    id: string
    name: string
    min_sales: number
    max_sales: number | null
    commission_rate: number
    badge_color: string
    display_order: number
}

export interface VendorStats {
    totalSales: number
    currentLevel: VendorLevel | null
    nextLevel: VendorLevel | null
    progress: number
    commissionRate: number
    salesUntilNextLevel: number
    rank: number | null
    totalVendors: number
    referralCode?: string
}

export interface Achievement {
    id: string
    achievement_type: string
    achievement_data: any
    achieved_at: string
}

/**
 * Get all vendor levels ordered by sales requirement
 */
export async function getVendorLevels(): Promise<VendorLevel[]> {
    const supabase = createClient()

    const { data, error } = await supabase
        .from("vendor_levels")
        .select("*")
        .order("display_order", { ascending: true })

    if (error) {
        console.error("Error fetching vendor levels:", error)
        return []
    }

    return data || []
}

/**
 * Get comprehensive stats for a specific vendor
 */
export async function getVendorStats(vendorId: string): Promise<VendorStats | null> {
    const supabase = createClient()

    // Get vendor profile with level
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(`
      total_sales,
      current_level_id,
      referral_code,
      vendor_levels (*)
    `)
        .eq("id", vendorId)
        .single()

    if (profileError || !profile) {
        console.error("Error fetching vendor profile:", profileError)
        return null
    }

    const totalSales = profile.total_sales || 0
    const currentLevel = profile.vendor_levels as unknown as VendorLevel | null

    // Get all levels to determine next level
    const levels = await getVendorLevels()
    const nextLevel = levels.find(level =>
        totalSales < level.min_sales
    ) || null

    // Calculate progress to next level
    let progress = 0
    let salesUntilNextLevel = 0

    if (currentLevel && nextLevel) {
        const currentMin = currentLevel.min_sales
        const nextMin = nextLevel.min_sales
        const range = nextMin - currentMin
        const current = totalSales - currentMin
        progress = (current / range) * 100
        salesUntilNextLevel = nextMin - totalSales
    } else if (!nextLevel && currentLevel) {
        // At max level
        progress = 100
        salesUntilNextLevel = 0
    }

    // Get vendor ranking
    const { data: rankData } = await supabase
        .from("profiles")
        .select("id, total_sales")
        .eq("role", "VENDOR")
        .order("total_sales", { ascending: false })

    const rank = rankData ? rankData.findIndex(v => v.id === vendorId) + 1 : null
    const totalVendors = rankData?.length || 0

    return {
        totalSales,
        currentLevel,
        nextLevel,
        progress: Math.min(progress, 100),
        commissionRate: currentLevel?.commission_rate || 10,
        salesUntilNextLevel: Math.max(salesUntilNextLevel, 0),
        rank,
        totalVendors,
        referralCode: profile.referral_code || `VIP-${vendorId.substring(0, 6).toUpperCase()}`
    }
}

/**
 * Get vendor leaderboard
 */
export async function getVendorLeaderboard(limit: number = 10) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from("profiles")
        .select(`
      id,
      full_name,
      email,
      total_sales,
      vendor_levels (name, badge_color)
    `)
        .eq("role", "VENDOR")
        .order("total_sales", { ascending: false })
        .limit(limit)

    if (error) {
        console.error("Error fetching leaderboard:", error)
        return []
    }

    return data || []
}

/**
 * Get vendor achievements
 */
export async function getVendorAchievements(vendorId: string): Promise<Achievement[]> {
    const supabase = createClient()

    const { data, error } = await supabase
        .from("vendor_achievements")
        .select("*")
        .eq("vendor_id", vendorId)
        .order("achieved_at", { ascending: false })

    if (error) {
        console.error("Error fetching achievements:", error)
        return []
    }

    return data || []
}

/**
 * Get admin dashboard statistics
 */
export async function getAdminStats() {
    const supabase = createClient()

    // Get order statistics
    const { data: orders } = await supabase
        .from("orders")
        .select("price_final, margin_trenzo, status, created_at")

    const totalRevenue = orders?.reduce((sum, order) =>
        sum + (order.status === 'COMPLETED' ? Number(order.price_final) : 0), 0
    ) || 0

    const netProfit = orders?.reduce((sum, order) =>
        sum + (order.status === 'COMPLETED' ? Number(order.margin_trenzo) : 0), 0
    ) || 0

    const activeOrders = orders?.filter(order =>
        ['PENDING_PAYMENT', 'PROCESSING', 'PAYMENT_CONFIRMED'].includes(order.status)
    ).length || 0

    // Get vendor count
    const { count: totalVendors } = await supabase
        .from("profiles")
        .select("*", { count: 'exact', head: true })
        .eq("role", "VENDOR")

    // Calculate growth (last 30 days vs previous 30 days)
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    const recentOrders = orders?.filter(o =>
        new Date(o.created_at) >= thirtyDaysAgo && o.status === 'COMPLETED'
    ) || []

    const previousOrders = orders?.filter(o =>
        new Date(o.created_at) >= sixtyDaysAgo &&
        new Date(o.created_at) < thirtyDaysAgo &&
        o.status === 'COMPLETED'
    ) || []

    const recentRevenue = recentOrders.reduce((sum, o) => sum + Number(o.price_final), 0)
    const previousRevenue = previousOrders.reduce((sum, o) => sum + Number(o.price_final), 0)

    const revenueGrowth = previousRevenue > 0
        ? ((recentRevenue - previousRevenue) / previousRevenue) * 100
        : 0

    const ordersGrowth = previousOrders.length > 0
        ? ((recentOrders.length - previousOrders.length) / previousOrders.length) * 100
        : 0

    return {
        totalRevenue,
        netProfit,
        activeOrders,
        totalVendors: totalVendors || 0,
        revenueGrowth: Number(revenueGrowth.toFixed(1)),
        ordersGrowth: Number(ordersGrowth.toFixed(1))
    }
}

/**
 * Get operator metrics
 */
export async function getOperatorMetrics() {
    const supabase = createClient()

    const { data: orders } = await supabase
        .from("orders")
        .select("status, created_at")

    const { data: tickets } = await supabase
        .from("tickets")
        .select("status, created_at")

    const pendingOrders = orders?.filter(o =>
        o.status === 'PENDING_PAYMENT' || o.status === 'PAYMENT_CONFIRMED'
    ).length || 0

    const processingOrders = orders?.filter(o =>
        o.status === 'PROCESSING'
    ).length || 0

    const completedToday = orders?.filter(o => {
        const orderDate = new Date(o.created_at)
        const today = new Date()
        return orderDate.toDateString() === today.toDateString() && o.status === 'COMPLETED'
    }).length || 0

    const openTickets = tickets?.filter(t =>
        t.status === 'OPEN' || t.status === 'IN_PROGRESS'
    ).length || 0

    return {
        pendingOrders,
        processingOrders,
        completedToday,
        openTickets
    }
}
