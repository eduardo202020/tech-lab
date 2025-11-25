-- Create loans table for equipment reservations

create table if not exists public.loans (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid references public.inventory_items(id) on delete cascade,
  user_id uuid,
  user_name text,
  start_date timestamptz not null,
  end_date timestamptz not null,
  status text not null default 'reserved',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_loans_equipment_start_end on public.loans (equipment_id, start_date, end_date);
