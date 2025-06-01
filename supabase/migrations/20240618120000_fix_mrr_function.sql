/*
# Fix MRR Calculation Function

1. Changes
   - Completed the get_current_mrr function with proper logic
   - Added security definer for proper permissions
   - Included null handling with coalesce
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
  join prices p on s.price_id = p.id
  where s.status = 'active'
    and (s.canceled_at is null or s.canceled_at > now())
    and s.current_period_end > now();

  return coalesce(mrr, 0);
end;
$$ language plpgsql security definer;