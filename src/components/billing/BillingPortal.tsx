import { Button } from '../ui/Button'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function BillingPortal() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [loading, setLoading] = useState(false)

  const handlePortal = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (error || !data?.stripe_customer_id) {
      alert('Unable to access billing portal')
      setLoading(false)
      return
    }

    const { data: session, error: sessionError } = await supabase
      .functions
      .invoke('stripe-create-portal-session', {
        body: { customer_id: data.stripe_customer_id }
      })

    if (sessionError || !session?.url) {
      alert('Failed to create billing session')
      setLoading(false)
      return
    }

    window.location.href = session.url
    setLoading(false)
  }

  return (
    <Button onClick={handlePortal} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        'Manage Subscription'
      )}
    </Button>
  )
}
