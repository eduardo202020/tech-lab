import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface Borrower {
  id: string;
  full_name?: string | null;
  username?: string | null;
  [key: string]: unknown;
}

interface ItemRow {
  id: string;
  name?: string | null;
  [key: string]: unknown;
}

// GET: list loans
export async function GET() {
  try {
    const { data: loans, error } = await supabase
      .from('loans')
      .select('*')
      .order('loan_date', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Enrich loans with borrower name and item name by batching queries
    const borrowerIds = Array.from(
      new Set((loans || []).map((l) => l.borrower_id).filter(Boolean) as string[])
    );
    const itemIds = Array.from(new Set((loans || []).map((l) => l.item_id).filter(Boolean) as string[]));

    const borrowersPromise = borrowerIds.length
      ? supabase.from('user_profiles').select('id, full_name, username').in('id', borrowerIds)
      : Promise.resolve({ data: [] as Borrower[], error: null });

    const itemsPromise = itemIds.length
      ? supabase.from('inventory_items').select('id, name').in('id', itemIds)
      : Promise.resolve({ data: [] as ItemRow[], error: null });

    const [borrowersRes, itemsRes] = await Promise.all([borrowersPromise, itemsPromise]);

    const borrowers = (borrowersRes?.data as Borrower[]) || [];
    const items = (itemsRes?.data as ItemRow[]) || [];

    const borrowerMap: Record<string, Borrower | undefined> = {};
    borrowers.forEach((b) => (borrowerMap[String(b.id)] = b));

    const itemMap: Record<string, ItemRow | undefined> = {};
    items.forEach((it) => (itemMap[String(it.id)] = it));

    const enriched = (loans || []).map((l) => ({
      ...l,
      borrower_name: l.user_name || (borrowerMap[String(l.borrower_id)]?.full_name || borrowerMap[String(l.borrower_id)]?.username) || null,
      item_name: itemMap[String(l.item_id)]?.name || null,
    }));

    return NextResponse.json({ loans: enriched });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

// POST: create loan with conflict check
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Adapted to existing schema: item_id, borrower_id, loan_date, expected_return_date
    const { item_id, borrower_id, loan_date, expected_return_date } = body;

    if (!item_id || !loan_date || !expected_return_date) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Check for conflicts for the same item where ranges overlap
    const { data: conflicts, error: conflictError } = await supabase
      .from('loans')
      .select('*')
      .eq('item_id', item_id)
      .or(
        `and(loan_date.lte.${expected_return_date},expected_return_date.gte.${loan_date})`
      );

    if (conflictError) {
      return NextResponse.json({ error: conflictError.message }, { status: 500 });
    }

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json({ error: 'Conflict', conflicts }, { status: 409 });
    }

    const { data, error } = await supabase
      .from('loans')
      .insert({ item_id, borrower_id, loan_date, expected_return_date })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ loan: data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
