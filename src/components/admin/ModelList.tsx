import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { FiPlus } from 'react-icons/fi'

export default function ModelList({ onSelect, selectedId }) {
  const supabase = useSupabaseClient()
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModels = async () => {
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching models:', error)
      } else {
        setModels(data)
        if (data.length > 0 && !selectedId) {
          onSelect(data[0])
        }
      }
      setLoading(false)
    }

    fetchModels()
  }, [supabase, selectedId, onSelect])

  const handleCreateNew = () => {
    onSelect(null)
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium">AI Models</h3>
        <button
          onClick={handleCreateNew}
          className="p-1 rounded-md hover:bg-gray-100"
          title="Create new model"
        >
          <FiPlus />
        </button>
      </div>

      {loading ? (
        <div className="p-4 text-center">Loading...</div>
      ) : (
        <ul className="divide-y">
          {models.map((model) => (
            <li
              key={model.id}
              onClick={() => onSelect(model)}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedId === model.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between">
                <h4 className="font-medium">{model.name}</h4>
                {model.is_featured && (
                  <span className="text-yellow-500">★</span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">
                {model.description}
              </p>
              <div className="flex mt-2 space-x-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    model.visibility === 'public'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {model.visibility}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(model.updated_at).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
