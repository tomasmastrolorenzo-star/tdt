import { cn } from "@/lib/utils"
import { Trophy } from "lucide-react"

interface LevelBadgeProps {
    levelName: string
    badgeColor: string
    size?: "sm" | "md" | "lg"
    showIcon?: boolean
    className?: string
}

export function LevelBadge({
    levelName,
    badgeColor,
    size = "md",
    showIcon = true,
    className
}: LevelBadgeProps) {
    const sizeClasses = {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-1.5",
        lg: "text-base px-4 py-2"
    }

    const iconSizes = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5"
    }

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full font-semibold",
                "shadow-sm border-2 transition-all duration-300",
                "hover:scale-105 hover:shadow-md",
                sizeClasses[size],
                className
            )}
            style={{
                backgroundColor: `${badgeColor}20`,
                borderColor: badgeColor,
                color: badgeColor
            }}
        >
            {showIcon && <Trophy className={iconSizes[size]} />}
            <span>{levelName}</span>
        </div>
    )
}
