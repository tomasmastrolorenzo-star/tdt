// Test script to verify Zoho email configuration
// Run with: npx tsx scripts/test-email.ts

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { emailService } from '../lib/services/email';

async function testEmail() {
    console.log('🧪 Probando configuración de email...\n');

    // Debug: Check if environment variables are loaded
    console.log('📝 Variables de entorno:');
    console.log('   ZOHO_EMAIL:', process.env.ZOHO_EMAIL || '❌ NO ENCONTRADO');
    console.log('   ZOHO_PASSWORD:', process.env.ZOHO_PASSWORD ? '✅ CONFIGURADO' : '❌ NO ENCONTRADO');
    console.log('');

    try {
        const testOrderDetails = {
            serviceName: 'Instagram Followers - STARTER',
            amount: '1000 seguidores',
            price: '$9.99 USD'
        };

        console.log('📧 Enviando email de prueba a: tomasmastrolorenzo@gmail.com');

        await emailService.sendOrderConfirmation(
            'tomasmastrolorenzo@gmail.com',
            testOrderDetails
        );

        console.log('\n✅ ¡Email enviado exitosamente!');
        console.log('📬 Revisa tu bandeja de entrada en hola@trenddigitaltrade.com');

    } catch (error) {
        console.error('\n❌ Error al enviar email:');
        console.error(error);

        if (error instanceof Error) {
            if (error.message.includes('authentication')) {
                console.log('\n💡 Tip: Verifica que la contraseña de Zoho sea correcta.');
                console.log('   Puede que necesites generar una "App Password" en Zoho.');
            }
        }
    }
}

testEmail();
