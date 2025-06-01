import { Badge } from '../ui/Badge'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { Loader2, Check, X, Clock } from 'lucide-react'
import BillingPortal from './BillingPortal'

const statusMap = {
  active: { text: 'Active', color: 'green', icon: Check },
  trialing: { text: 'Trial', color: 'blue', icon: Clock },
  canceled: { text: 'Canceled', color: 'gray', icon: X },
  past_due: { text: 'Past Due', color: 'red', icon: X },
  unpaid: { text: 'Unpaid', color: 'red', icon: X }
}

export default function SubscriptionStatus() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!error && data) {
        setSubscription(data)
      }
      setLoading(false)
    }

    fetchSubscription()
  }, [user, supabase])

  if (loading) return <div className="animate-pulse h-8 w-24 bg-gray-200 rounded" />

  if (!subscription) {
    return (
      <div className="space-y-2">
        <p className="text-sm">No active subscription</p>
        <BillingPortal />
      </div>
    )
  }

  const statusInfo = statusMap[subscription.status] || statusMap.canceled
  const StatusIcon = statusInfo.icon

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Badge variant={statusInfo.color}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {statusInfo.text}
        </Badge>
        {subscription.status === 'trialing' && (
          <span className="text-sm text-gray-600">
            {Math.ceil((new Date(subscription.trial_end) - new Date()) / (1000 * 60 * 60 * 24))} days left
          </span>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium">SuperGenius Membership</p>
        <p className="text-sm text-gray-600">${subscription.amount / 100}/month</p>
      </div>

      <BillingPortal />
    </div>
  )
}
