import { Trophy, Award, Users } from 'lucide-react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'

export default function Leaderboard() {
  const supabase = useSupabaseClient()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_xp')
        .select(`
          xp_points,
          level,
          profiles:profiles (
            id,
            full_name,
            avatar_url
          )
        `)
        .order('xp_points', { ascending: false })
        .limit(10)

      if (!error) {
        setLeaderboard(data)
      }
      setLoading(false)
    }

    fetchLeaderboard()
  }, [supabase])

  if (loading) return <div className="animate-pulse h-64 bg-gray-100 rounded-lg" />

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h3 className="font-medium">Top Users</h3>
      </div>

      <div className="space-y-3">
        {leaderboard.map((user, index) => (
          <div key={user.profiles.id} className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index === 0 ? 'bg-yellow-100 text-yellow-600' : 
              index === 1 ? 'bg-gray-100 text-gray-600' : 
              index === 2 ? 'bg-amber-100 text-amber-600' : 'bg-gray-50'
            }`}>
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="font-medium">{user.profiles.full_name || 'Anonymous'}</p>
              <p className="text-sm text-gray-500">Level {user.level}</p>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">{user.xp_points} XP</span>
            </div>
          </div>
        ))}

        {leaderboard.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users className="mx-auto h-8 w-8 mb-2" />
            <p>No users yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
