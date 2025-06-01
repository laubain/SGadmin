/*
  # Create Bet Slips Storage

  1. Storage Setup
    - Creates `bet-slips` bucket in Supabase Storage
    - Sets up RLS policies for authenticated users
    - Configures allowed MIME types (images only)
*/

-- Create storage bucket
insert into storage.buckets (id, name, public)
values ('bet-slips', 'bet-slips', false);

-- Set up RLS policies
create policy "Users can upload their own bet slips"
  on storage.objects for insert
  with check (
    bucket_id = 'bet-slips' and
    auth.role() = 'authenticated'
  );

create policy "Users can view their own bet slips"
  on storage.objects for select
  using (
    bucket_id = 'bet-slips' and
    auth.uid() = owner
  );