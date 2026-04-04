import { createServerClient } from '@supabase/ssr';
import { cookies } from "next/headers";
import { LeadsClientRenderer } from './leads-client';
import { LogoutButton } from '@/components/auth/logout-button';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminLeadsPage() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return <div className="p-8 text-white bg-black h-screen">Database configuration missing</div>;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {}
    }
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return <div className="p-8 text-white bg-black h-screen">Unauthorized access. Please login.</div>;
  }

  // Fetch role for filtering
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role?.toLowerCase();
  
  let query = supabase.from('leads').select('*');
  
  // Filter by assignment if user is a Setter (vendor)
  if (role === 'vendor') {
    query = query.eq('assigned_to', user.id);
  }

  const { data: leads, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return <div className="p-8 text-red-500 bg-black h-screen">Error loading leads: {error.message}</div>;
  }

  return (
    <div className="p-4 lg:p-10">
      <LeadsClientRenderer initialLeads={leads || []} />
    </div>
  );
}
