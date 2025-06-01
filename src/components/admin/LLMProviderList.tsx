import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { FiPlus } from 'react-icons/fi'

export default function LLMProviderList({ onSelect, selectedId }) {
  const supabase = useSupabaseClient()
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProviders = async () => {
      const { data, error } = await supabase
        .from('llm_providers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching providers:', error)
      } else {
        setProviders(data)
        if (data.length > 0 && !selectedId) {
          onSelect(data[0])
        }
      }
      setLoading(false)
    }

    fetchProviders()
  }, [supabase, selectedId, onSelect])

  const handleCreateNew = () => {
    onSelect(null)
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium">LLM Providers</h3>
        <button
          onClick={handleCreateNew}
          className="p-1 rounded-md hover:bg-gray-100"
          title="Create new provider"
        >
          <FiPlus />
        </button>
      </div>

      {loading ? (
        <div className="p-4 text-center">Loading...</div>
      ) : (
        <ul className="divide-y">
          {providers.map((provider) => (
            <li
              key={provider.id}
              onClick={() => onSelect(provider)}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedId === provider.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between">
                <h4 className="font-medium">{provider.name}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  provider.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {provider.status ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-500">{provider.model_label}</p>
              <div className="text-xs text-gray-500 mt-2">
                {new Date(provider.created_at).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
