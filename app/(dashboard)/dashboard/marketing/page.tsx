import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MarketingPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Materiales de Marketing</h2>
                <p className="text-muted-foreground">Recursos para potenciar tus ventas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    "Banners Promocionales",
                    "Plantillas de Stories",
                    "Scripts de Venta",
                    "Guía de Manejo de Objeciones",
                    "Videos Explicativos",
                    "Logos y Branding"
                ].map((item, i) => (
                    <Card key={i} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-lg">{item}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-32 bg-gray-100 rounded-md flex items-center justify-center mb-4">
                                <span className="text-gray-400">Preview</span>
                            </div>
                            <Button className="w-full gap-2">
                                <Download className="w-4 h-4" />
                                Descargar Pack
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
