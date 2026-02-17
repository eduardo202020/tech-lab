import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL = 'https://oti-test.jorgeparishuana.dev:4300/caliaire/1102';

export async function GET() {
    try {
        console.log('[API-Proxy] 📡 Fetching LoRa data from backend...');
        console.log('[API-Proxy] Backend URL:', BACKEND_URL);

        const response = await fetch(BACKEND_URL, {
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
            { error: 'Failed to fetch LoRa data', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500, headers: { 'Cache-Control': 'no-store' } }
        );
    }
}
