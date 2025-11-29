import { Hero } from "@/components/landing/hero"
import { ServicesGrid } from "@/components/landing/services-grid"
import { PricingCards } from "@/components/landing/pricing-cards"

export default function TrendUpPage() {
    return (
        <main className="min-h-screen bg-background">
            <Hero />
            <ServicesGrid />
            <PricingCards />

            {/* Footer Simple */}
            <footer className="py-8 bg-gray-900 text-white text-center">
                <div className="container mx-auto px-4">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} Trend Up. Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </main>
    )
}
