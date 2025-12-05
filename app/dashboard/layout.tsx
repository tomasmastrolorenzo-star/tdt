import { Sidebar } from "@/components/dashboard/Sidebar"
import { Header } from "@/components/dashboard/Header"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-zinc-50/50 dark:bg-zinc-900/50">
            <Sidebar className="hidden w-64 lg:block fixed inset-y-0 left-0 z-50" />
            <div className="flex-1 lg:pl-64">
                <Header />
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
