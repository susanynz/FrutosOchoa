-- Tablas para la valoración de páginas y de productos (estrellas de 1 a 5).
-- Ejecútalo una vez en Supabase > SQL Editor.
create table if not exists public.valoraciones_pagina (
  id bigint generated always as identity primary key,
  pagina text not null,
  estrellas smallint not null check (estrellas between 1 and 5),
  created_at timestamptz not null default now()
);

alter table public.valoraciones_pagina enable row level security;

-- Cualquier visitante puede leer el promedio y registrar su voto, pero no editar ni borrar.
create policy "leer valoraciones" on public.valoraciones_pagina
  for select to anon, authenticated using (true);

create policy "registrar valoracion" on public.valoraciones_pagina
  for insert to anon, authenticated with check (estrellas between 1 and 5);

-- Tabla para la valoración de cada producto de la tienda.
create table if not exists public.valoraciones_producto (
  id bigint generated always as identity primary key,
  producto_id bigint not null references public.productos(id) on delete cascade,
  estrellas smallint not null check (estrellas between 1 and 5),
  created_at timestamptz not null default now()
);

alter table public.valoraciones_producto enable row level security;

create policy "leer valoraciones de productos" on public.valoraciones_producto
  for select to anon, authenticated using (true);

create policy "registrar valoracion de producto" on public.valoraciones_producto
  for insert to anon, authenticated with check (estrellas between 1 and 5);
