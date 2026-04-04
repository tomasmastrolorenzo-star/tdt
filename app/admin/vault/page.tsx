import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { VaultClient } from "./vault-client";

export default async function VaultPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll() }, setAll() {} }
  });

  const { data: config } = await supabase
    .from('system_config')
    .select('*')
    .order('key', { ascending: true });

  return (
    <div className="flex-1 bg-[#050505] min-h-screen">
      <VaultClient initialConfig={config || []} />
    </div>
  );
}
