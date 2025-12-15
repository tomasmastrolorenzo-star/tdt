"use client"

import Link from "next/link"
import { Sparkles, Instagram, Twitter, Facebook, Youtube } from "lucide-react"

export default function ProfessionalFooter() {
    return (
        <footer className="bg-slate-900 text-slate-300">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-6 h-6 text-orange-500" />
                            <span className="font-bold text-xl text-white">TDT</span>
                        </div>
                        <p className="text-sm text-slate-400 mb-6">
                            La plataforma líder en crecimiento orgánico de Instagram. Más de 80,000 clientes confían en nosotros.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 transition-colors">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Producto</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Características</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Precios</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Casos de Éxito</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Testimonios</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Empresa</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Sobre Nosotros</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Carreras</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Prensa</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Contacto</a></li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Legal</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Términos de Servicio</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Política de Privacidad</a></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Política de Cookies</a></li>
                            <li><Link href="/refund" className="hover:text-orange-500 transition-colors">Política de Reembolso</Link></li>
                            <li><a href="#" className="hover:text-orange-500 transition-colors">GDPR</a></li>
                        </ul>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="mt-12 pt-8 border-t border-slate-800">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="text-sm text-slate-400 mb-3">Métodos de pago aceptados:</p>
                            <div className="flex gap-3">
                                {/* Visa */}
                                <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                                    <svg className="w-8 h-5" viewBox="0 0 48 32" fill="none">
                                        <rect width="48" height="32" rx="4" fill="white" />
                                        <path d="M20.5 11h-3.2l-2 12h3.2l2-12zm8.5 7.7c0-3.2-4.4-3.4-4.4-4.8 0-.4.4-.9 1.3-.9.7 0 1.3.1 1.9.3l.3-1.9c-.6-.2-1.4-.4-2.4-.4-2.5 0-4.3 1.3-4.3 3.2 0 1.4 1.2 2.1 2.2 2.6 1 .5 1.4.8 1.4 1.2 0 .7-.8 1-1.6 1-.9 0-1.8-.2-2.6-.6l-.4 2c.8.4 1.9.6 3.1.6 2.7 0 4.5-1.3 4.5-3.3zm6.8 4.3h2.8l-2.4-12h-2.6c-.6 0-1 .3-1.3.8l-4.5 11.2h2.7l.5-1.5h3.3l.5 1.5zm-2.9-3.5l1.4-3.8.8 3.8h-2.2zm-13.4-8.5l-3.1 12h-2.7l-1.5-9.3c-.1-.4-.2-.6-.5-.8-.5-.3-1.4-.6-2.2-.8l.1-.4h3.8c.5 0 .9.3 1 .9l.9 4.8 2.2-5.7h2.7z" fill="#1434CB" />
                                    </svg>
                                </div>
                                {/* Mastercard */}
                                <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                                    <svg className="w-8 h-5" viewBox="0 0 48 32" fill="none">
                                        <rect width="48" height="32" rx="4" fill="white" />
                                        <circle cx="18" cy="16" r="7" fill="#EB001B" />
                                        <circle cx="30" cy="16" r="7" fill="#F79E1B" />
                                        <path d="M24 10.5c-1.4 1.3-2.3 3.2-2.3 5.5s.9 4.2 2.3 5.5c1.4-1.3 2.3-3.2 2.3-5.5s-.9-4.2-2.3-5.5z" fill="#FF5F00" />
                                    </svg>
                                </div>
                                {/* American Express */}
                                <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                                    <svg className="w-8 h-5" viewBox="0 0 48 32" fill="none">
                                        <rect width="48" height="32" rx="4" fill="#006FCF" />
                                        <path d="M14 12h-2l-1.5 4-1.5-4h-2l2.5 6h2l2.5-6zm3 0h-2v6h2v-6zm4 0h-2l-1.5 4v-4h-2v6h2l1.5-4v4h2v-6zm8 0h-4v6h4v-1.5h-2v-1h2v-1.5h-2v-1h2v-1.5zm4 0h-2l-1.5 4-1.5-4h-2l2.5 6h2l2.5-6z" fill="white" />
                                    </svg>
                                </div>
                                {/* PayPal */}
                                <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                                    <svg className="w-8 h-5" viewBox="0 0 48 32" fill="none">
                                        <rect width="48" height="32" rx="4" fill="white" />
                                        <path d="M20.5 11c-.8 0-1.5.6-1.7 1.4l-1.3 6.6h2.2l.3-1.5h1.5c2.2 0 3.5-1.1 3.5-2.8 0-1.5-1-2.7-2.5-2.7h-2zm.5 1.5h1c.8 0 1.3.5 1.3 1.2 0 .8-.5 1.3-1.3 1.3h-1l.5-2.5zm7 0c-.8 0-1.5.6-1.7 1.4l-1.3 6.6h2.2l.3-1.5h1.5c2.2 0 3.5-1.1 3.5-2.8 0-1.5-1-2.7-2.5-2.7h-2zm.5 1.5h1c.8 0 1.3.5 1.3 1.2 0 .8-.5 1.3-1.3 1.3h-1l.5-2.5z" fill="#003087" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="text-sm text-slate-400">
                            <p>🔒 Pagos 100% seguros y encriptados</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
                        <p>© 2024 TDT. Todos los derechos reservados.</p>
                        <p>Hecho con ❤️ en Argentina</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
