import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const tiers = [
    {
        name: "Starter",
        price: "$9.99",
        description: "Ideal para comenzar a crecer.",
        features: ["1,000 Seguidores Instagram", "Entrega Inmediata", "Garantía de 30 días", "Soporte Básico"],
        highlight: false,
    },
    {
        name: "Viral",
        price: "$24.99",
        description: "El favorito de los influencers.",
        features: ["5,000 Seguidores Instagram", "2,000 Likes en posts", "Entrega Prioritaria", "Garantía de por vida", "Soporte Premium"],
        highlight: true,
    },
    {
        name: "Pro",
        price: "$49.99",
        description: "Dominación total de redes.",
        features: ["10,000 Seguidores Instagram", "5,000 Likes + 10k Views", "Entrega Ultra Rápida", "Asesoría Personalizada", "Soporte VIP 24/7"],
        highlight: false,
    },
]

export function Pricing() {
    return (
        <section id="pricing" className="py-20 bg-slate-900">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Planes diseñados para tu crecimiento
                    </h2>
                    <p className="text-lg text-slate-400">
                        Elige el paquete que mejor se adapte a tus necesidades. Sin contratos, cancela cuando quieras.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
                    {tiers.map((tier) => (
                        <Card
                            key={tier.name}
                            className={`relative flex flex-col border-slate-800 bg-slate-950/50 text-slate-100 ${tier.highlight ? 'border-cyan-500 shadow-2xl shadow-cyan-500/10 scale-105 z-10' : ''
                                }`}
                        >
                            {tier.highlight && (
                                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-cyan-500 px-3 py-1 text-xs font-medium text-white">
                                    Más Popular
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
                                <CardDescription className="text-slate-400">{tier.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                                    <span className="text-slate-500">/pack</span>
                                </div>
                                <ul className="space-y-3 text-sm text-slate-300">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3">
                                            <Check className="h-4 w-4 text-cyan-500" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className={`w-full ${tier.highlight ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-slate-800 hover:bg-slate-700'}`}
                                >
                                    Elegir Plan
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
