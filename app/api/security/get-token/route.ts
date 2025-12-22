
import { NextResponse } from 'next/server'
import { createLeadToken } from '@/lib/security/jwt'

export async function GET(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'

        // Issue a short-lived token tied to the session/IP
        const token = await createLeadToken({
            ip,
            source: 'TDT_LEAD_FLOW',
            timestamp: Date.now()
        })

        return NextResponse.json({ token })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to issue token' }, { status: 500 })
    }
}
