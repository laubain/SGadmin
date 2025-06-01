import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { toast } from 'react-hot-toast'
import CodeEditor from '../../components/CodeEditor'

export default function LLMProviderForm({ provider, onSave }) {
  const supabase = useSupabaseClient()
  const [formData, setFormData] = useState({
    name: '',
    model_name: '',
    api_key: '',
    api_url: '',
    default_params: {},
    status: true
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (provider) {
      setFormData({
        name: provider.name || '',
        model_name: provider.model_name || '',
        api_key: provider.api_key || '',
        api_url: provider.api_url || '',
        default_params: provider.default_params || {},
        status: provider.status || true
      })
    } else {
      setFormData({
        name: '',
        model_name: '',
        api_key: '',
        api_url: '',
        default_params: {},
        status: true
      })
    }
  }, [provider])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleParamsChange = (value) => {
    try {
      const parsed = JSON.parse(value)
      setFormData(prev => ({
        ...prev,
        default_params: parsed
      }))
    } catch (e) {
      console.error('Invalid JSON', e)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (provider) {
        const { data, error } = await supabase
          .from('llm_providers')
          .update(formData)
          .eq('id', provider.id)
          .select()
          .single()

        if (error) throw error
        toast.success('Provider updated successfully')
        onSave(data)
      } else {
        const { data, error } = await supabase
          .from('llm_providers')
          .insert(formData)
          .select()
          .single()

        if (error) throw error
        toast.success('Provider created successfully')
        onSave(data)
      }
    } catch (error) {
      toast.error(`Error saving provider: ${error.message}`)
      console.error('Error saving provider:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Provider Name
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
          <label htmlFor="model_name" className="block text-sm font-medium text-gray-700">
            Model Name
          </label>
          <input
            type="text"
            name="model_name"
            id="model_name"
            value={formData.model_name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="api_key" className="block text-sm font-medium text-gray-700">
            API Key
          </label>
          <input
            type="password"
            name="api_key"
            id="api_key"
            value={formData.api_key}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="api_url" className="block text-sm font-medium text-gray-700">
            API URL (optional)
          </label>
          <input
            type="url"
            name="api_url"
            id="api_url"
            value={formData.api_url}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://api.example.com/v1"
          />
        </div>

        <div>
          <label htmlFor="default_params" className="block text-sm font-medium text-gray-700">
            Default Parameters (JSON)
          </label>
          <CodeEditor
            value={JSON.stringify(formData.default_params, null, 2)}
            onChange={handleParamsChange}
            language="json"
            height="200px"
            className="mt-1 rounded-md border border-gray-300"
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
          {loading ? 'Saving...' : provider ? 'Update Provider' : 'Create Provider'}
        </button>
      </div>
    </form>
  )
}
