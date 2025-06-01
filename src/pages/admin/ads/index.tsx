import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import AdminLayout from '../../../components/admin/Layout'
import AdList from '../../../components/admin/ads/AdList'
import AdEditor from '../../../components/admin/ads/AdEditor'
import AnalyticsDashboard from '../../../components/admin/ads/AnalyticsDashboard'

export default function AdsAdminPage() {
  const supabase = useSupabaseClient()
  const [selectedAd, setSelectedAd] = useState(null)
  const [view, setView] = useState('list') // 'list', 'edit', 'analytics'

  const handleSave = async (adData) => {
    const { data, error } = await supabase
      .from('ads')
      .upsert({
        ...adData,
        updated_at: new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('Error saving ad:', error)
      return false
    }
    setSelectedAd(data[0])
    setView('list')
    return true
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Ad Management</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setSelectedAd(null)
                setView('edit')
              }}
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              Create New Ad
            </button>
            <button
              onClick={() => setView('analytics')}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              View Analytics
            </button>
          </div>
        </div>

        {view === 'list' && (
          <AdList 
            onSelect={(ad) => {
              setSelectedAd(ad)
              setView('edit')
            }}
          />
        )}

        {view === 'edit' && (
          <AdEditor
            ad={selectedAd}
            onSave={handleSave}
            onCancel={() => setView('list')}
          />
        )}

        {view === 'analytics' && (
          <AnalyticsDashboard onClose={() => setView('list')} />
        )}
      </div>
    </AdminLayout>
  )
}
