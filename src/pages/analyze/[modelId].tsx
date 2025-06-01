import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { FormBuilder } from '../../components/analyze/FormBuilder'
import { ModelResponse } from '../../components/analyze/ModelResponse'
import { ApiKeySelector } from '../../components/analyze/ApiKeySelector'

interface AIModel {
  id: string
  title: string
  description: string
  input_schema: {
    fields: Array<{
      name: string
      type: string
      label: string
      required: boolean
      options?: string[]
    }>
  }
  prompt_template: string
}

export default function AnalyzePage() {
  const { modelId } = useParams()
  const [model, setModel] = useState<AIModel | null>(null)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedApiKey, setSelectedApiKey] = useState('')

  useEffect(() => {
    const fetchModel = async () => {
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .eq('id', modelId)
        .single()

      if (error) {
        console.error('Error fetching model:', error)
        return
      }

      setModel(data)
    }

    fetchModel()
  }, [modelId])

  const handleSubmit = async () => {
    if (!model) return

    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('run-ai-model', {
        body: JSON.stringify({
          modelId: model.id,
          inputs: formValues,
          apiKeyId: selectedApiKey
        })
      })

      if (error) throw error
      setResponse(data)
    } catch (error) {
      console.error('Error running model:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!model) return <div>Loading model...</div>

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">{model.title}</h1>
        <p className="text-gray-600 mb-6">{model.description}</p>
        
        <ApiKeySelector 
          selectedKey={selectedApiKey}
          onSelect={setSelectedApiKey}
        />

        <FormBuilder
          schema={model.input_schema}
          values={formValues}
          onChange={setFormValues}
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !selectedApiKey}
          className="mt-4 w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-secondary disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Run Analysis'}
        </button>
      </div>

      {response && (
        <ModelResponse response={response} />
      )}
    </div>
  )
}
