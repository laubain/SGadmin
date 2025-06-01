create or replace function get_daily_ad_stats(range_start timestamptz)
returns table (
  date date,
  impressions bigint,
  clicks bigint
) as $$
begin
  return query
    select 
      date_trunc('day', i.viewed_at)::date as date,
      count(i.id) as impressions,
      count(c.id) as clicks
    from generate_series(
      date_trunc('day', range_start),
      date_trunc('day', now()),
      interval '1 day'
    ) as day
    left join ad_impressions i on date_trunc('day', i.viewed_at) = day
    left join ad_clicks c on date_trunc('day', c.clicked_at) = day and c.ad_id = i.ad_id
    group by date
    order by date;
end;
$$ language plpgsql;
