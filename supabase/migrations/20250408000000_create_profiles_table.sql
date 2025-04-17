-- อัพเดท RLS สำหรับ profiles
alter table profiles enable row level security;

-- อนุญาตให้ authenticated users อ่าน
create policy "Allow read for authenticated users" on profiles
  for select using (auth.uid() = user_id);

-- อนุญาตให้ authenticated users อัพเดท
create policy "Allow update for authenticated users" on profiles
  for update using (auth.uid() = user_id);

-- อนุญาตให้ authenticated users เพิ่มข้อมูล
create policy "Allow insert for authenticated users" on profiles
  for insert with check (auth.uid() = user_id);

-- Trigger สำหรับ sync username จาก auth.users
create or replace function sync_profile_on_auth()
returns trigger as $$
begin
  insert into profiles (user_id, username, balance, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'global_name', new.raw_user_meta_data->>'name', 'Unknown User'),
    0,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (user_id) do update
  set username = coalesce(new.raw_user_meta_data->>'global_name', new.raw_user_meta_data->>'name', 'Unknown User'),
      avatar_url = new.raw_user_meta_data->>'avatar_url';
  return new;
end;
$$ language plpgsql;

create trigger sync_profile_trigger
after insert or update on auth.users
for each row execute function sync_profile_on_auth();
