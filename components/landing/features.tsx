import { TrendingUp, Star, Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Features() {
    return (
        <section className="py-20 bg-white">
            <div className="container px-4 mx-auto text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    More Followers. Better Engagement. Higher Status.
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="border-none shadow-xl hover:scale-105 transition-transform duration-300">
                        <CardHeader>
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                                <TrendingUp className="w-8 h-8 text-white" />
                            </div>
                            <div className="bg-black text-white text-xs font-bold py-1 px-3 rounded-full w-fit mx-auto mb-2">
                                ORGANIC GROWTH
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Fast, organic growth starts within 24 hours after purchase.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl hover:scale-105 transition-transform duration-300">
                        <CardHeader>
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                                <Star className="w-8 h-8 text-white" />
                            </div>
                            <div className="bg-black text-white text-xs font-bold py-1 px-3 rounded-full w-fit mx-auto mb-2">
                                HIGH QUALITY
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                We ensure top-quality growth by engaging with fresh, relevant users.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl hover:scale-105 transition-transform duration-300">
                        <CardHeader>
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                                <Wallet className="w-8 h-8 text-white" />
                            </div>
                            <div className="bg-black text-white text-xs font-bold py-1 px-3 rounded-full w-fit mx-auto mb-2">
                                AFFORDABLE
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                We offer the best prices on the market, guaranteed.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-16">
                    <p className="text-sm font-bold text-gray-500 mb-4">WHAT ARE YOU WAITING FOR ?</p>
                    <h3 className="text-4xl font-extrabold text-purple-600 mb-4">Seriously, Yo...</h3>
                    <p className="text-gray-600">You should really just say "f*ck it" and take RizzUp for a spin.</p>
                </div>
            </div>
        </section>
    )
}
