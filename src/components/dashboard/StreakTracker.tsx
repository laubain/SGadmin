import { Flame, Zap, Trophy, Star } from 'lucide-react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { Tooltip } from '../ui/Tooltip'

const streakMessages = [
  "Keep going!",
  "Nice streak!",
  "You're on fire!",
  "Amazing consistency!",
  "Legendary dedication!"
]

export default function StreakTracker() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [streak, setStreak] = useState({ days: 0, credits: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStreak = async () => {
      if (!user) return
      
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!error && data) {
        const lastActivity = new Date(data.last_activity)
        const today = new Date()
        
        // Check if streak is broken (more than 1 day since last activity)
        if (today.getDate() - lastActivity.getDate() > 1) {
          // Reset streak
          await supabase
            .from('user_streaks')
            .update({ credits: 0 })
            .eq('user_id', user.id)
          setStreak({ days: 0, credits: 0 })
        } else {
          setStreak({ 
            days: data.credits, 
            credits: data.credits 
          })
        }
      }
      setLoading(false)
    }

    fetchStreak()
  }, [user, supabase])

  const getRewardMessage = () => {
    if (streak.days === 0) return "Start your streak today!"
    const index = Math.min(Math.floor(streak.days / 3), streakMessages.length - 1)
    return streakMessages[index]
  }

  const getBadge = () => {
    if (streak.days >= 14) return <Trophy className="w-5 h-5 text-yellow-500" />
    if (streak.days >= 7) return <Star className="w-5 h-5 text-blue-500" />
    if (streak.days >= 3) return <Zap className="w-5 h-5 text-purple-500" />
    return <Flame className="w-5 h-5 text-orange-500" />
  }

  if (loading) return <div className="animate-pulse h-24 bg-gray-100 rounded-lg" />

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-full">
            {getBadge()}
          </div>
          <div>
            <h3 className="font-medium">Current Streak</h3>
            <p className="text-sm text-gray-600">
              {streak.days} day{streak.days !== 1 ? 's' : ''} • {getRewardMessage()}
            </p>
          </div>
        </div>
        <Tooltip content="Earn 1 credit per day for using AI features">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {streak.credits} credits
          </div>
        </Tooltip>
      </div>
      <div className="mt-4 flex space-x-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${
              i < streak.days % 7 
                ? 'bg-gradient-to-r from-orange-500 to-yellow-500' 
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
