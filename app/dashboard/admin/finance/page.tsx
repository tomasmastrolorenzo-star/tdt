"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import Skeleton from "../../../../components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, TrendingDown, TrendingUp, DollarSign } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Expense {
    id: string
    amount: number
    description: string
    category: string
    date: string
}

export default function AdminFinancePage() {
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
    const [totalRevenue, setTotalRevenue] = useState(0)
    const [totalExpenses, setTotalExpenses] = useState(0)
    const [netProfit, setNetProfit] = useState(0)

    // Form states
    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("OTHER")

    const supabase = createClient()

    useEffect(() => {
        fetchFinancialData()
    }, [])

    const fetchFinancialData = async () => {
        setLoading(true)
        try {
            // Fetch Expenses
            const { data: expensesData } = await supabase
                .from("expenses")
                .select("*")
                .order('date', { ascending: false })

            setExpenses(expensesData || [])
            const expensesSum = expensesData?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0
            setTotalExpenses(expensesSum)

            // Fetch Revenue (Completed Orders)
            const { data: orders } = await supabase
                .from("orders")
                .select("price_final, margin_trenzo")
                .eq("status", "COMPLETED")

            const revenueSum = orders?.reduce((sum, order) => sum + Number(order.price_final), 0) || 0
            const profitSum = orders?.reduce((sum, order) => sum + Number(order.margin_trenzo), 0) || 0

            setTotalRevenue(revenueSum)
            // Net Profit = Gross Profit (Margins) - Expenses
            setNetProfit(profitSum - expensesSum)

        } catch (error) {
            console.error("Error fetching financial data:", error)
            toast.error("Failed to load financial records")
        } finally {
            setLoading(false)
        }
    }

    const handleAddExpense = async () => {
        if (!amount || !description) {
            toast.error("Please fill in all required fields")
            return
        }

        try {
            const { error } = await supabase.from("expenses").insert({
                amount: Number(amount),
                description,
                category,
                date: new Date().toISOString()
            })

            if (error) throw error

            toast.success("Expense registered successfully")
            setIsAddExpenseOpen(false)
            setAmount("")
            setDescription("")
            setCategory("OTHER")
            fetchFinancialData()
        } catch (error: any) {
            console.error("Error adding expense:", error)
            toast.error(error.message || "Failed to save expense")
        }
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Financial Treasury</h1>
                    <p className="text-zinc-400">Control revenue, operational costs, and net profitability.</p>
                </div>
                <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Record Expense
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>Register New Operational Cost</DialogTitle>
                            <DialogDescription className="text-zinc-500">
                                Add an operational expense to calculate real profitability.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount (USD) *</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    className="bg-zinc-900 border-zinc-800"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Input
                                    id="description"
                                    placeholder="e.g., Server hosting Monthly"
                                    className="bg-zinc-900 border-zinc-800"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                        <SelectItem value="MARKETING">Marketing / Ads</SelectItem>
                                        <SelectItem value="SERVER">Servers / Infrastructure</SelectItem>
                                        <SelectItem value="SALARY">Salaries</SelectItem>
                                        <SelectItem value="SOFTWARE">Software / Licenses</SelectItem>
                                        <SelectItem value="OTHER">Other Expenses</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)} className="border-zinc-800 text-zinc-400">Cancel</Button>
                            <Button onClick={handleAddExpense} className="bg-indigo-600 hover:bg-indigo-700">Save Expense</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <Card key={i} className="bg-zinc-900 border-zinc-800">
                            <CardHeader className="pb-2"><Skeleton className="h-4 w-24 bg-zinc-800" /></CardHeader>
                            <CardContent><Skeleton className="h-8 w-32 bg-zinc-800" /><Skeleton className="h-3 w-16 mt-2 bg-zinc-800" /></CardContent>
                        </Card>
                    ))
                ) : (
                    <>
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-400">Total Gross Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-white">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                <p className="text-xs text-zinc-500 mt-1">Total completed sales volume</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-400">Operational Expenses</CardTitle>
                                <TrendingDown className="h-4 w-4 text-rose-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-rose-500">${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                <p className="text-xs text-zinc-500 mt-1">Total registered costs</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-400">Real Net Profit</CardTitle>
                                <TrendingUp className="h-4 w-4 text-indigo-500" />
                            </CardHeader>
                            <CardContent>
                                <div className={`text-3xl font-bold ${netProfit >= 0 ? 'text-indigo-400' : 'text-rose-500'}`}>
                                    ${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">(Gross Margin - Operational Costs)</p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="border-b border-zinc-800">
                    <CardTitle className="text-white font-semibold">Expense Log</CardTitle>
                    <CardDescription className="text-zinc-500">Detailed record of all operational expenses</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-950/50 text-zinc-500 uppercase text-[10px] tracking-widest font-bold">
                                <tr>
                                    <th className="p-4 border-b border-zinc-800">Posting Date</th>
                                    <th className="p-4 border-b border-zinc-800">Description</th>
                                    <th className="p-4 border-b border-zinc-800">Category</th>
                                    <th className="p-4 border-b border-zinc-800 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {loading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i}>
                                            <td className="p-4"><Skeleton className="h-5 w-24 bg-zinc-800" /></td>
                                            <td className="p-4"><Skeleton className="h-5 w-48 bg-zinc-800" /></td>
                                            <td className="p-4"><Skeleton className="h-6 w-20 bg-zinc-800" /></td>
                                            <td className="p-4 text-right"><Skeleton className="h-5 w-16 ml-auto bg-zinc-800" /></td>
                                        </tr>
                                    ))
                                ) : expenses.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-zinc-500">
                                            No operational expenses recorded yet.
                                        </td>
                                    </tr>
                                ) : (
                                    expenses.map((expense) => (
                                        <tr key={expense.id} className="hover:bg-zinc-800/30 transition-colors">
                                            <td className="p-4 text-zinc-500 font-mono text-xs">
                                                {new Date(expense.date).toLocaleDateString('en-US', {
                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                })}
                                            </td>
                                            <td className="p-4 font-medium text-white">{expense.description}</td>
                                            <td className="p-4">
                                                <Badge variant="outline" className="border-zinc-700 text-zinc-400 capitalize">
                                                    {expense.category.toLowerCase()}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-right font-mono font-bold text-rose-500">
                                                -${expense.amount.toFixed(2)}
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
