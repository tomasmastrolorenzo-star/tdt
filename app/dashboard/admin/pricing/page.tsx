"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Save, Loader2, AlertTriangle, Plus, Trash2 } from "lucide-react";
import { TICKER_PLANS, GLOBAL_DISCOUNTS, ORDER_BUMP, PricingTier } from "@/lib/constants/pricing";
import { toast } from "sonner";

export default function PricingController() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [plans, setPlans] = useState<PricingTier[]>([]);
    const [discounts, setDiscounts] = useState(GLOBAL_DISCOUNTS);
    const [orderBump, setOrderBump] = useState(ORDER_BUMP);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('platform_settings')
                .select('*');

            if (error) throw error;

            if (data && data.length > 0) {
                const plansData = data.find(s => s.key === 'pricing_plans')?.value;
                const discountsData = data.find(s => s.key === 'discounts')?.value;
                const bumpData = data.find(s => s.key === 'order_bump')?.value;

                if (plansData) setPlans(plansData);
                else setPlans(Object.values(TICKER_PLANS));

                if (discountsData) setDiscounts(discountsData);
                if (bumpData) setOrderBump(bumpData);
            } else {
                // Fallback to constants if table empty
                setPlans(Object.values(TICKER_PLANS));
            }
        } catch (err) {
            console.error("Error fetching pricing settings:", err);
            toast.error("Failed to load settings. Using static defaults.");
            setPlans(Object.values(TICKER_PLANS));
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            // Batch updates
            const updates = [
                { key: 'pricing_plans', value: plans },
                { key: 'discounts', value: discounts },
                { key: 'order_bump', value: orderBump }
            ];

            const { error } = await supabase
                .from('platform_settings')
                .upsert(updates);

            if (error) throw error;

            toast.success("Pricing settings updated globally!");
        } catch (err) {
            console.error("Error saving settings:", err);
            toast.error("Failed to save settings. Check permissions.");
        } finally {
            setSaving(false);
        }
    };

    const updatePlan = (id: string, field: keyof PricingTier, value: any) => {
        setPlans(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6 max-w-6xl mx-auto pb-24">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Price Controller</h1>
                    <p className="text-slate-400">Manage global pricing tiers, discounts, and order bumps.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} size="lg" className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save All Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Plans Management */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="bg-slate-900 border-slate-800 border-t-4 border-t-indigo-500">
                        <CardHeader>
                            <CardTitle className="text-xl text-white">Main Pricing Tiers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {plans.map((plan) => (
                                    <div key={plan.id} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                            <div className="flex items-center gap-3">
                                                <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                                                    ID: {plan.id}
                                                </Badge>
                                                <Input
                                                    value={plan.name}
                                                    onChange={(e) => updatePlan(plan.id, 'name', e.target.value)}
                                                    className="bg-transparent border-none text-lg font-bold p-0 focus-visible:ring-0 h-auto"
                                                />
                                            </div>
                                            <Badge variant="outline" className="text-slate-500">
                                                {plan.highlight ? "Featured" : "Regular"}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly Price ($)</label>
                                                <Input
                                                    type="number"
                                                    value={plan.monthlyPrice}
                                                    onChange={(e) => updatePlan(plan.id, 'monthlyPrice', parseFloat(e.target.value))}
                                                    className="bg-slate-900 border-slate-800 text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quarterly Price ($)</label>
                                                <Input
                                                    type="number"
                                                    value={plan.quarterlyPrice}
                                                    onChange={(e) => updatePlan(plan.id, 'quarterlyPrice', parseFloat(e.target.value))}
                                                    className="bg-slate-900 border-slate-800 text-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Badge Text</label>
                                            <Input
                                                value={plan.badge || ''}
                                                onChange={(e) => updatePlan(plan.id, 'badge', e.target.value)}
                                                placeholder="e.g. Recommended"
                                                className="bg-slate-900 border-slate-800 text-white"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
                                            <Input
                                                value={plan.description}
                                                onChange={(e) => updatePlan(plan.id, 'description', e.target.value)}
                                                className="bg-slate-900 border-slate-800 text-white"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Discounts & Order Bump */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 border-slate-800 border-t-4 border-t-emerald-500">
                        <CardHeader>
                            <CardTitle className="text-xl text-white">Global Discounts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Crypto Discount (%)</label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        step="1"
                                        value={discounts.crypto * 100}
                                        onChange={(e) => setDiscounts({ ...discounts, crypto: parseFloat(e.target.value) / 100 })}
                                        className="bg-slate-950 border-slate-800 text-white"
                                    />
                                    <span className="text-slate-400">%</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Annual Discount (%)</label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        step="1"
                                        value={discounts.quarterly * 100}
                                        onChange={(e) => setDiscounts({ ...discounts, quarterly: parseFloat(e.target.value) / 100 })}
                                        className="bg-slate-950 border-slate-800 text-white"
                                    />
                                    <span className="text-slate-400">%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800 border-t-4 border-t-amber-500">
                        <CardHeader>
                            <CardTitle className="text-xl text-white">Order Bump (Priority)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Price ($)</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={orderBump.price}
                                    onChange={(e) => setOrderBump({ ...orderBump, price: parseFloat(e.target.value) })}
                                    className="bg-slate-950 border-slate-800 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Copy</label>
                                <textarea
                                    value={orderBump.description}
                                    onChange={(e) => setOrderBump({ ...orderBump, description: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-md p-2 h-20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                        <p className="text-xs text-amber-200/70">
                            <strong>Careful:</strong> Changes here affect the checkout globally. Always verify prices after saving.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
