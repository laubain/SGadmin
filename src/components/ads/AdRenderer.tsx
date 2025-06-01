import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { trackClick, trackImpression } from '../../lib/analytics'

export default function AdRenderer({ position = 'sidebar', sport }) {
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [ad, setAd] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAd = async () => {
      let query = supabase
        .from('ads')
        .select('*')
        .eq('is_active', true)
        .gte('start_date', new Date().toISOString())
        .or(`end_date.is.null,end_date.gt.${new Date().toISOString()}`)
        .order('priority', { ascending: false })

      if (sport) {
        query = query.or(`sport_category.eq.${sport},sport_category.is.null`)
      }

      const { data, error } = await query.limit(1)

      if (!error && data?.length > 0) {
        setAd(data[0])
        trackImpression(data[0].id, router.pathname, sport)
      }
      setLoading(false)
    }

    fetchAd()
  }, [supabase, sport, router.pathname])

  const handleClick = () => {
    if (ad) {
      trackClick(ad.id)
      window.open(ad.target_url, '_blank', 'noopener,noreferrer')
    }
  }

  if (loading) return <div className="bg-gray-100 rounded-lg animate-pulse h-32" />

  if (!ad) return null

  return (
    <div 
      className={`ad-container ${position} bg-white rounded-lg shadow-sm overflow-hidden border`}
      onClick={handleClick}
    >
      {ad.image_url ? (
        <img 
          src={ad.image_url} 
          alt={ad.title} 
          className="w-full h-full object-cover cursor-pointer"
        />
      ) : (
        <div className="p-4 cursor-pointer">
          <h3 className="font-bold text-lg">{ad.title}</h3>
          <p className="text-sm text-gray-600">{ad.text_content}</p>
        </div>
      )}
    </div>
  )
}
