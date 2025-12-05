"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, TrendingDown, Plus, Calendar } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
        } finally {
            setLoading(false)
        }
    }

    const handleAddExpense = async () => {
        try {
            const { error } = await supabase.from("expenses").insert({
                amount: Number(amount),
                description,
                category,
                date: new Date().toISOString()
            })

            if (error) throw error

            setIsAddExpenseOpen(false)
            setAmount("")
            setDescription("")
            setCategory("OTHER")
            fetchFinancialData()
        } catch (error) {
            console.error("Error adding expense:", error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Finanzas</h1>
                    <p className="text-muted-foreground">Control de ingresos, gastos y rentabilidad</p>
                </div>
                <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Registrar Gasto
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Registrar Nuevo Gasto</DialogTitle>
                            <DialogDescription>
                                Añade un gasto operativo para calcular la rentabilidad real.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">
                                    Monto ($)
                                </Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    className="col-span-3"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                    Descripción
                                </Label>
                                <Input
                                    id="description"
                                    className="col-span-3"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">
                                    Categoría
                                </Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Seleccionar categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MARKETING">Marketing / Ads</SelectItem>
                                        <SelectItem value="SERVER">Servidores / Infraestructura</SelectItem>
                                        <SelectItem value="SALARY">Salarios</SelectItem>
                                        <SelectItem value="SOFTWARE">Software / Licencias</SelectItem>
                                        <SelectItem value="OTHER">Otros</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)}>Cancelar</Button>
                            <Button onClick={handleAddExpense}>Guardar Gasto</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Ventas completadas
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Gastos Operativos</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total de gastos registrados
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ganancia Neta Real</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            ${netProfit.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            (Márgenes TDT - Gastos)
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Historial de Gastos</CardTitle>
                    <CardDescription>Registro detallado de todos los gastos operativos</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="p-4 font-medium">Fecha</th>
                                    <th className="p-4 font-medium">Descripción</th>
                                    <th className="p-4 font-medium">Categoría</th>
                                    <th className="p-4 font-medium text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                            Cargando gastos...
                                        </td>
                                    </tr>
                                ) : expenses.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                            No hay gastos registrados
                                        </td>
                                    </tr>
                                ) : (
                                    expenses.map((expense) => (
                                        <tr key={expense.id} className="border-t hover:bg-muted/50">
                                            <td className="p-4 text-muted-foreground">
                                                {new Date(expense.date).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 font-medium">{expense.description}</td>
                                            <td className="p-4">
                                                <Badge variant="outline">{expense.category}</Badge>
                                            </td>
                                            <td className="p-4 text-right font-medium text-red-600">
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
