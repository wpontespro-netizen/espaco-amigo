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

create table if not exists public.psychologists (
  id uuid primary key,
  nome text not null,
  email text not null,
  whatsapp text not null,
  crp text not null,
  bio text not null,
  especialidade_principal text not null,
  outras_especialidades text,
  foto_url text not null,
  horas_semanais text not null,
  horarios_disponiveis text not null,
  abordagem text not null,
  cidade text not null,
  estado text not null,
  atendimento_online boolean not null default true,
  linkedin text,
  instagram text,
  site text,
  valor_sessao text,
  status text not null default 'em_avaliacao' check (status in ('em_avaliacao', 'aprovado', 'recusado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists psychologists_set_updated_at on public.psychologists;

create trigger psychologists_set_updated_at
before update on public.psychologists
for each row
execute function public.set_updated_at();

create index if not exists psychologists_status_idx on public.psychologists (status);

insert into storage.buckets (id, name, public)
values ('psychologist-photos', 'psychologist-photos', true)
on conflict (id) do nothing;
