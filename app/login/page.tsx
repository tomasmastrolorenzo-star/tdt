"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing secure environment configuration.");
      }

      // Safe Client-side Supabase SSR init
      const supabase = createBrowserClient(supabaseUrl, supabaseKey);

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Specific user-oriented edge cases
        if (authError.message.includes("Invalid login credentials")) {
          throw new Error("Incorrect email or password. Please try again.");
        }
        throw new Error(authError.message);
      }

      if (data.session) {
        // Essential to refresh router cache after obtaining the session properly
        router.refresh();
        router.push("/office");
      }

    } catch (err: any) {
      setError(err.message || "An unexpected system error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white font-sans selection:bg-zinc-800 p-6">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-2xl p-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter mb-2">TDT Access</h1>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Internal Control System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all disabled:opacity-50"
              placeholder="operator@trendigitaltrade.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-950/50 border border-red-900 rounded-xl">
              <p className="text-sm font-semibold text-red-500 text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full flex items-center justify-center gap-2 bg-white text-black font-black py-4 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Validating...
              </>
            ) : (
              "Secure Login"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
