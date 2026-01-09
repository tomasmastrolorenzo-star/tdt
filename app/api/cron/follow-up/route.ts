import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/services/email';

// This API route simulates a cron job that would run periodically
// In a real app, this would query a database for orders > 24h ago or abandoned carts
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // 'feedback' or 'abandoned'
    const email = searchParams.get('email'); // For testing purposes

    if (!email) {
        return NextResponse.json({ error: 'Email required for testing' }, { status: 400 });
    }

    try {
        if (type === 'feedback') {
            // Simulate sending feedback/cross-sell email 24h after purchase
            // await emailService.sendFollowUpEmail(email, 'Instagram Followers');
            return NextResponse.json({ success: true, message: 'Feedback email sent (SIMULATED)' });
        } else if (type === 'abandoned') {
            // Simulate sending abandoned cart email
            await emailService.sendAbandonedCartEmail(email, {
                serviceName: 'TikTok Views',
                amount: '5000'
            });
            return NextResponse.json({ success: true, message: 'Abandoned cart email sent' });
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error triggering follow-up:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
