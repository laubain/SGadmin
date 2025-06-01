create or replace function get_top_ads(range_start timestamptz)
returns table (
  id uuid,
  title text,
  ad_type text,
  impressions bigint,
  clicks bigint,
  ctr numeric
) as $$
begin
  return query
    select 
      a.id,
      a.title,
      a.ad_type,
      count(i.id) as impressions,
      count(c.id) as clicks,
      case 
        when count(i.id) = 0 then 0
        else (count(c.id)::numeric / count(i.id)::numeric) * 100
      end as ctr
    from ads a
    left join ad_impressions i on i.ad_id = a.id and i.viewed_at >= range_start
    left join ad_clicks c on c.ad_id = a.id and c.clicked_at >= range_start
    group by a.id
    order by ctr desc nulls last
    limit 5;
end;
$$ language plpgsql;
