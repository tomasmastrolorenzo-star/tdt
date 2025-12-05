"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Clock, CheckCircle, AlertCircle, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface Ticket {
    id: string
    subject: string
    message: string
    status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'RESOLVED'
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
    created_at: string
    user_id: string
    order_id?: string
    profiles?: {
        full_name: string
        email: string
    }
}

export default function OperatorTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
    const [replyMessage, setReplyMessage] = useState("")
    const supabase = createClient()

    useEffect(() => {
        fetchTickets()
    }, [])

    const fetchTickets = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from("tickets")
                .select(`
                    *,
                    profiles (full_name, email)
                `)
                .order('created_at', { ascending: false })

            if (error) throw error

            setTickets(data || [])
        } catch (error) {
            console.error("Error fetching tickets:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from("tickets")
                .update({ status: newStatus })
                .eq("id", ticketId)

            if (error) throw error

            setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus as any } : t))
            if (selectedTicket?.id === ticketId) {
                setSelectedTicket(prev => prev ? { ...prev, status: newStatus as any } : null)
            }
        } catch (error) {
            console.error("Error updating ticket:", error)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-blue-500'
            case 'IN_PROGRESS': return 'bg-yellow-500'
            case 'RESOLVED': return 'bg-green-500'
            case 'CLOSED': return 'bg-gray-500'
            default: return 'bg-gray-500'
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'URGENT': return 'text-red-500 border-red-500'
            case 'HIGH': return 'text-orange-500 border-orange-500'
            case 'NORMAL': return 'text-blue-500 border-blue-500'
            case 'LOW': return 'text-gray-500 border-gray-500'
            default: return 'text-gray-500'
        }
    }

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch =
            ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "ALL" || ticket.status === statusFilter

        return matchesSearch && matchesStatus
    })

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tickets de Soporte</h1>
                    <p className="text-muted-foreground">Gestiona reclamos y consultas de usuarios</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Ticket List */}
                <Card className="md:col-span-1 h-[calc(100vh-200px)] flex flex-col">
                    <CardHeader className="pb-3">
                        <div className="space-y-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar ticket..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Todos</SelectItem>
                                    <SelectItem value="OPEN">Abiertos</SelectItem>
                                    <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                                    <SelectItem value="RESOLVED">Resueltos</SelectItem>
                                    <SelectItem value="CLOSED">Cerrados</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto p-0">
                        <div className="divide-y">
                            {filteredTickets.map(ticket => (
                                <div
                                    key={ticket.id}
                                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedTicket?.id === ticket.id ? 'bg-muted' : ''}`}
                                    onClick={() => setSelectedTicket(ticket)}
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <Badge className={getStatusColor(ticket.status)} variant="secondary">
                                            {ticket.status}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(ticket.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h4 className="font-medium text-sm truncate">{ticket.subject}</h4>
                                    <p className="text-xs text-muted-foreground truncate mt-1">
                                        {ticket.profiles?.email}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Ticket Detail */}
                <Card className="md:col-span-2 h-[calc(100vh-200px)] flex flex-col">
                    {selectedTicket ? (
                        <>
                            <CardHeader className="border-b">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className={getPriorityColor(selectedTicket.priority)}>
                                                {selectedTicket.priority}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">#{selectedTicket.id.slice(0, 8)}</span>
                                        </div>
                                        <CardTitle>{selectedTicket.subject}</CardTitle>
                                        <CardDescription className="mt-1">
                                            De: {selectedTicket.profiles?.full_name} ({selectedTicket.profiles?.email})
                                        </CardDescription>
                                    </div>
                                    <Select
                                        value={selectedTicket.status}
                                        onValueChange={(val) => handleUpdateStatus(selectedTicket.id, val)}
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="OPEN">Abierto</SelectItem>
                                            <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                                            <SelectItem value="RESOLVED">Resuelto</SelectItem>
                                            <SelectItem value="CLOSED">Cerrado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-auto p-6">
                                <div className="space-y-6">
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <p className="text-sm whitespace-pre-wrap">{selectedTicket.message}</p>
                                    </div>

                                    {/* Placeholder for conversation history */}
                                    <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        No hay respuestas aún
                                    </div>
                                </div>
                            </CardContent>
                            <div className="p-4 border-t bg-muted/10">
                                <div className="flex gap-2">
                                    <Textarea
                                        placeholder="Escribe una respuesta..."
                                        className="min-h-[80px]"
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                    />
                                    <Button className="self-end">Enviar</Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                            <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                            <p>Selecciona un ticket para ver los detalles</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
