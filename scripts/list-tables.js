
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listTables() {
    const { data, error } = await supabase.rpc('get_tables');
    if (error) {
        // Fallback: try to select from a known system table if available or just try to select from information_schema via query
        console.log('RPC failed, trying raw query...');
        const { data: qData, error: qError } = await supabase.from('pg_tables').select('tablename').eq('schemaname', 'public');
        if (qError) {
            // One last try: just try to insert and see what happens? No.
            console.error('Final error:', qError);
        } else {
            console.log('Tables:', qData);
        }
    } else {
        console.log('Tables:', data);
    }
}

listTables();
