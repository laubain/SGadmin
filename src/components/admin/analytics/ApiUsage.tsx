import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { FiDatabase, FiCpu, FiActivity, FiTrendingUp } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ApiUsage() {
  const supabase = useSupabaseClient()
  const [stats, setStats] = useState({
    totalCalls: 0,
    errorRate: 0,
    avgLatency: 0,
    modelUsage: [],
    endpointUsage: [],
    usageTrend: []
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30days')

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      
      // Get date range based on selection
      let days = 30
      if (timeRange === '7days') days = 7
      else if (timeRange === '90days') days = 90

      // Get total calls
      const { count: totalCalls } = await supabase
        .from('api_logs')
        .select('*', { count: 'exact', head: true })
        .gt('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())

      // Get error rate
      const { data: errorRateData } = await supabase
        .rpc('get_api_error_rate', { days_range: days })

      // Get average latency
      const { data: avgLatencyData } = await supabase
        .rpc('get_avg_api_latency', { days_range: days })

      // Get model usage
      const { data: modelUsage } = await supabase
        .rpc('get_model_usage_stats', { days_range: days })

      // Get endpoint usage
      const { data: endpointUsage } = await supabase
        .rpc('get_endpoint_usage_stats', { days_range: days })

      // Get usage trend
      const { data: usageTrend } = await supabase
        .rpc('get_api_usage_trend', { days_range: days })

      setStats({
        totalCalls: totalCalls || 0,
        errorRate: errorRateData || 0,
        avgLatency: avgLatencyData || 0,
        modelUsage: modelUsage || [],
        endpointUsage: endpointUsage || [],
        usageTrend: usageTrend || []
      })
      setLoading(false)
    }

    fetchStats()
  }, [supabase, timeRange])

  if (loading) return <div className="text-center py-12">Loading API metrics...</div>

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">API Usage</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border rounded-md px-3 py-1 text-sm"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FiDatabase size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Calls</p>
              <p className="text-2xl font-bold">{stats.totalCalls.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <FiActivity size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Error Rate</p>
              <p className="text-2xl font-bold">{stats.errorRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FiCpu size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Latency</p>
              <p className="text-2xl font-bold">{stats.avgLatency.toFixed(0)}ms</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiTrendingUp size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Growth</p>
              <p className="text-2xl font-bold">+12.5%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-medium mb-4">Model Usage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.modelUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="model" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#3b82f6" name="API Calls" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-medium mb-4">Endpoint Usage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.endpointUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="endpoint" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#10b981" name="API Calls" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border">
        <h3 className="font-medium mb-4">Usage Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.usageTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calls" fill="#8b5cf6" name="API Calls" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
