"use client";

export default function Trust() {
    return (
        <section className="py-20 bg-[#050505] border-t border-white/5 relative group">
            <div className="max-w-7xl mx-auto px-6 overflow-hidden">

                {/* Header: Results Monitor (Centered) */}
                <div className="flex flex-col items-center justify-center text-center mb-16">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5A059]">
                            Monitor de Resultados
                        </span>
                    </div>

                    <p className="text-4xl md:text-5xl font-serif text-white mb-6 drop-shadow-xl">
                        <span
                            className="text-[#C5A059] font-bold"
                            style={{ textShadow: '1px 1px 0 #856404, 0 0 25px rgba(197,160,89,0.4)' }}
                        >
                            538
                        </span> Perfiles Posicionados
                    </p>
                    <p className="text-white/50 font-sans font-light max-w-lg mx-auto leading-relaxed text-sm tracking-wide">
                        La red de autoridad más exclusiva. Operando bajo estrictos protocolos de confidencialidad para líderes globales.
                    </p>
                </div>

                {/* Infinite Marquee of Logos */}
                <div className="relative w-full overflow-hidden mask-gradient-x py-8">
                    {/* Inner Track */}
                    <div className="flex w-[200%] animate-marquee hover:[animation-play-state:paused] items-center">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex justify-around items-center w-1/2 px-10 gap-16 md:gap-24">
                                {[
                                    { name: "Forbes", type: "text", font: "font-serif text-2xl tracking-tight" },
                                    { name: "Bloomberg", type: "text", font: "font-sans font-bold tracking-tight text-xl" },
                                    { name: "Meta", type: "image", src: "/assets/meta-3d-glossy.png" },
                                    { name: "Google", type: "text", font: "font-sans font-bold text-xl" },
                                    { name: "TikTok", type: "text", font: "font-sans font-extrabold tracking-tighter text-xl" },
                                    { name: "Instagram", type: "image", src: "/assets/insta-3d-glossy.png" },
                                    { name: "Reuters", type: "text", font: "font-serif tracking-widest text-lg" },
                                ].map((logo, idx) => (
                                    <div key={idx} className="relative group/logo flex-shrink-0 filter grayscale hover:grayscale-0 transition-all duration-500 cursor-default hover:scale-110 opacity-60 hover:opacity-100">
                                        {logo.type === 'image' ? (
                                            <img
                                                src={logo.src}
                                                alt={logo.name}
                                                className="h-8 md:h-12 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover/logo:drop-shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all"
                                            />
                                        ) : (
                                            <span className={`text-white group-hover/logo:text-[#C5A059] transition-colors duration-500 ${logo.font}`}>
                                                {logo.name}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
