create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  created_at timestamptz default now()
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  slug text unique not null,
  category text,
  whatsapp_number text not null,
  logo_url text,
  banner_url text,
  description text,
  address text,
  delivery_fee numeric default 0,
  minimum_order numeric default 0,
  is_open boolean default true,
  opening_hours jsonb,
  primary_color text default '#ef4444',
  created_at timestamptz default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  description text,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text,
  price numeric not null,
  image_url text,
  is_available boolean default true,
  is_featured boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_name text,
  customer_phone text,
  delivery_type text,
  address text,
  payment_method text,
  notes text,
  items jsonb not null,
  subtotal numeric,
  delivery_fee numeric,
  total numeric,
  status text default 'new',
  created_at timestamptz default now()
);

create index if not exists businesses_owner_idx on public.businesses(owner_id);
create index if not exists businesses_slug_idx on public.businesses(slug);
create index if not exists categories_business_idx on public.categories(business_id);
create index if not exists products_business_idx on public.products(business_id);
create index if not exists orders_business_idx on public.orders(business_id);

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

drop policy if exists "profiles own read" on public.profiles;
create policy "profiles own read" on public.profiles for select using (auth.uid() = id);

drop policy if exists "profiles own insert" on public.profiles;
create policy "profiles own insert" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "profiles own update" on public.profiles;
create policy "profiles own update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "business public read" on public.businesses;
create policy "business public read" on public.businesses for select using (true);

drop policy if exists "business owner insert" on public.businesses;
create policy "business owner insert" on public.businesses for insert with check (auth.uid() = owner_id);

drop policy if exists "business owner update" on public.businesses;
create policy "business owner update" on public.businesses for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "business owner delete" on public.businesses;
create policy "business owner delete" on public.businesses for delete using (auth.uid() = owner_id);

drop policy if exists "categories public active read" on public.categories;
create policy "categories public active read" on public.categories for select using (
  is_active = true or exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
);

drop policy if exists "categories owner write" on public.categories;
create policy "categories owner write" on public.categories for all using (
  exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
) with check (
  exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
);

drop policy if exists "products public available read" on public.products;
create policy "products public available read" on public.products for select using (
  is_available = true or exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
);

drop policy if exists "products owner write" on public.products;
create policy "products owner write" on public.products for all using (
  exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
) with check (
  exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
);

drop policy if exists "orders owner read" on public.orders;
create policy "orders owner read" on public.orders for select using (
  exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
);

drop policy if exists "orders public insert" on public.orders;
create policy "orders public insert" on public.orders for insert with check (
  exists (select 1 from public.businesses b where b.id = business_id)
);

drop policy if exists "orders owner update" on public.orders;
create policy "orders owner update" on public.orders for update using (
  exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
) with check (
  exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
);
