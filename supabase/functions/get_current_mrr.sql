/*
  # Calculate Current MRR

  Computes the monthly recurring revenue from active subscriptions:
  1. Handles both monthly and annual subscriptions
  2. Only includes active subscriptions
  3. Converts annual plans to monthly equivalent
*/

create or replace function get_current_mrr()
returns numeric as $$
declare
  mrr numeric;
begin
  select sum(case 
    when p.interval = 'year' then p.amount / 12
    else p.amount
  end) / 100
  into mrr
  from subscriptions s
  join prices p on s.stripe_price_id = p.id
  where s.status = 'active'
    and p.active = true;

  return coalesce(mrr, 0);
end;
$$ language plpgsql security definer;

-- Create supporting RPC call
create or replace function public.get_current_mrr()
returns numeric as $$
  select * from private.get_current_mrr();
$$ language sql security definer;
