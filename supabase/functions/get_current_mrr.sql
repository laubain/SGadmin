create or replace function get_current_mrr()
returns numeric as $$
declare
  mrr numeric;
begin
  select sum(case 
    when p.interval = 'year'
