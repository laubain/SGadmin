import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { FiEdit2, FiPlus } from 'react-icons/fi'

export default function AIModelList({ onSelect, selectedId }) {
  const supabase = useSupabaseClient()
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const { data, error } = await supabase
          .from('ai_models')
          .select(`
            id,
            name,
            description,
            llm_providers(name),
            sports(name),
            betting_types(name)
          `)
          .order('name', { ascending: true })

        if (error) throw error
        setModels(data || [])
      } catch (error) {
        console.error('Error fetching AI models:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [supabase])

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="space-y-2">
      <button
        onClick={() => onSelect(null)}
        className="flex items-center w-full p-3 text-left bg-gray-100 rounded-md hover:bg-gray-200"
      >
        <FiPlus className="mr-2" />
        Add New AI Model
      </button>

      {models.map((model) => (
        <div
          key={model.id}
          onClick={() => onSelect(model)}
          className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
            selectedId === model.id
              ? 'bg-blue-100'
              : 'hover:bg-gray-100'
          }`}
        >
          <div>
            <div className="font-medium">{model.name}</div>
            <div className="text-sm text-gray-500">
              {model.llm_providers?.name} • {model.sports?.name} • {model.betting_types?.name}
            </div>
          </div>
          <FiEdit2 className="text-gray-400" />
        </div>
      ))}
    </div>
  )
}
