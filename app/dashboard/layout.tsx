"use client"

// NUCLEAR OPTION:
// Explicitly disabled to prevent "Missing Supabase anon key" build errors 
// while the landing page is the priority.

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto border border-zinc-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="9" x2="9" y1="21" y2="9" /></svg>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">System Update</h1>
                    <p className="text-zinc-500 text-sm">
                        The dashboard is currently offline for critical infrastructure upgrades.
                        Please return to the main page.
                    </p>
                </div>
                <a href="/" className="block w-full py-3 px-4 bg-white text-zinc-950 font-bold rounded-lg hover:bg-zinc-200 transition-colors">
                    Return to Home
                </a>
            </div>
        </div>
    )
}
