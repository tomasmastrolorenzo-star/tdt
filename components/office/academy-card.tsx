interface AcademyCardProps {
    title: string
    description: string
    category: string
    fileUrl: string
    index: number
}

const categoryLabels: Record<string, string> = {
    novatos: "Configuración Inicial",
    estrategia: "Estrategia de Mercado",
    marca_personal: "Marca Personal & Referidos",
}

export function AcademyCard({ title, description, category, fileUrl, index }: AcademyCardProps) {
    return (
        <div className="border border-zinc-200 bg-white p-6 flex flex-col hover:border-black transition-colors">
            <div className="flex items-start justify-between mb-4">
                <div className="w-8 h-8 border border-zinc-200 flex items-center justify-center text-xs font-black text-zinc-400">
                    {String(index).padStart(2, "0")}
                </div>
                <span className="text-[10px] font-black tracking-widest uppercase text-zinc-400 bg-zinc-50 border border-zinc-200 px-2 py-1">
                    {categoryLabels[category] || category}
                </span>
            </div>
            <h4 className="text-base font-black tracking-tight mb-2 leading-snug">{title}</h4>
            <p className="text-xs text-zinc-500 leading-relaxed flex-1 mb-6">{description}</p>
            <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-zinc-200 text-xs font-black tracking-widest uppercase py-2.5 px-4 hover:bg-black hover:text-white hover:border-black transition-all"
            >
                📄 Abrir PDF ↗
            </a>
        </div>
    )
}
