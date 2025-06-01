import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { FiBarChart2, FiEye, FiMousePointer, FiX } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AnalyticsDashboard({ onClose }) {
  const supabase = useSupabaseClient()
  const [stats, setStats] = useState({
    totalImpressions: 0,
    totalClicks: 0,
    ctr: 0,
    topAds: [],
    dailyStats: []
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7days')

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      
      // Get date range based on selection
      let dateFilter = ''
      const now = new Date()
      const startDate = new Date()
      
      if (timeRange === '7days') {
        startDate.setDate(now.getDate() - 7)
      } else if (timeRange === '30days') {
        startDate.setDate(now.getDate() - 30)
      } else {
        startDate.setMonth(now.getMonth() - 1)
      }
      
      dateFilter = `viewed_at.gte.${startDate.toISOString()}`

      // Fetch aggregated stats
      const { data: impressions } = await supabase
        .from('ad_impressions')
        .select('count', { count: 'exact', head: true })
        .filter('viewed_at', 'gte', startDate.toISOString())

      const { data: clicks } = await supabase
        .from('ad_clicks')
        .select('count', { count: 'exact', head: true })
        .filter('clicked_at', 'gte', startDate.toISOString())

      // Fetch top performing ads
      const { data: topAds } = await supabase
        .rpc('get_top_ads', { range_start: startDate.toISOString() })
        .limit(5)

      // Fetch daily stats for chart
      const { data: dailyStats } = await supabase
        .rpc('get_daily_ad_stats', { range_start: startDate.toISOString() })

      setStats({
        totalImpressions: impressions?.count || 0,
        totalClicks: clicks?.count || 0,
        ctr: impressions?.count ? (clicks?.count / impressions?.count * 100) : 0,
        topAds: topAds || [],
        dailyStats: dailyStats || []
      })
      setLoading(false)
    }

    fetchStats()
  }, [supabase, timeRange])

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <FiBarChart2 className="mr-2" /> Ad Analytics
          </h2>
          <div className="flex space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="month">This Month</option>
            </select>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700"
              title="Close"
            >
              <FiX />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading analytics...</div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <FiEye size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Impressions</p>
                    <p className="text-2xl font-bold">{stats.totalImpressions.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <FiMousePointer size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Clicks</p>
                    <p className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <FiBarChart2 size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Click-Through Rate</p>
                    <p className="text-2xl font-bold">{stats.ctr.toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-4">Performance Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="impressions" fill="#3b82f6" name="Impressions" />
                    <Bar dataKey="clicks" fill="#10b981" name="Clicks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-4">Top Performing Ads</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ad</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Impressions</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">CTR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.topAds.map((ad) => (
                      <tr key={ad.id}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="font-medium">{ad.title}</div>
                          <div className="text-sm text-gray-500">{ad.ad_type}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">{ad.impressions}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{ad.clicks}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{ad.ctr.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
