import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { toast } from 'react-hot-toast'

export default function SportsManagerForm({ sport, onSave }) {
  const supabase = useSupabaseClient()
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon_url: '',
    status: true
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (sport) {
      setFormData({
        name: sport.name || '',
        slug: sport.slug || '',
        icon_url: sport.icon_url || '',
        status: sport.status || true
      })
    } else {
      setFormData({
        name: '',
        slug: '',
        icon_url: '',
        status: true
      })
    }
  }, [sport])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (sport) {
        const { data, error } = await supabase
          .from('sports')
          .update(formData)
          .eq('id', sport.id)
          .select()
          .single()

        if (error) throw error
        toast.success('Sport updated successfully')
        onSave(data)
      } else {
        const { data, error } = await supabase
          .from('sports')
          .insert(formData)
          .select()
          .single()

        if (error) throw error
        toast.success('Sport created successfully')
        onSave(data)
      }
    } catch (error) {
      toast.error(`Error saving sport: ${error.message}`)
      console.error('Error saving sport:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            Slug
          </label>
          <input
            type="text"
            name="slug"
            id="slug"
            value={formData.slug}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="icon_url" className="block text-sm font-medium text-gray-700">
            Icon URL
          </label>
          <input
            type="url"
            name="icon_url"
            id="icon_url"
            value={formData.icon_url}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://example.com/icon.png"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="status"
            id="status"
            checked={formData.status}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="status" className="ml-2 block text-sm text-gray-700">
            Active
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : sport ? 'Update Sport' : 'Create Sport'}
        </button>
      </div>
    </form>
  )
}
