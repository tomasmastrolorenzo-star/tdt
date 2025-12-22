import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

interface StatsCardProps {
    title: string
    value: string
    description?: string
    icon: React.ElementType
    trend?: {
        value: number
        label: string
        positive?: boolean
    }
    className?: string
}

export function StatsCard({ title, value, description, icon: Icon, trend, className }: StatsCardProps) {
    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {(description || trend) && (
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                        {trend && (
                            <span className={`flex items-center mr-2 ${trend.positive ? 'text-emerald-500' : trend.positive === false ? 'text-red-500' : 'text-zinc-500'}`}>
                                {trend.positive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : trend.positive === false ? <ArrowDownRight className="h-3 w-3 mr-1" /> : <Minus className="h-3 w-3 mr-1" />}
                                {Math.abs(trend.value)}%
                            </span>
                        )}
                        {description && <span>{description}</span>}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
