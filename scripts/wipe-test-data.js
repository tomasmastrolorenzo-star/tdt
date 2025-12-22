
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function wipe() {
    console.log('Wiping funnel_events...');
    const { error: e1 } = await supabase.from('funnel_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (e1) console.error('Error wiping funnel_events:', e1);

    console.log('Wiping orders...');
    const { error: e2 } = await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (e2) console.error('Error wiping orders:', e2);

    console.log('Cleanup complete.');
}

wipe();
