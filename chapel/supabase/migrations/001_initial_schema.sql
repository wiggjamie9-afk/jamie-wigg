-- Chapel: Initial Schema Migration
-- Applies: orgs, org_members, members, roles, member_roles,
--          services, assignments, attendance
-- Includes: RLS policies, indexes, member_count trigger

-- ============================================================
-- TABLES
-- ============================================================

-- orgs: one row per church
-- RLS is NOT enabled on orgs; access is controlled via org_members join
create table orgs (
  id                        uuid primary key default gen_random_uuid(),
  name                      text not null,
  member_count              int not null default 0,
  stripe_customer_id        text,
  stripe_subscription_status text default 'free',
  created_at                timestamptz default now()
);

-- org_members: maps Supabase auth users to orgs
create table org_members (
  id      uuid primary key default gen_random_uuid(),
  org_id  uuid references orgs(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role    text not null default 'admin',
  unique(org_id, user_id)
);

-- members: people in the church directory
create table members (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid references orgs(id) on delete cascade,
  name       text not null,
  email      text not null,
  created_at timestamptz default now()
);

-- roles: service roles defined by the church
create table roles (
  id     uuid primary key default gen_random_uuid(),
  org_id uuid references orgs(id) on delete cascade,
  name   text not null
);

-- member_roles: which roles a member is eligible for
create table member_roles (
  member_id uuid references members(id) on delete cascade,
  role_id   uuid references roles(id) on delete cascade,
  primary key (member_id, role_id)
);

-- services: a Sunday service date
create table services (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid references orgs(id) on delete cascade,
  date       date not null,
  created_at timestamptz default now()
);

-- assignments: member assigned to a role for a service
create table assignments (
  id               uuid primary key default gen_random_uuid(),
  service_id       uuid references services(id) on delete cascade,
  member_id        uuid references members(id) on delete cascade,
  role_id          uuid references roles(id) on delete cascade,
  reminder_sent_at timestamptz
);

-- attendance: present/absent per assignment
create table attendance (
  assignment_id uuid references assignments(id) on delete cascade primary key,
  status        text not null check (status in ('present', 'absent')),
  recorded_at   timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_org_members_org_id   on org_members(org_id);
create index idx_org_members_user_id  on org_members(user_id);
create index idx_members_org_id       on members(org_id);
create index idx_roles_org_id         on roles(org_id);
create index idx_member_roles_member  on member_roles(member_id);
create index idx_member_roles_role    on member_roles(role_id);
create index idx_services_org_id      on services(org_id);
create index idx_services_date        on services(date);
create index idx_assignments_service  on assignments(service_id);
create index idx_assignments_member   on assignments(member_id);
create index idx_attendance_assign    on attendance(assignment_id);

-- ============================================================
-- TRIGGER: keep orgs.member_count in sync
-- ============================================================

create or replace function fn_update_member_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if tg_op = 'INSERT' then
    update orgs set member_count = member_count + 1 where id = new.org_id;
  elsif tg_op = 'DELETE' then
    update orgs set member_count = member_count - 1 where id = old.org_id;
  end if;
  return null;
end;
$$;

create trigger trg_member_count_insert
  after insert on members
  for each row execute function fn_update_member_count();

create trigger trg_member_count_delete
  after delete on members
  for each row execute function fn_update_member_count();

-- ============================================================
-- ROW-LEVEL SECURITY
-- ============================================================

-- org_members: users can only see their own membership rows
alter table org_members enable row level security;

create policy "org_members: own rows only"
  on org_members
  for all
  using (user_id = auth.uid());

-- Helper expression reused across tables (inline sub-select):
--   (org_id = (select org_id from org_members where user_id = auth.uid() limit 1))

-- members
alter table members enable row level security;

create policy "members: own org only"
  on members
  for all
  using (
    org_id = (
      select org_id from org_members
      where user_id = auth.uid()
      limit 1
    )
  );

-- roles
alter table roles enable row level security;

create policy "roles: own org only"
  on roles
  for all
  using (
    org_id = (
      select org_id from org_members
      where user_id = auth.uid()
      limit 1
    )
  );

-- member_roles: no direct org_id column; access through members
alter table member_roles enable row level security;

create policy "member_roles: own org only"
  on member_roles
  for all
  using (
    member_id in (
      select id from members
      where org_id = (
        select org_id from org_members
        where user_id = auth.uid()
        limit 1
      )
    )
  );

-- services
alter table services enable row level security;

create policy "services: own org only"
  on services
  for all
  using (
    org_id = (
      select org_id from org_members
      where user_id = auth.uid()
      limit 1
    )
  );

-- assignments: access via services -> org_id
alter table assignments enable row level security;

create policy "assignments: own org only"
  on assignments
  for all
  using (
    service_id in (
      select id from services
      where org_id = (
        select org_id from org_members
        where user_id = auth.uid()
        limit 1
      )
    )
  );

-- attendance: access via assignments -> services -> org_id
alter table attendance enable row level security;

create policy "attendance: own org only"
  on attendance
  for all
  using (
    assignment_id in (
      select a.id from assignments a
      join services s on s.id = a.service_id
      where s.org_id = (
        select org_id from org_members
        where user_id = auth.uid()
        limit 1
      )
    )
  );
