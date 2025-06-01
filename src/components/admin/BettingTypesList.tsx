import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { FiEdit2, FiPlus } from 'react-icons/fi'

export default function BettingTypesList({ onSelect, selectedId }) {
  const supabase = useSupabaseClient()
  const [bettingTypes, setBettingTypes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBettingTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('betting_types')
          .select('*')
          .order('name', { ascending: true })

        if (error) throw error
        setBettingTypes(data || [])
      } catch (error) {
        console.error('Error fetching betting types:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBettingTypes()
  }, [supabase])

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="space-y-2">
      <button
        onClick={() => onSelect(null)}
        className="flex items-center w-full p-3 text-left bg-gray-100 rounded-md hover:bg-gray-200"
      >
        <FiPlus className="mr-2" />
        Add New Betting Type
      </button>

      {bettingTypes.map((bettingType) => (
        <div
          key={bettingType.id}
          onClick={() => onSelect(bettingType)}
          className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
            selectedId === bettingType.id
              ? 'bg-blue-100'
              : 'hover:bg-gray-100'
          }`}
        >
          <div>
            <div className="font-medium">{bettingType.name}</div>
            <div className="text-sm text-gray-500">{bettingType.slug}</div>
          </div>
          <FiEdit2 className="text-gray-400" />
        </div>
      ))}
    </div>
  )
}
