"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Share2, Check } from "lucide-react"

interface VendorReferralCardProps {
    referralCode: string
    baseUrl?: string
}

export function VendorReferralCard({ referralCode, baseUrl = "https://trenddigitaltrade.com" }: VendorReferralCardProps) {
    const [copied, setCopied] = useState(false)

    const referralLink = `${baseUrl}/?ref=${referralCode}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 border-2 border-indigo-200 dark:border-indigo-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Tu Código de Referido
                </CardTitle>
                <CardDescription>
                    Comparte este link para ganar comisiones automáticamente
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-center p-4 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-700">
                        <span className="text-2xl font-mono font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
                            {referralCode}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            value={referralLink}
                            readOnly
                            className="bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-800 font-mono text-sm"
                        />
                        <Button
                            onClick={copyToClipboard}
                            className={`${copied ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"} text-white transition-all`}
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                        Tus clientes obtendrán un 5% de descuento usándolo.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
