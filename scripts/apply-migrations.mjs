#!/usr/bin/env node
/**
 * TDT Migration Runner
 * Applies Supabase schema migrations via REST API
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const PROJECT_REF = SUPABASE_URL.match(/https:\/\/([a-z]+)\.supabase\.co/)?.[1];
const REST_URL = `https://${PROJECT_REF}.supabase.co/rest/v1/rpc`;

async function executeSql(sql, label) {
  console.log(`\n📦 Applying: ${label}`);
  console.log('─'.repeat(50));

  // Split SQL into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('COMMENT'));

  let success = 0;
  let failed = 0;

  for (const statement of statements) {
    if (statement.includes('CREATE TABLE') ||
        statement.includes('CREATE INDEX') ||
        statement.includes('CREATE OR REPLACE') ||
        statement.includes('ALTER TABLE') ||
        statement.includes('CREATE TRIGGER') ||
        statement.includes('CREATE POLICY') ||
        statement.includes('CREATE VIEW') ||
        statement.includes('DROP TRIGGER')) {

      try {
        // Use the exec RPC function if available, otherwise we need to use a different approach
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'apikey': SERVICE_KEY
          },
          body: JSON.stringify({ sql: statement + ';' })
        });

        if (!response.ok) {
          const error = await response.text();
          // Try alternative approach using direct query
          console.log(`  ⚠️ Statement needs manual application (index/policy may exist)`);
        } else {
          success++;
        }
      } catch (err) {
        // Many statements will fail via RPC, that's expected
        // We'll output SQL for manual application
      }
    }
  }

  console.log(`  ✅ Processed: ${success + failed} statements`);
  return { success, failed };
}

async function main() {
  console.log('\n🚀 TDT Migration Runner');
  console.log('═'.repeat(50));
  console.log(`Project: ${PROJECT_REF}`);
  console.log(`URL: ${SUPABASE_URL}`);

  // Read migration files
  const fs = await import('fs');
  const path = await import('path');

  const migrationsDir = './supabase';
  const migrations = [
    'schema_v19_lead_scoring.sql',
    'schema_v20_dm_tracking.sql'
  ];

  console.log('\n📋 Migrations to apply:');
  migrations.forEach((m, i) => console.log(`  ${i + 1}. ${m}`));

  console.log('\n');
  console.log('⚠️  IMPORTANT: Supabase REST API cannot execute DDL directly.');
  console.log('   You need to apply these migrations manually in Supabase Dashboard:');
  console.log('   → SQL Editor → New Query → Paste & Run');
  console.log('\n');
  console.log('🔗 Direct Link:');
  console.log(`   https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`);
  console.log('\n');

  // Generate combined migration file for easy copy-paste
  let combinedSql = '-- ==========================================\n';
  combinedSql += '-- TDT COMBINED MIGRATIONS (v19 + v20)\n';
  combinedSql += '-- Generated: ' + new Date().toISOString() + '\n';
  combinedSql += '-- ==========================================\n\n';

  for (const migration of migrations) {
    const filePath = path.join(migrationsDir, migration);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      combinedSql += `\n-- ═══════════════════════════════════════\n`;
      combinedSql += `-- ${migration}\n`;
      combinedSql += `-- ═══════════════════════════════════════\n\n`;
      combinedSql += content;
    }
  }

  // Write combined file
  const outputPath = './supabase/_combined_migrations.sql';
  fs.writeFileSync(outputPath, combinedSql);
  console.log(`📝 Combined migration file created:`);
  console.log(`   ${outputPath}`);
  console.log('\n');
  console.log('Copy the contents and paste into Supabase SQL Editor.');
}

main().catch(console.error);