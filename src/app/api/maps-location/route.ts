import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } =
    process.env;

const supabaseKey = SUPABASE_SERVICE_ROLE_KEY ?? NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
    NEXT_PUBLIC_SUPABASE_URL && supabaseKey
        ? createClient(NEXT_PUBLIC_SUPABASE_URL, supabaseKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        })
        : null;

type LocationPayload = {
    lat?: number;
    lng?: number;
    source?: string;
};

type LocationRow = {
    lat: number;
    lng: number;
    source: string;
    created_at: string;
};

const isValidCoordinate = (lat: number, lng: number) =>
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180;

const formatLocation = (row: LocationRow) => ({
    lat: Number(row.lat),
    lng: Number(row.lng),
    source: String(row.source),
    updatedAt: new Date(row.created_at).toISOString(),
});

const getSupabaseClient = () => {
    if (!supabase) {
        throw new Error('Supabase env vars missing (NEXT_PUBLIC_SUPABASE_URL + key).');
    }
    return supabase;
};

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as LocationPayload;
        const lat = Number(body.lat);
        const lng = Number(body.lng);

        if (!isValidCoordinate(lat, lng)) {
            return NextResponse.json(
                { error: 'Invalid coordinates. Expected lat/lng in valid ranges.' },
                { status: 400 }
            );
        }

        const { data, error } = await getSupabaseClient()
            .from('map_locations')
            .insert({ lat, lng, source: body.source ?? 'external-app' })
            .select('lat,lng,source,created_at')
            .single();

        if (error || !data) {
            throw new Error(error?.message ?? 'Supabase insert failed');
        }

        return NextResponse.json(
            { ok: true, location: formatLocation(data as LocationRow) },
            { status: 201, headers: { 'Cache-Control': 'no-store' } }
        );
    } catch (error) {
        console.error('Error saving map location:', error);
        return NextResponse.json(
            {
                error: 'Failed to save location',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500, headers: { 'Cache-Control': 'no-store' } }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const rawLimit = Number(searchParams.get('limit') ?? '1');
        const limit = Number.isFinite(rawLimit)
            ? Math.min(Math.max(Math.trunc(rawLimit), 1), 50)
            : 1;

        const { data, error } = await getSupabaseClient()
            .from('map_locations')
            .select('lat,lng,source,created_at')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            throw new Error(error.message);
        }

        if (!data || data.length === 0) {
            return NextResponse.json(
                { error: 'No location has been received yet.' },
                { status: 404, headers: { 'Cache-Control': 'no-store' } }
            );
        }

        const locations = (data as LocationRow[]).map(formatLocation);

        return NextResponse.json(
            { location: locations[0], locations },
            { headers: { 'Cache-Control': 'no-store' } }
        );
    } catch (error) {
        console.error('Error reading map location:', error);
        return NextResponse.json(
            {
                error: 'Failed to read location',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500, headers: { 'Cache-Control': 'no-store' } }
        );
    }
}
