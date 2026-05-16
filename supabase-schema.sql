create table if not exists public.profiles (
  id text primary key,
  nome text not null,
  email text not null unique,
  foto text,
  provider text not null check (provider in ('google', 'credentials')),
  idade integer,
  mes_nascimento text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();
