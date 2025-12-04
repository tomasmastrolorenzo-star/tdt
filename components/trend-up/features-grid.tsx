"use client"

import { Shield, Users, Heart, Zap, Globe, MessageSquare } from "lucide-react"

export default function FeaturesGrid() {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">

                {/* Main Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                            <Shield className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Crecimiento sin riesgo</h3>
                        <p className="text-slate-600">
                            TDT nunca le pide la contraseña de su cuenta como otras empresas, evitando cualquier riesgo de ser suspendido. Cumplimos todas las directrices de IG.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Nuevos seguidores comprometidos</h3>
                        <p className="text-slate-600">
                            TDT se asegura de que tus nuevos fans no sólo te sigan, sino que disfruten de lo que compartes y quieran ver más.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                            <Heart className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Sin spam ni bots</h3>
                        <p className="text-slate-600">
                            Solo crecimiento inteligente en redes sociales. Verás un crecimiento inmediato gracias a la tecnología GPT4 de TDT.
                        </p>
                    </div>
                </div>

                {/* AI + Marketing Section */}
                <div className="bg-white rounded-[3rem] p-8 md:p-16 text-center mb-20 shadow-xl">
                    <div className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-bold mb-6">
                        ¿Cuál es el secreto?
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-12">
                        Tecnología de IA + Estrategas de <br />
                        marketing = <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">Crecimiento fácil y rápido 🚀</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="bg-slate-50 p-8 rounded-3xl">
                            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Mejora tu crecimiento con la IA</h3>
                            <p className="text-slate-600">
                                Utilizamos modelos de aprendizaje automático patentados para encontrar la audiencia adecuada para tu perfil y contenido.
                            </p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl">
                            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-6">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Dirígete a grupos demográficos específicos</h3>
                            <p className="text-slate-600">
                                Nos aseguramos de tener todas las opciones de segmentación disponibles: edad, sexo, ubicación, cuentas similares, hashtags, intereses y mucho más.
                            </p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl">
                            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-6">
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Encuentra seguidores en cualquier lugar</h3>
                            <p className="text-slate-600">
                                La segmentación por ubicación es clave para garantizar la mejora de la presencia de tu marca en las zonas adecuadas.
                            </p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <MessageSquare className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Obtén asistencia en cualquier momento</h3>
                            <p className="text-slate-600">
                                Además de un gestor de cuenta dedicado, tendrás acceso a nuestro equipo de asistencia 24 horas al día, 7 días a la semana.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
