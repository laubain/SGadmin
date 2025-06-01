import { useState, useEffect } from 'react'
import { FiSave, FiX } from 'react-icons/fi'

const sportOptions = [
  'NFL', 'NBA', 'MLB', 'NHL', 'Soccer', 
  'Tennis', 'Golf', 'MMA', 'Boxing', 'Racing'
]

export default function AdEditor({ ad, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    text_content: '',
    target_url: '',
    sport_category: '',
    ad_type: 'banner',
    is_active: true,
    priority: 0,
    start_date: new Date().toISOString(),
    end_date: ''
  })

  useEffect(() => {
    if (ad) {
      setFormData({
        title: ad.title || '',
        description: ad.description || '',
        image_url: ad.image_url || '',
        text_content: ad.text_content || '',
        target_url: ad.target_url || '',
        sport_category: ad.sport_category || '',
        ad_type: ad.ad_type || 'banner',
        is_active: ad.is_active !== undefined ? ad.is_active : true,
        priority: ad.priority || 0,
        start_date: ad.start_date || new Date().toISOString(),
        end_date: ad.end_date || ''
      })
    }
  }, [ad])

  const handleSubmit = (e) => {
    e.preventDefault()
    const dataToSave = {
      ...formData,
      end_date: formData.end_date || null
    }
    onSave(dataToSave)
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad Type*</label>
              <select
                value={formData.ad_type}
                onChange={(e) => setFormData({...formData, ad_type: e.target.value})}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="banner">Banner</option>
                <option value="promo">Promo</option>
                <option value="sponsored">Sponsored</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sport Category</label>
              <select
                value={formData.sport_category}
                onChange={(e) => setFormData({...formData, sport_category: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Sports</option>
                {sportOptions.map((sport) => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target URL*</label>
              <input
                type="url"
                value={formData.target_url}
                onChange={(e) => setFormData({...formData, target_url: e.target.value})}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border rounded-md h-20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              className="w-full p-2 border rounded-md"
              placeholder="https://example.com/image.jpg"
            />
            {formData.image_url && (
              <div className="mt-2">
                <img 
                  src={formData.image_url} 
                  alt="Preview" 
                  className="max-h-40 rounded border"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {formData.ad_type !== 'banner' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text Content</label>
              <textarea
                value={formData.text_content}
                onChange={(e) => setFormData({...formData, text_content: e.target.value})}
                className="w-full p-2 border rounded-md h-32"
                placeholder="Enter ad copy for text-based ads"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="datetime-local"
                value={formData.start_date.substring(0, 16)}
                onChange={(e) => setFormData({...formData, start_date: new Date(e.target.value).toISOString()})}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date (optional)</label>
              <input
                type="datetime-local"
                value={formData.end_date ? formData.end_date.substring(0, 16) : ''}
                onChange={(e) => setFormData({...formData, end_date: e.target.value ? new Date(e.target.value).toISOString() : ''})}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FiX className="inline mr-2" /> Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark"
          >
            <FiSave className="inline mr-2" /> Save Ad
          </button>
        </div>
      </form>
    </div>
  )
}
