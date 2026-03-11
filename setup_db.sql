-- 1. Create PROFILES table (Publicly accessible user data)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create TRANSACTIONS table
create table transactions (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  sender_name text not null,
  recipient_name text not null,
  amount numeric not null,
  currency text not null default 'USD',
  sending_bank text not null,
  receiving_bank text not null,
  reference_number text unique not null,
  date_sent timestamp with time zone not null default timezone('utc'::text, now()),
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  receipt_url text
);

-- 3. Create TRANSACTION_STAGES table
create table transaction_stages (
  id uuid primary key default uuid_generate_v4(),
  transaction_id uuid references transactions(id) on delete cascade not null,
  stage_name text not null,
  status text not null check (status in ('completed', 'current', 'upcoming')),
  description text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;
alter table transactions enable row level security;
alter table transaction_stages enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone" on profiles for select using ( true );
create policy "Users can update own profile" on profiles for update using ( auth.uid() = id );

-- Policies for Transactions
create policy "Users can view their own transactions" on transactions for select using ( auth.uid() = user_id );
create policy "Users can insert their own transactions" on transactions for insert with check ( auth.uid() = user_id );
create policy "Users can update their own transactions" on transactions for update using ( auth.uid() = user_id );

-- Public Tracking Access (Anyone can view a specific transaction by its ID)
create policy "Public can view specific transaction by ID" on transactions for select using ( true );

-- Policies for Transaction Stages
create policy "Stages are viewable by everyone" on transaction_stages for select using ( true );
create policy "Users can modify their transaction stages" on transaction_stages for all using ( 
  exists (
    select 1 from transactions 
    where transactions.id = transaction_stages.transaction_id 
    and transactions.user_id = auth.uid()
  )
);

-- TRIGGER: Sync auth.users to public.profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Realtime Setup
alter publication supabase_realtime add table transactions;
alter publication supabase_realtime add table transaction_stages;

