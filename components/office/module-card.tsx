import Link from "next/link"

interface ModuleCardProps {
    icon: string
    title: string
    description: string
    actionLabel: string
    href: string
    external?: boolean
}

export function ModuleCard({
    icon,
    title,
    description,
    actionLabel,
    href,
    external = false,
}: ModuleCardProps) {
    return (
        <div className="border border-zinc-200 bg-white p-8 flex flex-col group hover:border-black transition-all duration-200">
            <div className="text-5xl mb-6">{icon}</div>
            <h3 className="text-xl font-black tracking-tighter mb-3">{title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed mb-8 flex-1">{description}</p>
            {external ? (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-black text-white text-xs font-black tracking-widest uppercase py-3 px-6 hover:bg-zinc-800 transition-colors"
                >
                    {actionLabel} <span>↗</span>
                </a>
            ) : (
                <Link
                    href={href}
                    className="inline-flex items-center justify-center gap-2 bg-black text-white text-xs font-black tracking-widest uppercase py-3 px-6 hover:bg-zinc-800 transition-colors"
                >
                    {actionLabel} <span>→</span>
                </Link>
            )}
        </div>
    )
}
