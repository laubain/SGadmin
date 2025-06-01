import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface ApiKey {
  id: string
  provider: string
}

export function ApiKeySelector({
  selectedKey,
  onSelect
}: {
  selectedKey: string
  onSelect: (keyId: string) => void
}) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApiKeys = async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, provider')
        .eq('is_active', true)

      if (error) {
        console.error('Error fetching API keys:', error)
        return
      }

      setApiKeys(data || [])
      setLoading(false)
    }

    fetchApiKeys()
  }, [])

  if (loading) return <div>Loading API keys...</div>

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select AI Provider
      </label>
      <select
        value={selectedKey}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full p-2 border rounded-md"
      >
        <option value="">Select an API key</option>
        {apiKeys.map((key) => (
          <option key={key.id} value={key.id}>
            {key.provider}
          </option>
        ))}
      </select>
    </div>
  )
}
