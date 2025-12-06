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

// Componente de formulario para crear vendedor
function CreateVendorForm({ onSuccess }: { onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'vendor' as 'vendor' | 'operator' | 'admin',
        initial_level: 'novato' as 'novato' | 'pro' | 'experto' | 'elite'
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch('/api/admin/create-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear usuario')
            }

            // Mostrar mensaje de éxito
            alert(`✅ ${data.message}`)

            // Resetear formulario
            setFormData({ name: '', email: '', password: '', role: 'vendor', initial_level: 'novato' })

            // Llamar callback de éxito
            onSuccess()

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Juan Pérez"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="juan@ejemplo.com"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    El usuario podrá cambiar su contraseña después de iniciar sesión
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="role">Rol *</Label>
                <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    required
                >
                    <option value="vendor">Vendedor</option>
                    <option value="operator">Operador</option>
                    <option value="admin">Administrador</option>
                </select>
                <p className="text-xs text-muted-foreground">
                    {formData.role === 'vendor' && '• Puede ver sus ventas y comisiones'}
                    {formData.role === 'operator' && '• Puede gestionar órdenes y tickets'}
                    {formData.role === 'admin' && '• Acceso completo al sistema'}
                </p>
            </div>

            {/* Selector de Nivel Inicial - Solo para Vendedores */}
            {formData.role === 'vendor' && (
                <div className="space-y-2 border-t pt-4">
                    <Label htmlFor="initial_level">Nivel Inicial *</Label>
                    <select
                        id="initial_level"
                        value={formData.initial_level}
                        onChange={(e) => setFormData({ ...formData, initial_level: e.target.value as any })}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md"
                        required
                    >
                        <option value="novato">🌱 Novato (10% comisión)</option>
                        <option value="pro">⚡ Pro (15% comisión)</option>
                        <option value="experto">🔥 Experto (20% comisión)</option>
                        <option value="elite">👑 Elite (25% comisión)</option>
                    </select>
                    <p className="text-xs text-muted-foreground">
                        {formData.initial_level === 'novato' && '• Nivel inicial estándar para nuevos vendedores'}
                        {formData.initial_level === 'pro' && '• Para vendedores con experiencia comprobada'}
                        {formData.initial_level === 'experto' && '• Para vendedores top con historial de ventas'}
                        {formData.initial_level === 'elite' && '• Nivel máximo, solo para vendedores excepcionales'}
                    </p>
                </div>
            )}

            <DialogFooter>
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto"
                >
                    {loading ? 'Creando...' : 'Crear Usuario'}
                </Button>
            </DialogFooter>
        </form>
    )
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
                .eq("role", "vendor")
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
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Crear Nuevo Vendedor</DialogTitle>
                            <DialogDescription>
                                Completa los datos para crear una cuenta de vendedor en el sistema.
                            </DialogDescription>
                        </DialogHeader>
                        <CreateVendorForm
                            onSuccess={() => {
                                setIsInviteOpen(false)
                                fetchVendors()
                            }}
                        />
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
