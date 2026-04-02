import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// POST /api/admin/renewal-check
// Called daily at 08:00 UTC by Vercel cron (vercel.json)
// Also callable manually from the admin for testing.
export async function POST(req: Request) {
  // Vercel cron requests arrive with a special auth header
  const authHeader = req.headers.get('authorization');
  const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;

  // Allow Vercel cron OR authenticated admin user
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  );

  if (!isVercelCron) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. Fetch active clients whose renewal_date is within the next 24 hours
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const { data: clients, error: clientErr } = await supabase
    .from('clients')
    .select('id, instagram_username, payment_amount, renewal_date, notes')
    .eq('status', 'active')
    .lte('renewal_date', in24h.toISOString())
    .gte('renewal_date', now.toISOString()); // not already expired

  if (clientErr) return NextResponse.json({ error: clientErr.message }, { status: 500 });
  if (!clients || clients.length === 0) {
    return NextResponse.json({ created: 0, skipped: 0, message: 'No renewals due in next 24h' });
  }

  let created = 0;
  let skipped = 0;

  for (const client of clients) {
    // 2. Check if a renewal_reminder already exists for this client (pending)
    const { data: existing } = await supabase
      .from('scheduled_actions')
      .select('id')
      .eq('client_id', client.instagram_username)
      .eq('action_type', 'renewal_reminder')
      .eq('status', 'pending')
      .maybeSingle();

    if (existing) {
      skipped++;
      continue;
    }

    // 3. Create the scheduled_action reminder
    const messagePayload = JSON.stringify({
      message: "Hey, your results have been looking great. Want to keep the momentum going this month?",
      client_handle: client.instagram_username,
      original_amount: client.payment_amount || 0,
    });

    const { error: insertErr } = await supabase
      .from('scheduled_actions')
      .insert({
        action_type: 'renewal_reminder',
        client_id: client.instagram_username,
        execute_at: client.renewal_date,
        status: 'pending',
        message_payload: messagePayload,
      });

    if (!insertErr) {
      created++;
      // 4. Create a notification for the admin
      await supabase.from('notifications').insert({
        type: 'renewal_due',
        message: `Renewal due: @${client.instagram_username} — $${client.payment_amount || 0}`,
      });
    }
  }

  return NextResponse.json({
    created,
    skipped,
    checked: clients.length,
    message: `${created} renewal reminders created, ${skipped} already existed.`,
  });
}

// GET for easy manual trigger from browser (admin only)
export async function GET(req: Request) {
  return POST(req);
}
