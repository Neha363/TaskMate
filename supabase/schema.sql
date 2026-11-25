-- TaskMate – Personal To-Do Manager
-- PostgreSQL Schema & Row Level Security (RLS) Setup for Supabase
-- Run this script in your Supabase Dashboard -> SQL Editor.

-- 1. Create the tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null check (char_length(trim(title)) > 0),
  description text not null default '',
  due_date date,
  priority text not null default 'Medium' check (priority in ('Low', 'Medium', 'High')),
  category text not null default 'Personal' check (category in ('Personal', 'College', 'Work')),
  is_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Create indexes for fast user-scoped queries
create index if not exists tasks_user_id_created_at_idx
  on public.tasks (user_id, created_at desc);

create index if not exists tasks_user_id_due_date_idx
  on public.tasks (user_id, due_date);

-- 3. Automatically maintain updated_at on row updates
create or replace function public.handle_tasks_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
  before update on public.tasks
  for each row
  execute function public.handle_tasks_updated_at();

-- 4. Enable Row Level Security (RLS)
alter table public.tasks enable row level security;

-- 5. RLS Policies: Each authenticated user can only access and manage their own tasks
drop policy if exists "Users can view their own tasks" on public.tasks;
create policy "Users can view their own tasks"
  on public.tasks
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own tasks" on public.tasks;
create policy "Users can create their own tasks"
  on public.tasks
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own tasks" on public.tasks;
create policy "Users can update their own tasks"
  on public.tasks
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own tasks" on public.tasks;
create policy "Users can delete their own tasks"
  on public.tasks
  for delete
  to authenticated
  using (auth.uid() = user_id);
