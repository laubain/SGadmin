import { supabase } from './supabase'

export async function awardStreakCredit(userId: string) {
  // Check if user already got credit today
  const { data: existing } = await supabase
    .from('user_streaks')
    .select('last_activity')
    .eq('user_id', userId)
    .single()

  const today = new Date().toISOString().split('T')[0]
  const lastActivity = existing?.last_activity?.split('T')[0]

  if (lastActivity === today) {
    return { alreadyAwarded: true }
  }

  // Award credit
  const { data, error } = await supabase
    .from('user_streaks')
    .upsert(
      { 
        user_id: userId,
        credits: 1,
        last_activity: new Date().toISOString()
      },
      { onConflict: 'user_id' }
    )
    .select()

  return { data, error }
}

export async function getUserStreak(userId: string) {
  const { data, error } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .single()

  return { data, error }
}
