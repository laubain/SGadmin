import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { FiEdit2, FiPlus } from 'react-icons/fi'

export default function SportsManagerList({ onSelect, selectedId }) {
  const supabase = useSupabaseClient()
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const { data, error } = await supabase
          .from('sports')
          .select('*')
          .order('name', { ascending: true })

        if (error) throw error
        setSports(data || [])
      } catch (error) {
        console.error('Error fetching sports:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSports()
  }, [supabase])

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="space-y-2">
      <button
        onClick={() => onSelect(null)}
        className="flex items-center w-full p-3 text-left bg-gray-100 rounded-md hover:bg-gray-200"
      >
        <FiPlus className="mr-2" />
        Add New Sport
      </button>

      {sports.map((sport) => (
        <div
          key={sport.id}
          onClick={() => onSelect(sport)}
          className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
            selectedId === sport.id
              ? 'bg-blue-100'
              : 'hover:bg-gray-100'
          }`}
        >
          <div>
            <div className="font-medium">{sport.name}</div>
            <div className="text-sm text-gray-500">{sport.slug}</div>
          </div>
          <FiEdit2 className="text-gray-400" />
        </div>
      ))}
    </div>
  )
}
