import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('=== VERIFICACIÓN DE VARIABLES DE ENTORNO ===\n');
console.log('ZOHO_EMAIL:', process.env.ZOHO_EMAIL);
console.log('ZOHO_PASSWORD:', process.env.ZOHO_PASSWORD ? `${process.env.ZOHO_PASSWORD.substring(0, 4)}***` : 'NO ENCONTRADO');
console.log('\n===========================================');
