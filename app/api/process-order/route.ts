import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/services/email';
import { japClient } from '@/lib/services/jap';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, orderDetails, japId, link } = body;

        if (!email || !orderDetails) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // 1. Send order confirmation email
        try {
            await emailService.sendOrderConfirmation(email, orderDetails);
            console.log('📧 Email sent successfully to:', email);
        } catch (emailError) {
            console.error('❌ Failed to send email:', emailError);
            // Continue execution, don't fail the whole request just because email failed
        }

        // 2. Place order on JAP (if japId and link are present)
        let japOrderId = null;
        if (japId && link) {
            try {
                console.log(`🚀 Placing JAP order: Service ${japId}, Link ${link}, Amount ${orderDetails.amount}`);
                // Parse amount to number (remove non-digits)
                const quantity = parseInt(orderDetails.amount.replace(/\D/g, '')) || 1000;

                const result = await japClient.addOrder(japId, link, quantity);
                japOrderId = result.order;
                console.log('✅ JAP Order placed successfully:', japOrderId);
            } catch (japError) {
                console.error('❌ Failed to place JAP order:', japError);
                // We might want to log this to a database or alert admin
            }
        }

        return NextResponse.json({
            success: true,
            japOrderId
        });

    } catch (error) {
        console.error('Error processing order:', error);
        return NextResponse.json(
            { error: 'Failed to process order' },
            { status: 500 }
        );
    }
}
