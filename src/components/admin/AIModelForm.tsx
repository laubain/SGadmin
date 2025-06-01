import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { toast } from 'react-hot-toast'
import dynamic from 'next/dynamic'

const CodeEditor = dynamic(
  () => import('@uiw/react-textarea-code-editor').then((mod) => mod.default),
  { ssr: false }
)

export default function AIModelForm({ model, onSave }) {
  const supabase = useSupabaseClient()
  const [formData, setFormData] = useState({
    llm_provider_id: '',
    name: '',
    description: '',
    sport_id: '',
    betting_type_id: '',
    prompt_template: '',
    settings: '{}'
  })
  const [loading, setLoading] = useState(false)
  const [providers, setProviders] = useState([])
  const [sports, setSports] = useState([])
  const [bettingTypes, setBettingTypes] = useState([])

  useEffect(() => {
    const fetchOptions = async () => {
      const [
        { data: providersData },
        { data: sportsData },
        { data: bettingTypesData }
      ] = await Promise.all([
        supabase.from('llm_providers').select('id, name').order('name'),
        supabase.from('sports').select('id, name').order('name'),
        supabase.from('betting_types').select('id, name').order('name')
      ])
      
      setProviders(providersData || [])
      setSports(sportsData || [])
      setBettingTypes(bettingTypesData || [])
    }

    fetchOptions()
  }, [supabase])

  useEffect(() => {
    if (model) {
      setFormData({
        llm_provider_id: model.llm_provider_id || '',
        name: model.name || '',
        description: model.description || '',
        sport_id: model.sport_id || '',
        betting_type_id: model.betting_type_id || '',
        prompt_template: model.prompt_template || '',
        settings: JSON.stringify(model.settings || {}, null, 2) || '{}'
      })
    }
  }, [model])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSave = {
        ...formData,
        settings: JSON.parse(formData.settings)
      }

      if (model) {
        const { data, error } = await supabase
          .from('ai_models')
          .update(dataToSave)
          .eq('id', model.id)
          .select()
          .single()

        if (error) throw error
        toast.success(`AI model "${data.name}" has been updated`)
        onSave(data)
      } else {
        const { data, error } = await supabase
          .from('ai_models')
          .insert(dataToSave)
          .select()
          .single()

        if (error) throw error
        toast.success(`AI model "${data.name}" has been created`)
        onSave(data)
      }
    } catch (error) {
      toast.error(`Error saving AI model: ${error.message}`)
      console.error('Error saving AI model:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="llm_provider_id" className="block text-sm font-medium text-gray-700">
            LLM Provider *
          </label>
          <select
            name="llm_provider_id"
            id="llm_provider_id"
            value={formData.llm_provider_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          >
            <option value="">Select a provider</option>
            {providers.map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Model Name *
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Parlay Evaluator"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the model's purpose and strengths"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sport_id" className="block text-sm font-medium text-gray-700">
              Sport *
            </label>
            <select
              name="sport_id"
              id="sport_id"
              value={formData.sport_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            >
              <option value="">Select a sport</option>
              {sports.map(sport => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="betting_type_id" className="block text-sm font-medium text-gray-700">
              Betting Type *
            </label>
            <select
              name="betting_type_id"
              id="betting_type_id"
              value={formData.betting_type_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            >
              <option value="">Select a betting type</option>
              {bettingTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="prompt_template" className="block text-sm font-medium text-gray-700">
            Prompt Template *
          </label>
          <textarea
            name="prompt_template"
            id="prompt_template"
            rows={6}
            value={formData.prompt_template}
            onChange={handleChange}
            placeholder="Enter your prompt template using Handlebars or raw text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="settings" className="block text-sm font-medium text-gray-700">
            Model Settings (JSON)
          </label>
          <div className="mt-1 rounded-md border border-gray-300">
            <CodeEditor
              name="settings"
              value={formData.settings}
              language="json"
              onChange={(e) => handleChange({ target: { name: 'settings', value: e.target.value } })}
              padding={15}
              placeholder='{ "temperature": 0.7, "top_p": 1 }'
              style={{
                fontSize: 12,
                backgroundColor: "#f5f5f5",
                fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : model ? 'Update AI Model' : 'Create AI Model'}
        </button>
      </div>
    </form>
  )
}
