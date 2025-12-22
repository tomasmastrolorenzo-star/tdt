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

import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

interface UserProfile {
    id: string
    full_name: string
    email: string
    role: string
    created_at: string
}

// User Creation Form Component
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
                throw new Error(data.error || 'Error creating user')
            }

            toast.success(`User created successfully: ${data.message}`)
            setFormData({ name: '', email: '', password: '', role: 'user', initial_level: 'novato' })
            onSuccess()

        } catch (err: any) {
            setError(err.message)
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="bg-zinc-900 border-zinc-800"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email address *</Label>
                <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@example.com"
                    className="bg-zinc-900 border-zinc-800"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="bg-zinc-900 border-zinc-800"
                    minLength={6}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="role">Account Role *</Label>
                <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-zinc-800 bg-zinc-900 text-white rounded-md text-sm"
                    required
                >
                    <option value="user">User (Client)</option>
                    <option value="vendor">Vendor</option>
                    <option value="operator">Operator</option>
                    <option value="admin">Administrator</option>
                    <option value="ceo">CEO</option>
                </select>
            </div>

            {formData.role === 'vendor' && (
                <div className="space-y-2 border-t border-zinc-800 pt-4">
                    <Label htmlFor="initial_level">Initial Level (For Vendors)</Label>
                    <select
                        id="initial_level"
                        value={formData.initial_level}
                        onChange={(e) => setFormData({ ...formData, initial_level: e.target.value as any })}
                        className="w-full px-3 py-2 border border-zinc-800 bg-zinc-900 text-white rounded-md text-sm"
                        required
                    >
                        <option value="novato">🌱 Novato (Rookie)</option>
                        <option value="pro">⚡ Pro</option>
                        <option value="experto">🔥 Expert</option>
                        <option value="elite">👑 Elite</option>
                    </select>
                </div>
            )}

            <DialogFooter>
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
                >
                    {loading ? 'Processing...' : 'Create Account'}
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
            toast.error("Failed to load users")
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
        switch (role?.toUpperCase()) {
            case 'ADMIN':
            case 'CEO':
                return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Admin</Badge>
            case 'OPERATOR':
                return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Operator</Badge>
            case 'VENDOR':
                return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Vendor</Badge>
            default:
                return <Badge variant="outline" className="text-zinc-500 border-zinc-800">User</Badge>
        }
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Advanced User Management</h1>
                    <p className="text-zinc-400">Manage all registered accounts and roles across the platform.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite/Create User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>Add New Account</DialogTitle>
                            <DialogDescription className="text-zinc-500">
                                Create a new account manually for a client, vendor, or internal staff.
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

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="border-b border-zinc-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-xl font-semibold text-white">Network Accounts ({users.length})</CardTitle>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <Input
                                placeholder="Search by name, email or role..."
                                className="pl-10 bg-zinc-950 border-zinc-800 text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-zinc-950/50 text-zinc-500 uppercase text-[10px] tracking-widest font-bold">
                                <tr>
                                    <th className="p-4 border-b border-zinc-800">User Details</th>
                                    <th className="p-4 border-b border-zinc-800">Role</th>
                                    <th className="p-4 border-b border-zinc-800">Member Since</th>
                                    <th className="p-4 border-b border-zinc-800 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {loading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i}>
                                            <td className="p-4"><Skeleton className="h-10 w-full bg-zinc-800" /></td>
                                            <td className="p-4"><Skeleton className="h-6 w-20 bg-zinc-800" /></td>
                                            <td className="p-4"><Skeleton className="h-6 w-32 bg-zinc-800" /></td>
                                            <td className="p-4 text-right"><Skeleton className="h-8 w-8 ml-auto bg-zinc-800" /></td>
                                        </tr>
                                    ))
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-zinc-500 bg-zinc-950/20">
                                            No users found matching your search criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 group-hover:border-indigo-500/50 transition-colors">
                                                        <User className="w-5 h-5 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-white">{user.full_name || "Anonymous"}</div>
                                                        <div className="text-zinc-500 text-xs">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {getRoleBadge(user.role)}
                                            </td>
                                            <td className="p-4 text-zinc-400 font-mono text-xs">
                                                {new Date(user.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="p-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-zinc-800 hover:text-white">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white">
                                                        <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator className="bg-zinc-800" />
                                                        <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800">
                                                            <Mail className="mr-2 h-4 w-4" />
                                                            Contact via Email
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800">
                                                            <Shield className="mr-2 h-4 w-4 text-indigo-400" />
                                                            Modify Permissions
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-zinc-800" />
                                                        <DropdownMenuItem className="text-red-500 cursor-pointer hover:bg-red-500/10 hover:text-red-400">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Disable/Delete Account
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
