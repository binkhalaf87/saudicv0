create extension if not exists "pgcrypto";

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    target_role,
    city,
    years_experience,
    skills
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'target_role', ''),
    coalesce(new.raw_user_meta_data ->> 'city', ''),
    nullif(new.raw_user_meta_data ->> 'years_experience', '')::int,
    case
      when new.raw_user_meta_data ? 'skills'
        then array(
          select jsonb_array_elements_text(new.raw_user_meta_data -> 'skills')
        )
      else '{}'::text[]
    end
  )
  on conflict (id) do update
  set email = excluded.email;

  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  target_role text not null default '',
  city text not null default '',
  years_experience int,
  skills text[] not null default '{}'::text[],
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  file_name text not null,
  file_path text not null unique,
  mime_type text,
  file_size bigint,
  upload_status text not null default 'uploaded' check (upload_status in ('uploaded', 'processing', 'analyzed', 'failed')),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references public.resumes (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  score int not null check (score between 0 and 100),
  summary text not null,
  strengths text[] not null default '{}'::text[],
  improvements text[] not null default '{}'::text[],
  insights jsonb not null default '[]'::jsonb,
  analysis_source text not null default 'rules',
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists resumes_user_id_created_at_idx on public.resumes (user_id, created_at desc);
create index if not exists analyses_user_id_created_at_idx on public.analyses (user_id, created_at desc);
create unique index if not exists analyses_resume_id_unique on public.analyses (resume_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists resumes_set_updated_at on public.resumes;
create trigger resumes_set_updated_at
before update on public.resumes
for each row
execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.analyses enable row level security;

drop policy if exists "Users can view their profile" on public.profiles;
create policy "Users can view their profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can insert their profile" on public.profiles;
create policy "Users can insert their profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Users can manage their resumes" on public.resumes;
create policy "Users can manage their resumes"
on public.resumes
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage their analyses" on public.analyses;
create policy "Users can manage their analyses"
on public.analyses
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes',
  'resumes',
  false,
  10485760,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;

drop policy if exists "Authenticated users can upload resumes" on storage.objects;
create policy "Authenticated users can upload resumes"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Authenticated users can view resumes" on storage.objects;
create policy "Authenticated users can view resumes"
on storage.objects
for select
to authenticated
using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Authenticated users can update resumes" on storage.objects;
create policy "Authenticated users can update resumes"
on storage.objects
for update
to authenticated
using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1])
with check (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Authenticated users can delete resumes" on storage.objects;
create policy "Authenticated users can delete resumes"
on storage.objects
for delete
to authenticated
using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

