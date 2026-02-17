import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const camId = searchParams.get('cam_id') || 'smart_parking:A1';

        const backendUrl = `https://oti-test.jorgeparishuana.dev:4300/sp/${camId}`;
        console.log('[API-Proxy] 🅿️ Fetching Smart Parking data from backend...');
        console.log('[API-Proxy] Backend URL:', backendUrl);
        console.log('[API-Proxy] camId:', camId);

        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('[API-Proxy] ✅ Response status:', response.status);

        if (!response.ok) {
            throw new Error(`Backend responded with ${response.status}`);
        }

        const data = await response.json();
        console.log('[API-Proxy] 📊 Data received:', data);

        return NextResponse.json(data, {
            headers: { 'Cache-Control': 'no-store, no-cache' },
        });
    } catch (error) {
        console.error('[API-Proxy] ❌ Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Smart Parking data', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500, headers: { 'Cache-Control': 'no-store' } }
        );
    }
}
