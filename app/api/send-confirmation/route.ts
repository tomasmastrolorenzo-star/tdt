import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/services/email';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, orderDetails } = body;

        if (!email || !orderDetails) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Send order confirmation email
        await emailService.sendOrderConfirmation(email, orderDetails);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
}
