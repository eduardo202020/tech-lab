import { NextResponse } from 'next/server';
import { DEFAULT_DEVICE_IDENTIFIERS, SENSOR_BACKEND_BASE_URLS } from '@/lib/sensorBackends';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const camId = searchParams.get('cam_id') || DEFAULT_DEVICE_IDENTIFIERS.people_counter;

        const backendUrl = `${SENSOR_BACKEND_BASE_URLS.people_counter}/cupe/${camId}`;

        const response = await fetch(backendUrl, {
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
            { error: 'Failed to fetch People Counter data', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500, headers: { 'Cache-Control': 'no-store' } }
        );
    }
}
