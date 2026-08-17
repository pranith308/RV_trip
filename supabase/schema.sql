-- Family Expedition shared tables
-- Run this in the Supabase SQL editor once.

create table if not exists people (
  id uuid primary key,
  name text not null,
  pin_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists trip_state (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table people enable row level security;
alter table trip_state enable row level security;

drop policy if exists open_people on people;
create policy open_people on people
  for all
  using (true)
  with check (true);

drop policy if exists open_state on trip_state;
create policy open_state on trip_state
  for all
  using (true)
  with check (true);

insert into trip_state (id, data)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

do $$
begin
  alter publication supabase_realtime add table people;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table trip_state;
exception
  when duplicate_object then null;
end $$;
