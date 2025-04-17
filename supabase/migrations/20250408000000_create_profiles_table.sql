create or replace function update_balance_and_log_transaction(p_user_id text, p_amount numeric, p_voucher_hash text)
returns void as $$
begin
  -- อัพเดท balance
  update profiles
  set balance = balance + p_amount
  where user_id = p_user_id;

  -- บันทึก transaction
  insert into truemoney_transactions (user_id, amount, voucher_hash, status)
  values (p_user_id, p_amount, p_voucher_hash, 'success');
end;
$$ language plpgsql;
