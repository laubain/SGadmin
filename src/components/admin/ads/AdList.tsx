import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { FiEdit2, FiEye, FiEyeOff } from 'react-icons/fi'

export default function AdList({ onSelect }) {
  const supabase = useSupabaseClient()
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAds = async () => {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching ads:', error)
      } else {
        setAds(data)
      }
      setLoading(false)
    }

    fetchAds()
  }, [supabase])

  const toggleActive = async (adId, currentStatus) => {
    const { error } = await supabase
      .from('ads')
      .update({ is_active: !currentStatus })
      .eq('id', adId)

    if (!error) {
      setAds(ads.map(ad => 
        ad.id === adId ? { ...ad, is_active: !currentStatus } : ad
      ))
    }
  }

  if (loading) return <div className="text-center py-8">Loading ads...</div>

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {ads.map((ad) => (
            <tr key={ad.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium">{ad.title}</div>
                <div className="text-sm text-gray-500 truncate max-w-xs">{ad.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                {ad.ad_type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {ad.sport_category || 'All'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  ad.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {ad.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onSelect(ad)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Edit"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => toggleActive(ad.id, ad.is_active)}
                    className={ad.is_active ? "text-gray-600 hover:text-gray-900" : "text-green-600 hover:text-green-900"}
                    title={ad.is_active ? "Deactivate" : "Activate"}
                  >
                    {ad.is_active ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
