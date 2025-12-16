"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, TrendingUp, Search, PlusCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface VendorService {
    id: string
    jap_service_id: string
    name: string // We might need to fetch this or store it
    jap_cost: number
    selling_price: number
    margin: number
    is_active: boolean
    platform: string
}

export default function VendorServicesPage() {
    const [services, setServices] = useState<VendorService[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const supabase = createClient()

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        try {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Fetch vendor specific services or global ones if vendor_services is empty/not used yet
            // For MVP, likely we want to show ALL services available to sell?
            // Or services specifically assigned to this vendor? 
            // Based on schema, vendor_services links vendor_id to jap_service_id.

            const { data, error } = await supabase
                .from('vendor_services')
                .select('*')
                .eq('vendor_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error

            if (data) {
                setServices(data)
            }
        } catch (error) {
            console.error("Error fetching services:", error)
        } finally {
            setLoading(false)
        }
    }

    const filteredServices = services.filter(service =>
        service.jap_service_id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Mis Servicios</h1>
                    <p className="text-zinc-400">Gestiona tus precios y márgenes de ganancia.</p>
                </div>
                <Link href="/dashboard/vendor/services/new">
                    <Button className="bg-emerald-500 hover:bg-emerald-600">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Agregar Servicio
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Total Servicios</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{services.length}</div>
                    </CardContent>
                </Card>
                {/* Add more stats if needed */}
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-white">Catálogo de Servicios</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
                            <Input
                                placeholder="Buscar por ID..."
                                className="pl-8 bg-zinc-950 border-zinc-800 text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                        </div>
                    ) : services.length === 0 ? (
                        <div className="text-center py-12 text-zinc-500">
                            No tienes servicios configurados aún.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                                    <TableHead className="text-zinc-400">ID Servicio (JAP)</TableHead>
                                    <TableHead className="text-zinc-400">Costo Base</TableHead>
                                    <TableHead className="text-zinc-400">Tu Precio</TableHead>
                                    <TableHead className="text-zinc-400">Margen</TableHead>
                                    <TableHead className="text-zinc-400">Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredServices.map((service) => (
                                    <TableRow key={service.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                        <TableCell className="font-mono text-zinc-300">
                                            {service.jap_service_id}
                                        </TableCell>
                                        <TableCell className="text-zinc-300">
                                            ${service.jap_cost.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-white font-bold">
                                            ${service.selling_price.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={service.margin > 30 ? "default" : "secondary"}
                                                className={service.margin > 50 ? "bg-emerald-500/20 text-emerald-400" : ""}>
                                                {service.margin.toFixed(1)}%
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={service.is_active ? "border-emerald-500 text-emerald-500" : "border-zinc-700 text-zinc-500"}>
                                                {service.is_active ? "Activo" : "Inactivo"}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
