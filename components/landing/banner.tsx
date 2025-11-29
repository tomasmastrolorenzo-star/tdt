import { Flame } from "lucide-react"

export function Banner() {
    return (
        <div className="w-full bg-black text-white py-2 flex justify-center items-center gap-2 text-xs md:text-sm font-bold tracking-wider">
            <Flame className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>BLACK FRIDAY SALE | 50% OFF ALL SERVICES</span>
            <Flame className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        </div>
    )
}
