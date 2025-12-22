"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
    Users,
    ChevronRight,
    Mail,
    Clock,
    Globe,
    Target,
    RefreshCcw,
    AlertCircle,
    CheckCircle2,
    Search,
    Filter
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Skeleton from "../../../../components/ui/skeleton"
import { toast } from "sonner"
import { formatDistanceToNow } from 'date-fns'

interface FunnelEvent {
    id: string
    event_type: string
    ip_address: string
    niche: string
    location: string
    email: string
    metadata: any
    created_at: string
    processed_at: string | null
}

export default function RecoveryCenter() {
    const [events, setEvents] = useState<FunnelEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filter, setFilter] = useState<'all' | 'abandoned' | 'active'>('all')
    const supabase = createClient()

    const fetchEvents = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('funnel_events')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50)

        if (error) {
            toast.error("Failed to fetch funnel events")
        } else {
            setEvents(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchEvents()
        const interval = setInterval(fetchEvents, 30000) // Poll every 30s
        return () => clearInterval(interval)
    }, [])

    const handleManualRecovery = async (email: string, eventId: string) => {
        if (!email) return

        try {
            const res = await fetch('/api/admin/recovery/trigger-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, eventId })
            })

            if (res.ok) {
                toast.success(`Recovery email sent to ${email}`)
                fetchEvents() // Refresh to show processed status
            } else {
                throw new Error("Failed to send email")
            }
        } catch (err) {
            toast.error("Manual recovery failed")
        }
    }

    const filteredEvents = events.filter(e => {
        const matchesSearch = (e.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (e.ip_address || '').includes(searchTerm)

        if (filter === 'abandoned') return matchesSearch && e.event_type === 'STEP_3_CHECKOUT_ENTRY' && !e.processed_at
        if (filter === 'active') return matchesSearch && e.event_type !== 'STEP_3_CHECKOUT_ENTRY'
        return matchesSearch
    })

    return (
        <div className="p-6 space-y-8 bg-slate-50/50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Recovery Center 2.0</h1>
                    <p className="text-slate-500 font-medium">Real-time "Digital Shadow" funnel monitoring.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={fetchEvents} className="rounded-xl border-slate-200">
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Refresh Feed
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                <Card className="rounded-3xl border-slate-200/60 shadow-sm md:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search email/IP..."
                                className="pl-9 rounded-xl border-slate-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <Button
                                variant={filter === 'all' ? 'secondary' : 'ghost'}
                                className="w-full justify-start rounded-xl font-bold"
                                onClick={() => setFilter('all')}
                            >
                                <Users className="w-4 h-4 mr-2" />
                                All Events
                            </Button>
                            <Button
                                variant={filter === 'abandoned' ? 'secondary' : 'ghost'}
                                className="w-full justify-start rounded-xl font-bold text-rose-600 hover:bg-rose-50"
                                onClick={() => setFilter('abandoned')}
                            >
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Abandoned
                            </Button>
                            <Button
                                variant={filter === 'active' ? 'secondary' : 'ghost'}
                                className="w-full justify-start rounded-xl font-bold text-indigo-600 hover:bg-indigo-50"
                                onClick={() => setFilter('active')}
                            >
                                <Clock className="w-4 h-4 mr-2" />
                                Active Browsing
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-3 space-y-4">
                    {loading && events.length === 0 ? (
                        Array(5).fill(0).map((_, i) => (
                            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                        ))
                    ) : filteredEvents.length === 0 ? (
                        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
                            <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <p className="font-bold text-slate-400">No events found matching your filter.</p>
                        </div>
                    ) : (
                        filteredEvents.map((event) => (
                            <div key={event.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors group">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${event.event_type === 'STEP_3_CHECKOUT_ENTRY' ? 'bg-rose-50 text-rose-600' :
                                            event.event_type === 'STEP_4_WHATSAPP_REDIRECT' ? 'bg-emerald-50 text-emerald-600' :
                                                'bg-indigo-50 text-indigo-600'
                                            }`}>
                                            <Target className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-black text-slate-900">{event.event_type.replace(/_/g, ' ')}</span>
                                                <Badge variant="outline" className="text-[10px] uppercase font-black tracking-tighter">
                                                    {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                                                </Badge>
                                                {event.processed_at && (
                                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                                        RECOVERED
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {event.email || 'Anonymous'}</span>
                                                {event.metadata?.username && (
                                                    <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">@{event.metadata.username}</span>
                                                )}
                                                <span className="flex items-center gap-1 font-mono uppercase tracking-tight text-slate-400">[{event.ip_address}]</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden md:block">
                                            <div className="flex items-center gap-1.5 justify-end text-xs font-black uppercase text-slate-400 tracking-widest mb-1">
                                                <Globe className="w-3 h-3" /> {event.location || 'Unknown'}
                                            </div>
                                            <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block">
                                                {event.niche || 'Universal'}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {event.event_type === 'STEP_3_CHECKOUT_ENTRY' && event.email && !event.processed_at && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            const username = event.metadata?.username || 'there';
                                                            const niche = event.niche || 'Growth';
                                                            const location = event.location || 'Global';
                                                            const prob = 88 + (niche.length + location.length) % 10;
                                                            const plan = event.metadata?.plan?.toUpperCase() || 'VIP';

                                                            const msg = `Hey ${username}, it's Vortex. I saw the AI detected a ${prob}% growth rate for your ${niche} account in ${location}. We have one slot left for the ${plan} activation today. Do you want me to bypass the queue for you?`;

                                                            navigator.clipboard.writeText(msg);
                                                            toast.success("Hyper-personalized WA script copied!");
                                                        }}
                                                        className="border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-xs uppercase"
                                                    >
                                                        Copy WA Script
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleManualRecovery(event.email, event.id)}
                                                        className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs uppercase px-6"
                                                    >
                                                        Email Recover
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
