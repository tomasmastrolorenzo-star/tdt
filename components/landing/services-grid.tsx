import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Instagram, Video, Heart, Users } from "lucide-react"

const services = [
    {
        title: "Instagram Followers",
        description: "Aumenta tu comunidad con seguidores reales y activos.",
        icon: Users,
        color: "text-pink-600",
    },
    {
        title: "Instagram Likes",
        description: "Mejora el engagement de tus posts al instante.",
        icon: Heart,
        color: "text-red-500",
    },
    {
        title: "TikTok Views",
        description: "Haz que tus videos se vuelvan virales.",
        icon: Video,
        color: "text-black",
    },
    {
        title: "TikTok Followers",
        description: "Crece en la plataforma del momento.",
        icon: Users,
        color: "text-blue-500",
    },
]

export function ServicesGrid() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Servicios Individuales
                    </h2>
                    <p className="mt-4 text-gray-500 md:text-xl">
                        Elige la plataforma y el impulso que necesitas.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                            <CardHeader>
                                <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 ${service.color}`}>
                                    <service.icon className="w-6 h-6" />
                                </div>
                                <CardTitle>{service.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{service.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
