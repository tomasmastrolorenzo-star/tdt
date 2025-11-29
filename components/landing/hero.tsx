import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star } from "lucide-react"
import Image from "next/image"

export function Hero() {
    return (
        <section className="relative w-full py-20 lg:py-32 bg-white overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center space-y-8">

                <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-yellow-50 text-yellow-800 border-yellow-200">
                    🔥 BLACK FRIDAY SALE - LIMITED TIME 🔥
                </div>

                <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    10x Your Social Media
                </h1>

                <p className="mx-auto max-w-[700px] text-lg md:text-xl text-gray-600 font-medium">
                    Over 1.2M followers delivered.<br />
                    No bots, no fake followers, no passwords.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Button asChild size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200">
                        <Link href="#pricing">Start Growing Now 🚀</Link>
                    </Button>
                </div>

                <div className="flex flex-col items-center gap-2 mt-8">
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" width={40} height={40} />
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="font-bold ml-2">5.0</span>
                    </div>
                    <p className="text-sm text-gray-500">Trusted by 30,000 Creators</p>
                </div>
            </div>
        </section>
    )
}
