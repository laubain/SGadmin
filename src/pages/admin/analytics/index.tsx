import { useState } from 'react'
import AdminLayout from '../../../components/admin/Layout'
import AnalyticsOverview from '../../../components/admin/analytics/AnalyticsOverview'
import UserMetrics from '../../../components/admin/analytics/UserMetrics'
import RevenueMetrics from '../../../components/admin/analytics/RevenueMetrics'
import ApiUsage from '../../../components/admin/analytics/ApiUsage'
import RecentActivity from '../../../components/admin/analytics/RecentActivity'

export default function AnalyticsAdminPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Business Analytics</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md ${activeTab === 'overview' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-md ${activeTab === 'users' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`px-4 py-2 rounded-md ${activeTab === 'revenue' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              Revenue
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-4 py-2 rounded-md ${activeTab === 'api' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              API Usage
            </button>
          </div>
        </div>

        {activeTab === 'overview' && <AnalyticsOverview />}
        {activeTab === 'users' && <UserMetrics />}
        {activeTab === 'revenue' && <RevenueMetrics />}
        {activeTab === 'api' && <ApiUsage />}

        <RecentActivity />
      </div>
    </AdminLayout>
  )
}
