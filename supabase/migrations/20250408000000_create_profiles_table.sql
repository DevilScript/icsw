-- ตรวจสอบ RLS สำหรับ profiles
alter table profiles enable row level security;

-- อนุญาตให้ authenticated users อ่านข้อมูลของตัวเอง
create policy "Allow read for authenticated users" on profiles
  for select using (auth.uid() = user_id);

-- อนุญาตให้ authenticated users อัพเดทข้อมูลของตัวเอง
create policy "Allow update for authenticated users" on profiles
  for update using (auth.uid() = user_id);

-- อนุญาตให้ authenticated users เพิ่มข้อมูล
create policy "Allow insert for authenticated users" on profiles
  for insert with check (auth.uid() = user_id);

-- Trigger เพื่อ sync username เมื่อล็อกอิน
create or replace function sync_profile_on_auth()
returns trigger as $$
begin
  insert into profiles (user_id, username, balance, avatar_url)
  values (new.id, new.raw_user_meta_data->>'global_name', 0, new.raw_user_meta_data->>'avatar_url')
  on conflict (user_id) do update
  set username = new.raw_user_meta_data->>'global_name',
      avatar_url = new.raw_user_meta_data->>'avatar_url';
  return new;
end;
$$ language plpgsql;

create trigger sync_profile_trigger
after insert or update on auth.users
for each row execute function sync_profile_on_auth();

create or replace function update_balance_and_log_transaction(p_user_id text, p_amount numeric, p_voucher_hash text)
returns void as $$
begin
  update profiles
  set balance = balance + p_amount
  where user_id = p_user_id;

  insert into truemoney_transactions (user_id, amount, voucher_hash, status)
  values (p_user_id, p_amount, p_voucher_hash, 'success');
end;
$$ language plpgsql;
