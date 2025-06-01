import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

export default function SubscriptionGate({ children }) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status, trial_end')
        .eq('user_id', user.id)
        .single()

      // Grant access if:
      // 1. Active subscription
      // 2. In trial period
      const access = subscription?.status === 'active' || 
        (subscription?.status === 'trialing' && new Date(subscription.trial_end) > new Date())

      setHasAccess(access)
      setLoading(false)
    }

    checkAccess()
  }, [user, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!hasAccess) {
    return <Navigate to="/pricing" replace />
  }

  return children
}
