import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useUserAgent } from 'next-useragent'

export async function trackImpression(adId, pageUrl, sportCategory) {
  const supabase = useSupabaseClient()
  const ua = useUserAgent(window.navigator.userAgent)
  
  await supabase
    .from('ad_impressions')
    .insert({
      ad_id: adId,
      page_url: pageUrl,
      sport_category: sportCategory,
      device_type: ua.isMobile ? 'mobile' : ua.isTablet ? 'tablet' : 'desktop'
    })
}

export async function trackClick(adId) {
  const supabase = useSupabaseClient()
  
  await supabase
    .from('ad_clicks')
    .insert({
      ad_id: adId
    })
}
