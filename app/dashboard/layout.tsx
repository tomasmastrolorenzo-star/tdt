"use client"

import { Sidebar } from "@/components/dashboard/Sidebar"
import { Header } from "@/components/dashboard/Header"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-zinc-50/50 dark:bg-zinc-900/50">
            {/* Desktop Sidebar */}
            <Sidebar className="hidden w-64 lg:block fixed inset-y-0 left-0 z-50" />

            {/* Mobile Sidebar (Drawer) */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetContent side="left" className="p-0 w-64">
                    <Sidebar className="border-0" onNavigate={() => setMobileMenuOpen(false)} />
                </SheetContent>
            </Sheet>

            <div className="flex-1 lg:pl-64">
                {/* Mobile Menu Button */}
                <div className="lg:hidden fixed top-4 left-4 z-40">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setMobileMenuOpen(true)}
                        className="bg-background"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>

                <Header />
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
