'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Crown, Flame, Rocket, Star, Zap } from "lucide-react"
import Link from "next/link"

export function PricingCards() {
    const packages = [
        {
            name: "STARTER",
            level: 2,
            followers: "2,500",
            price: "$29.99",
            features: [],
            icon: Star,
            color: "from-purple-600 to-purple-800",
            borderColor: "border-purple-500",
        },
        {
            name: "VIRAL",
            level: 3,
            followers: "5,000",
            price: "$49.49",
            features: [
                "500 Likes",
                "10 Comentarios (3 posts)",
            ],
            icon: Flame,
            color: "from-gray-700 to-gray-900",
            borderColor: "border-gray-600",
        },
        {
            name: "PRO",
            level: 4,
            followers: "10,000",
            price: "$99.99",
            features: [
                "1,000 Likes",
                "30 Comentarios (5 posts)",
            ],
            icon: Zap,
            color: "from-yellow-500 to-orange-600",
            borderColor: "border-yellow-500",
            bestSeller: true,
        },
        {
            name: "PLATINUM",
            level: 5,
            followers: "50,000",
            price: "$389.00",
            features: [
                "5,000 Likes",
                "50 Comentarios",
            ],
            icon: Rocket,
            color: "from-blue-600 to-cyan-600",
            borderColor: "border-blue-500",
        },
        {
            name: "SUPREMO",
            level: 6,
            followers: "100,000",
            price: "$799.00",
            features: [
                "10,000 Likes",
                "100 Comentarios",
            ],
            icon: Crown,
            color: "from-pink-600 to-purple-700",
            borderColor: "border-pink-500",
            premium: true,
        },
    ]

    return (
        <section className="py-20 bg-white" id="pricing">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Paquetes Premium
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Elige el plan perfecto para tu crecimiento
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {packages.map((pkg, index) => {
                        const Icon = pkg.icon
                        return (
                            <Card
                                key={index}
                                className={`relative overflow-hidden border-2 ${pkg.borderColor} hover:shadow-2xl transition-all duration-300 hover:scale-105`}
                            >
                                {pkg.bestSeller && (
                                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Flame className="w-3 h-3" />
                                        BEST SELLER
                                    </div>
                                )}
                                {pkg.premium && (
                                    <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Crown className="w-3 h-3" />
                                        PREMIUM
                                    </div>
                                )}

                                <CardHeader className={`bg-gradient-to-r ${pkg.color} text-white pb-8`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-4xl font-bold">{pkg.followers}</div>
                                        <div className="text-sm opacity-90">Followers</div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-6 space-y-4">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-gray-900">{pkg.price}</div>
                                    </div>

                                    {pkg.features.length > 0 && (
                                        <div className="space-y-2 pt-4 border-t">
                                            {pkg.features.map((feature, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <Button
                                        asChild
                                        className={`w-full bg-gradient-to-r ${pkg.color} hover:opacity-90 transition-opacity`}
                                    >
                                        <Link href="/services/instagram/followers">
                                            Comprar Ahora
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
