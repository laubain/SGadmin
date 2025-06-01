import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { toast } from 'react-hot-toast'
import dynamic from 'next/dynamic'

const CodeEditor = dynamic(
  () => import('@uiw/react-textarea-code-editor').then((mod) => mod.default),
  { ssr: false }
)

export default function BettingTypesForm({ bettingType, onSave }) {
  const supabase = useSupabaseClient()
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    input_schema: '{}',
    default_prompt_template: '',
    output_type: '',
    category: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (bettingType) {
      setFormData({
        name: bettingType.name || '',
        slug: bettingType.slug || '',
        description: bettingType.description || '',
        input_schema: JSON.stringify(bettingType.input_schema, null, 2) || '{}',
        default_prompt_template: bettingType.default_prompt_template || '',
        output_type: bettingType.output_type || '',
        category: bettingType.category || ''
      })
    }
  }, [bettingType])

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
        input_schema: JSON.parse(formData.input_schema)
      }

      if (bettingType) {
        const { data, error } = await supabase
          .from('betting_types')
          .update(dataToSave)
          .eq('id', bettingType.id)
          .select()
          .single()

        if (error) throw error
        toast.success('Betting type updated successfully')
        onSave(data)
      } else {
        const { data, error } = await supabase
          .from('betting_types')
          .insert(dataToSave)
          .select()
          .single()

        if (error) throw error
        toast.success('Betting type created successfully')
        onSave(data)
      }
    } catch (error) {
      toast.error(`Error saving betting type: ${error.message}`)
      console.error('Error saving betting type:', error)
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="input_schema" className="block text-sm font-medium text-gray-700">
            Input Schema (JSON)
          </label>
          <div className="mt-1 rounded-md border border-gray-300">
            <CodeEditor
              name="input_schema"
              value={formData.input_schema}
              language="json"
              onChange={(e) => handleChange({ target: { name: 'input_schema', value: e.target.value } })}
              padding={15}
              style={{
                fontSize: 12,
                backgroundColor: "#f5f5f5",
                fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
              }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="default_prompt_template" className="block text-sm font-medium text-gray-700">
            Default Prompt Template (Handlebars)
          </label>
          <div className="mt-1 rounded-md border border-gray-300">
            <CodeEditor
              name="default_prompt_template"
              value={formData.default_prompt_template}
              language="handlebars"
              onChange={(e) => handleChange({ target: { name: 'default_prompt_template', value: e.target.value } })}
              padding={15}
              style={{
                fontSize: 12,
                backgroundColor: "#f5f5f5",
                fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
              }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="output_type" className="block text-sm font-medium text-gray-700">
            Output Type
          </label>
          <input
            type="text"
            name="output_type"
            id="output_type"
            value={formData.output_type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : bettingType ? 'Update Betting Type' : 'Create Betting Type'}
        </button>
      </div>
    </form>
  )
}
