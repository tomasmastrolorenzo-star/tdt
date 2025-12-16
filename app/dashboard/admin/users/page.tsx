"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, MoreHorizontal, Mail, Shield, User } from "lucide-react"
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

interface UserProfile {
    id: string
    full_name: string
    email: string
    role: string
    created_at: string
}

// Componente de formulario para crear usuario (Genérico)
function CreateUserForm({ onSuccess }: { onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user' as 'user' | 'vendor' | 'operator' | 'admin' | 'ceo',
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
            setFormData({ name: '', email: '', password: '', role: 'user', initial_level: 'novato' })

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
                    placeholder="Nombre Apellido"
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
                    placeholder="usuario@ejemplo.com"
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
                    <option value="user">Usuario (Cliente)</option>
                    <option value="vendor">Vendedor</option>
                    <option value="operator">Operador</option>
                    <option value="admin">Administrador</option>
                </select>
            </div>

            {/* Selector de Nivel Inicial - Solo para Vendedores */}
            {formData.role === 'vendor' && (
                <div className="space-y-2 border-t pt-4">
                    <Label htmlFor="initial_level">Nivel Inicial (Vendedor)</Label>
                    <select
                        id="initial_level"
                        value={formData.initial_level}
                        onChange={(e) => setFormData({ ...formData, initial_level: e.target.value as any })}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md"
                        required
                    >
                        <option value="novato">🌱 Novato</option>
                        <option value="pro">⚡ Pro</option>
                        <option value="experto">🔥 Experto</option>
                        <option value="elite">👑 Elite</option>
                    </select>
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

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .order('created_at', { ascending: false })

            if (error) throw error

            setUsers(data || [])
        } catch (error) {
            console.error("Error fetching users:", error)
        } finally {
            setLoading(false)
        }
    }

    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
            case 'CEO':
                return <Badge variant="default" className="bg-red-500">Admin</Badge>
            case 'operator':
                return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Operador</Badge>
            case 'vendor':
                return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Vendedor</Badge>
            default: // user
                return <Badge variant="outline">Usuario</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
                    <p className="text-muted-foreground">Gestión total de usuarios del sistema</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Nuevo Usuario
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                            <DialogDescription>
                                Crea una cuenta manualmente (Cliente, Vendedor, Operador o Admin).
                            </DialogDescription>
                        </DialogHeader>
                        <CreateUserForm
                            onSuccess={() => {
                                setIsCreateOpen(false)
                                fetchUsers()
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Todos los Usuarios ({users.length})</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nombre, email o rol..."
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
                                    <th className="p-4 font-medium">Usuario</th>
                                    <th className="p-4 font-medium">Rol</th>
                                    <th className="p-4 font-medium">Fecha Registro</th>
                                    <th className="p-4 font-medium text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                            Cargando usuarios...
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                            No se encontraron usuarios
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="border-t hover:bg-muted/50">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                        <User className="w-4 h-4 text-slate-500" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{user.full_name || "Sin nombre"}</div>
                                                        <div className="text-muted-foreground text-xs">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {getRoleBadge(user.role)}
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Mail className="mr-2 h-4 w-4" />
                                                            Enviar Email
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">
                                                            Bloquear/Eliminar
                                                        </DropdownMenuItem>
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
