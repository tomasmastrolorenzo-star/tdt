export function Ticker() {
    return (
        <div className="w-full bg-black text-white py-3 overflow-hidden whitespace-nowrap border-t border-white/10">
            <div className="animate-marquee inline-block">
                {[...Array(10)].map((_, i) => (
                    <span key={i} className="mx-4 text-sm font-medium tracking-wide">
                        🚀 Boost Your Reach | 📈 Track Your Growth | 🛡️ Build Social Proof | ✨ Spark Authentic Engagement | 🌍 Expand Your Audience |
                    </span>
                ))}
            </div>
        </div>
    )
}
