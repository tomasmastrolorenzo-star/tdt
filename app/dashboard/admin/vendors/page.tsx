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

import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

interface Vendor {
    id: string
    full_name: string
    email: string
    role: string
    created_at: string
    total_sales?: number
}

// Vendor Creation Form Component
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
                throw new Error(data.error || 'Error creating vendor')
            }

            toast.success(`Success: ${data.message}`)
            setFormData({ name: '', email: '', password: '', role: 'vendor', initial_level: 'novato' })
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
                    placeholder="Jane Doe"
                    className="bg-zinc-900 border-zinc-800"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="vendor@example.com"
                    className="bg-zinc-900 border-zinc-800"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Temporary Password *</Label>
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
                <p className="text-[10px] text-zinc-500">
                    The vendor should change this password upon first login.
                </p>
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
                    <option value="vendor">Vendor (Sales Agent)</option>
                    <option value="operator">Operator (Process Order)</option>
                    <option value="admin">Administrator (Manager)</option>
                </select>
                <p className="text-[10px] text-zinc-500">
                    {formData.role === 'vendor' && '• Access to sales stats and commission tracking'}
                    {formData.role === 'operator' && '• Access to order fulfillment and support tickets'}
                    {formData.role === 'admin' && '• Full administrative control'}
                </p>
            </div>

            {formData.role === 'vendor' && (
                <div className="space-y-2 border-t border-zinc-800 pt-4">
                    <Label htmlFor="initial_level">Initial Commission Tier *</Label>
                    <select
                        id="initial_level"
                        value={formData.initial_level}
                        onChange={(e) => setFormData({ ...formData, initial_level: e.target.value as any })}
                        className="w-full px-3 py-2 border border-zinc-800 bg-zinc-900 text-white rounded-md text-sm"
                        required
                    >
                        <option value="novato">🌱 Rookie (10% Margin)</option>
                        <option value="pro">⚡ Pro (15% Margin)</option>
                        <option value="experto">🔥 Expert (20% Margin)</option>
                        <option value="elite">👑 Elite (25% Margin)</option>
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
            toast.error("Failed to load vendor list")
        } finally {
            setLoading(false)
        }
    }

    const filteredVendors = vendors.filter(vendor =>
        vendor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Vendor Management</h1>
                    <p className="text-zinc-400">Manage your global sales team and commission structures.</p>
                </div>
                <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite Vendor
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>Add New Sales Agent</DialogTitle>
                            <DialogDescription className="text-zinc-500">
                                Set up a new vendor account with specific commission tiers.
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

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="border-b border-zinc-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-xl font-semibold text-white">Active Vendors ({vendors.length})</CardTitle>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <Input
                                placeholder="Search by name or email..."
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
                                    <th className="p-4 border-b border-zinc-800">Sales Agent</th>
                                    <th className="p-4 border-b border-zinc-800">Account Role</th>
                                    <th className="p-4 border-b border-zinc-800">Joined Date</th>
                                    <th className="p-4 border-b border-zinc-800">Status</th>
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
                                            <td className="p-4"><Skeleton className="h-6 w-16 bg-zinc-800" /></td>
                                            <td className="p-4 text-right"><Skeleton className="h-8 w-8 ml-auto bg-zinc-800" /></td>
                                        </tr>
                                    ))
                                ) : filteredVendors.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-zinc-500 bg-zinc-950/20">
                                            No vendors found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredVendors.map((vendor) => (
                                        <tr key={vendor.id} className="hover:bg-zinc-800/30 transition-colors group">
                                            <td className="p-4">
                                                <div className="font-semibold text-white">{vendor.full_name || "Anonymous Agent"}</div>
                                                <div className="text-zinc-500 text-xs">{vendor.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <Shield className="h-3 w-3 text-indigo-500" />
                                                    {vendor.role?.toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="p-4 text-zinc-400 font-mono text-xs">
                                                {new Date(vendor.created_at).toLocaleDateString('en-US', {
                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                })}
                                            </td>
                                            <td className="p-4">
                                                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2 py-0 align-middle">
                                                    Active
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-zinc-800 hover:text-white">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white">
                                                        <DropdownMenuLabel>Agent Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator className="bg-zinc-800" />
                                                        <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800">
                                                            <Mail className="mr-2 h-4 w-4" />
                                                            Contact Agent
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800">
                                                            <BarChart3 className="mr-2 h-4 w-4 text-indigo-400" />
                                                            View Sales Stats
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-zinc-800" />
                                                        <DropdownMenuItem className="text-red-500 cursor-pointer hover:bg-red-500/10 hover:text-red-400">
                                                            Deactivate Agent
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
