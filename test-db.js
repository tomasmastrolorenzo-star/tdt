const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if(!supabaseUrl || !supabaseKey) { 
  console.error('MISSING ENV VARS'); 
  process.exit(1); 
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Verificando Schema...');
  
  const { data: q1, error: e1 } = await supabase.from('daily_reports').select('*').limit(1);
  console.log('daily_reports:', e1 ? 'ERROR: ' + e1.message : 'OK');

  const { data: q2, error: e2 } = await supabase.from('scheduled_actions').select('*').limit(1);
  console.log('scheduled_actions:', e2 ? 'ERROR: ' + e2.message : 'OK');

  const { data: q3, error: e3 } = await supabase.from('notifications').select('*').limit(1);
  console.log('notifications:', e3 ? 'ERROR: ' + e3.message : 'OK');

  const { data: q4, error: e4 } = await supabase.from('clients').select('delivery_status').limit(1);
  console.log('clients.delivery_status:', e4 ? 'ERROR: ' + e4.message : 'OK');
}
check();
