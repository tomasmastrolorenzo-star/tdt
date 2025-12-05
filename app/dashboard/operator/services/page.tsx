"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    CheckCircle2,
    XCircle,
    RefreshCw,
    DollarSign,
    TrendingUp,
    Instagram,
    Music2,
    Youtube,
    AlertCircle,
    Info,
    LogOut,
    Loader2
} from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
    instagramFollowersPackages,
    tiktokFollowersPackages,
    youtubeSubscribersPackages,
    type PackageTier
} from "@/lib/trend-up/packages"

interface JapService {
    service: string
    name: string
    type: string
    rate: string
    min: string
    max: string
    category: string
}

interface ServiceStatus {
    package: PackageTier
    japService?: JapService
    status: "active" | "missing" | "error"
    margin?: number
    marginPercent?: number
}

export default function AdminServicesPage() {
    const [loading, setLoading] = useState(true)
    const [balance, setBalance] = useState<string | null>(null)
    const [currency, setCurrency] = useState<string>("USD")
    const [instagramStatus, setInstagramStatus] = useState<ServiceStatus[]>([])
    const [tiktokStatus, setTiktokStatus] = useState<ServiceStatus[]>([])
    const [youtubeStatus, setYoutubeStatus] = useState<ServiceStatus[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isMock, setIsMock] = useState<boolean>(false)
    const [loggingOut, setLoggingOut] = useState(false)

    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        setLoggingOut(true)
        await supabase.auth.signOut()
        router.push("/login")
        router.refresh()
    }

    const fetchServicesStatus = async () => {
        setLoading(true)
        setError(null)

        try {
            // Fetch JAP services
            const response = await fetch("/api/jap/services")
            if (!response.ok) {
                throw new Error("Failed to fetch JAP services")
            }

            const data = await response.json()
            const japServices: JapService[] = data.services

            // Check if using mock data
            setIsMock(data.isMock || false)

            // Set balance
            if (data.balance) {
                setBalance(data.balance.balance)
                setCurrency(data.balance.currency)
            }

            // Check Instagram services
            const igStatus = instagramFollowersPackages.map(pkg => {
                const japService = japServices.find(s => s.service === pkg.japServiceId)
                if (japService) {
                    const rate = parseFloat(japService.rate)
                    const margin = pkg.price - rate
                    const marginPercent = (margin / pkg.price) * 100
                    return {
                        package: pkg,
                        japService,
                        status: "active" as const,
                        margin,
                        marginPercent
                    }
                }
                return {
                    package: pkg,
                    status: "missing" as const
                }
            })
            setInstagramStatus(igStatus)

            // Check TikTok services
            const ttStatus = tiktokFollowersPackages.map(pkg => {
                const japService = japServices.find(s => s.service === pkg.japServiceId)
                if (japService) {
                    const rate = parseFloat(japService.rate)
                    const margin = pkg.price - rate
                    const marginPercent = (margin / pkg.price) * 100
                    return {
                        package: pkg,
                        japService,
                        status: "active" as const,
                        margin,
                        marginPercent
                    }
                }
                return {
                    package: pkg,
                    status: "missing" as const
                }
            })
            setTiktokStatus(ttStatus)

            // Check YouTube services
            const ytStatus = youtubeSubscribersPackages.map(pkg => {
                const japService = japServices.find(s => s.service === pkg.japServiceId)
                if (japService) {
                    const rate = parseFloat(japService.rate)
                    const margin = pkg.price - rate
                    const marginPercent = (margin / pkg.price) * 100
                    return {
                        package: pkg,
                        japService,
                        status: "active" as const,
                        margin,
                        marginPercent
                    }
                }
                return {
                    package: pkg,
                    status: "missing" as const
                }
            })
            setYoutubeStatus(ytStatus)

        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error occurred")
        } finally {
            setLoading(false)
        }
    }

    const checkAuthAndLoad = async () => {
        setLoading(true)

        // Check user role
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push("/login")
            return
        }

        const { data: userData } = await supabase.from("profiles").select("role").eq("id", user.id).single()

        if (!userData || (userData.role !== "OPERATOR" && userData.role !== "CEO")) {
            setLoading(false)
            return
        }

        await fetchServicesStatus()
    }

    useEffect(() => {
        checkAuthAndLoad()
    }, [])

    const renderServiceCard = (status: ServiceStatus, platform: string) => {
        const { package: pkg, japService, margin, marginPercent } = status

        return (
            <Card key={pkg.id} className="relative">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                                {pkg.emoji} {pkg.name}
                                {status.status === "active" && (
                                    <Badge variant="default" className="bg-green-500">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Active
                                    </Badge>
                                )}
                                {status.status === "missing" && (
                                    <Badge variant="destructive">
                                        <XCircle className="w-3 h-3 mr-1" />
                                        Missing
                                    </Badge>
                                )}
                            </CardTitle>
                            <CardDescription>
                                Service ID: <code className="text-xs bg-muted px-1 py-0.5 rounded">{pkg.japServiceId}</code>
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-muted-foreground">Quantity</p>
                            <p className="font-semibold">{pkg.followers.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Sale Price</p>
                            <p className="font-semibold text-green-600">${pkg.price}</p>
                        </div>
                    </div>

                    {japService && (
                        <>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-muted-foreground">JAP Rate</p>
                                    <p className="font-semibold">${japService.rate}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Profit Margin</p>
                                    <p className="font-semibold text-blue-600">
                                        ${margin?.toFixed(2)} ({marginPercent?.toFixed(1)}%)
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Min/Max</p>
                                    <p className="font-semibold text-xs">
                                        {japService.min} - {japService.max}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Delivery</p>
                                    <p className="font-semibold">{pkg.delivery}</p>
                                </div>
                            </div>

                            <div className="pt-2 border-t">
                                <p className="text-xs text-muted-foreground">JAP Service Name</p>
                                <p className="text-xs font-medium truncate">{japService.name}</p>
                            </div>
                        </>
                    )}

                    {status.status === "missing" && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                                This service ID is not configured in your JAP panel. Please add it to start selling.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        )
    }

    const calculateStats = (statuses: ServiceStatus[]) => {
        const active = statuses.filter(s => s.status === "active").length
        const missing = statuses.filter(s => s.status === "missing").length
        const avgMargin = statuses
            .filter(s => s.marginPercent)
            .reduce((acc, s) => acc + (s.marginPercent || 0), 0) / active || 0

        return { active, missing, avgMargin }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground">Loading services...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Services Configuration</h1>
                    <p className="text-muted-foreground">Manage your JAP services and pricing</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={fetchServicesStatus} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                    >
                        {loggingOut ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <LogOut className="w-4 h-4 mr-2" />
                                Salir
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Mock Data Warning */}
            {isMock && (
                <Alert className="bg-yellow-50 border-yellow-200">
                    <Info className="h-4 w-4 text-yellow-600" />
                    <AlertTitle className="text-yellow-800">Using Mock Data</AlertTitle>
                    <AlertDescription className="text-yellow-700">
                        You're viewing simulated data because JAP_API_KEY is not configured.
                        Configure your API Key in <code className="bg-yellow-100 px-1 py-0.5 rounded">.env.local</code> to see real data.
                    </AlertDescription>
                </Alert>
            )}

            {/* Error Alert */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Balance Card */}
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        JAP Account Balance {isMock && <Badge variant="secondary" className="ml-2">MOCK</Badge>}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">
                        {currency} {balance || "0.00"}
                    </p>
                </CardContent>
            </Card>

            {/* Services Tabs */}
            <Tabs defaultValue="instagram" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="instagram" className="flex items-center gap-2">
                        <Instagram className="w-4 h-4" />
                        Instagram
                    </TabsTrigger>
                    <TabsTrigger value="tiktok" className="flex items-center gap-2">
                        <Music2 className="w-4 h-4" />
                        TikTok
                    </TabsTrigger>
                    <TabsTrigger value="youtube" className="flex items-center gap-2">
                        <Youtube className="w-4 h-4" />
                        YouTube
                    </TabsTrigger>
                </TabsList>

                {/* Instagram Tab */}
                <TabsContent value="instagram" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-green-600">
                                    {calculateStats(instagramStatus).active}/{instagramStatus.length}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Missing Services</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-red-600">
                                    {calculateStats(instagramStatus).missing}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Avg. Margin
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-blue-600">
                                    {calculateStats(instagramStatus).avgMargin.toFixed(1)}%
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {instagramStatus.map(status => renderServiceCard(status, "Instagram"))}
                    </div>
                </TabsContent>

                {/* TikTok Tab */}
                <TabsContent value="tiktok" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-green-600">
                                    {calculateStats(tiktokStatus).active}/{tiktokStatus.length}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Missing Services</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-red-600">
                                    {calculateStats(tiktokStatus).missing}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Avg. Margin
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-blue-600">
                                    {calculateStats(tiktokStatus).avgMargin.toFixed(1)}%
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tiktokStatus.map(status => renderServiceCard(status, "TikTok"))}
                    </div>
                </TabsContent>

                {/* YouTube Tab */}
                <TabsContent value="youtube" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-green-600">
                                    {calculateStats(youtubeStatus).active}/{youtubeStatus.length}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Missing Services</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-red-600">
                                    {calculateStats(youtubeStatus).missing}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Avg. Margin
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-blue-600">
                                    {calculateStats(youtubeStatus).avgMargin.toFixed(1)}%
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {youtubeStatus.map(status => renderServiceCard(status, "YouTube"))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
