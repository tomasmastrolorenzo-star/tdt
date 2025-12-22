import { cn } from "@/lib/utils"

interface ProgressRingProps {
    progress: number
    size?: number
    strokeWidth?: number
    color?: string
    backgroundColor?: string
    showPercentage?: boolean
    className?: string
}

export function ProgressRing({
    progress,
    size = 120,
    strokeWidth = 8,
    color = "#3b82f6",
    backgroundColor = "#e5e7eb",
    showPercentage = true,
    className
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (progress / 100) * circumference

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out"
                />
            </svg>
            {showPercentage && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold" style={{ color }}>
                        {Math.round(progress)}%
                    </span>
                </div>
            )}
        </div>
    )
}
