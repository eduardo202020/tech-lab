import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL = 'https://oti-test.jorgeparishuana.dev:4300/caliaire/1102';

export async function GET() {
    try {
        const response = await fetch(BACKEND_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Backend responded with ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json(data, {
            headers: { 'Cache-Control': 'no-store, no-cache' },
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch LoRa data', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500, headers: { 'Cache-Control': 'no-store' } }
        );
    }
}
