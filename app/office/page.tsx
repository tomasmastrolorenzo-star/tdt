import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function OfficePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {}
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <header className="flex items-center justify-between pb-8 border-b border-zinc-900 mb-12">
        <h1 className="text-3xl font-black tracking-tighter">TDT Office</h1>
        <LogoutButton />
      </header>
      
      <main className="max-w-4xl">
        <p className="text-zinc-400 text-lg mb-8">
          Welcome back, <strong className="text-white">{user.email}</strong>.
        </p>
        <div className="p-8 border border-zinc-900 rounded-2xl bg-zinc-950">
          <h2 className="text-xl font-bold mb-4">Internal Dashboard</h2>
          <p className="text-zinc-500">Your protected workspace is secure and operational. Awaiting Phase 4 CRM System implementation.</p>
        </div>
      </main>
    </div>
  );
}
