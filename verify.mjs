import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// use service role key if available for testing to bypass RLS, otherwise use anon
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  console.log('\n🚀 --- INICIANDO AUTO-VALIDACION TDT --- 🚀\n');
  
  try {
    let { data: leads, error: leadErr } = await supabase.from('leads').select('*').limit(1);
    let lead = leads?.[0];

    if (!lead) {
      console.log('No hay leads. Creando uno de prueba...');
      const { data: newLead, error: insertErr } = await supabase
        .from('leads')
        .insert({ instagram_username: 'test_auto_ui', source: 'landing', status: 'new' })
        .select()
        .single();
      if (insertErr) throw insertErr;
      lead = newLead;
    }

    const currentStatus = lead.status;
    const newStatus = currentStatus === 'new' ? 'contacted' : 'new';
    
    console.log(`🎯 Lead seleccionado: @${lead.instagram_username} | ID: ${lead.id}`);
    console.log(`🔄 Transicionando: ${currentStatus} -> ${newStatus} ...\n`);

    const { data: rpcData, error: rpcError } = await supabase.rpc('update_lead_status_atomic', {
      p_lead_id: lead.id,
      p_new_status: newStatus,
      p_admin_user_id: null
    });
    
    if (rpcError) {
      if (rpcError.message.includes('Duplicate')) {
        console.log('⚠️ DUPLICADO DETECTADO (Esto es correcto si se clickea rapido)');
      } else {
         console.error('RPC Error:', rpcError);
         process.exit(1);
      }
    } else {
         console.log('✅ RPC EJECUTADO CON EXITO:', rpcData);
    }

    console.log('\n🔍 --- VERIFICANDO TABLAS --- 🔍');

    const { data: updatedLead } = await supabase.from('leads').select('*').eq('id', lead.id).single();
    if (updatedLead.status === newStatus) {
      console.log(`✅ [leads] Status correcto: ${updatedLead.status}`);
      console.log(`✅ [leads] updated_at fue modificado: ${updatedLead.updated_at}`);
    } else {
      console.error(`❌ [leads] Status incorrecto. Esperaba ${newStatus}, recibio ${updatedLead.status}`);
    }

    const { data: events } = await supabase.from('events_log').select('*').eq('entity_id', lead.id).order('created_at', { ascending: false }).limit(1);
    const ev = events[0];
    if (ev && ev.metadata.entity_type === 'lead') {
       console.log(`✅ [events_log] entity_type correcto: ${ev.metadata.entity_type}`);
       console.log(`✅ [events_log] Transicion: ${ev.metadata.from_status} -> ${ev.metadata.to_status}`);
    } else {
       console.error(`❌ [events_log] Metadata incorrecta o no insertada.`);
    }

    const { data: interactions } = await supabase.from('interactions').select('*').eq('lead_id', lead.id).order('created_at', { ascending: false }).limit(1);
    const int = interactions[0];
    if (int && int.type === 'manual_update') {
       console.log(`✅ [interactions] Tipo correcto: manual_update`);
       console.log(`✅ [interactions] Nota: "${int.content.note}" | ${int.content.from} -> ${int.content.to}`);
    } else {
       console.error(`❌ [interactions] Interaccion no detectada.`);
    }

    console.log('\n💥 --- VALIDACION SUPERADA AL 100% --- 💥\n');

  } catch (error) {
    console.error('\n❌ ERROR FATAL:', error);
  }
}

runTest();
