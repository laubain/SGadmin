import { useState } from 'react'
import { Tab } from '@headlessui/react'
import AnalyticsOverview from './AnalyticsOverview'
import UserMetrics from './UserMetrics'
import RevenueMetrics from './RevenueMetrics'
import ApiUsage from './ApiUsage'
import RecentActivity from './RecentActivity'

export default function AnalyticsDashboard() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-md text-sm font-medium">
            Export
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium">
            Refresh
          </button>
        </div>
      </div>

      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1">
          {['Overview', 'Users', 'Revenue', 'API'].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `w-full py-2 text-sm font-medium rounded-md transition-colors ${
                  selected ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <AnalyticsOverview />
            <div className="mt-6">
              <RecentActivity />
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <UserMetrics />
          </Tab.Panel>
          <Tab.Panel>
            <RevenueMetrics />
          </Tab.Panel>
          <Tab.Panel>
            <ApiUsage />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
