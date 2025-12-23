import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username } = body;

        if (!username) {
            return NextResponse.json({ error: 'Username is required' }, { status: 400 });
        }

        const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || 'b3f8d26681msh591240419c64bfbp149aedjsn0b86a8fd85b2';
        const host = 'instagram-scraper-stable-api.p.rapidapi.com';

        // Using "Stable API" endpoint
        const response = await fetch(`https://${host}/get_ig_user_info.php`, {
            method: 'POST',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': host,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ username: username }).toString()
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Upstream API Error', details: response.statusText }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
