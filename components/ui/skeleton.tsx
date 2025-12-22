"use client"

import React from "react"
import { cn } from "@/lib/utils"

export default function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800", className)}
            {...props}
        />
    )
}
