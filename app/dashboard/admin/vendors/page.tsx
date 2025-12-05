"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, MoreHorizontal, Mail, Shield } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Vendor {
    id: string
    full_name: string
    email: string
    role: string
    created_at: string
    total_sales?: number
}

export default function AdminVendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchVendors()
    }, [])

    const fetchVendors = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("role", "VENDOR")
                .order('created_at', { ascending: false })

            if (error) throw error

            setVendors(data || [])
        } catch (error) {
            console.error("Error fetching vendors:", error)
        } finally {
            setLoading(false)
        }
    }

    const filteredVendors = vendors.filter(vendor =>
        vendor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Vendedores</h1>
                    <p className="text-muted-foreground">Administra el equipo de ventas de TDT</p>
                </div>
                <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invitar Vendedor
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Invitar Nuevo Vendedor</DialogTitle>
                            <DialogDescription>
                                Envía una invitación por correo electrónico para unirse al equipo.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Nombre
                                </Label>
                                <Input id="name" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Email
                                </Label>
                                <Input id="email" className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Cancelar</Button>
                            <Button onClick={() => setIsInviteOpen(false)}>Enviar Invitación</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Vendedores Activos ({vendors.length})</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar vendedor..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="p-4 font-medium">Vendedor</th>
                                    <th className="p-4 font-medium">Rol</th>
                                    <th className="p-4 font-medium">Fecha Ingreso</th>
                                    <th className="p-4 font-medium">Estado</th>
                                    <th className="p-4 font-medium text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            Cargando vendedores...
                                        </td>
                                    </tr>
                                ) : filteredVendors.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            No se encontraron vendedores
                                        </td>
                                    </tr>
                                ) : (
                                    filteredVendors.map((vendor) => (
                                        <tr key={vendor.id} className="border-t hover:bg-muted/50">
                                            <td className="p-4">
                                                <div className="font-medium">{vendor.full_name || "Sin nombre"}</div>
                                                <div className="text-muted-foreground">{vendor.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="h-3 w-3 text-blue-500" />
                                                    {vendor.role}
                                                </div>
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {new Date(vendor.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                    Activo
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                        <DropdownMenuItem>
                                                            <Mail className="mr-2 h-4 w-4" />
                                                            Enviar Email
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>Ver Ventas</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600">Desactivar Cuenta</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
