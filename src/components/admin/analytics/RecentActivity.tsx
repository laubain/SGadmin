import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { FiUser, FiUpload, FiActivity, FiAward } from 'react-icons/fi'

export default function RecentActivity() {
  const supabase = useSupabaseClient()
  const [activity, setActivity] = useState({
    recentUploads: [],
    popularModels: [],
    leaderboard: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true)
      
      // Get recent uploads
      const { data: recentUploads } = await supabase
        .from('user_uploads')
        .select(`
          id,
          created_at,
          file_name,
          file_type,
          profiles:user_id (email)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      // Get popular models
      const { data: popularModels } = await supabase
        .from('ai_models')
        .select(`
          id,
          name,
          description,
          usage_count
        `)
        .order('usage_count', { ascending: false })
        .limit(5)

      // Get leaderboard
      const { data: leaderboard } = await supabase
        .from('user_leaderboard')
        .select(`
          user_id,
          score,
          rank,
          profiles:user_id (email, full_name)
        `)
        .order('score', { ascending: false })
        .limit(5)

      setActivity({
        recentUploads: recentUploads || [],
        popularModels: popularModels || [],
        leaderboard: leaderboard || []
      })
      setLoading(false)
    }

    fetchActivity()
  }, [supabase])

  if (loading) return <div className="text-center py-4">Loading recent activity...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-4 rounded-lg shadow border">
        <h3 className="font-medium mb-4 flex items-center">
          <FiUpload className="mr-2" /> Recent Uploads
        </h3>
        <ul className="space-y-3">
          {activity.recentUploads.map((upload) => (
            <li key={upload.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium truncate">{upload.file_name}</p>
                <p className="text-sm text-gray-500">{upload.profiles?.email}</p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(upload.created_at).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border">
        <h3 className="font-medium mb-4 flex items-center">
          <FiActivity className="mr-2" /> Popular Models
        </h3>
        <ul className="space-y-3">
          {activity.popularModels.map((model) => (
            <li key={model.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{model.name}</p>
                <p className="text-sm text-gray-500 truncate">{model.description}</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {model.usage_count} uses
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border">
        <h3 className="font-medium mb-4 flex items-center">
          <FiAward className="mr-2" /> Leaderboard
        </h3>
        <ul className="space-y-3">
          {activity.leaderboard.map((user) => (
            <li key={user.user_id} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-gray-500 w-6">{user.rank}.</span>
                <div>
                  <p className="font-medium">{user.profiles?.full_name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">{user.profiles?.email}</p>
                </div>
              </div>
              <span className="text-sm font-medium">{user.score} pts</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
