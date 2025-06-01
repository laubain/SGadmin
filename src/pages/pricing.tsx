import { Button } from '../components/ui/Button'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { Loader2, Check, Zap } from 'lucide-react'
import SubscriptionStatus from '../components/billing/SubscriptionStatus'

const features = [
  'AI Model Access',
  'Bet Slip Scanner',
  'Advanced Analytics',
  'Premium Support',
  'Exclusive Content'
]

export default function Pricing() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    if (!user) return
    setLoading(true)
    
    try {
      const { data: session } = await supabase
        .functions
        .invoke('stripe-create-checkout-session', {
          body: { user_id: user.id }
        })

      if (session?.url) {
        window.location.href = session.url
      }
    } catch (error) {
      alert('Failed to start checkout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">SuperGenius Membership</h1>
        <p className="text-xl text-gray-600">
          Unlock premium features with our $49/month plan
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">SuperGenius Pro</h2>
              <p className="text-gray-600 mb-4">
                Everything you need to maximize your sports betting success
              </p>
              <div className="flex items-end">
                <span className="text-5xl font-bold">$49</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
              <p className="text-green-600 mt-2">7-day free trial</p>
            </div>

            {user ? (
              <div className="w-full sm:w-auto">
                <SubscriptionStatus />
              </div>
            ) : (
              <Button size="lg" className="w-full sm:w-auto">
                Sign Up to Get Started
              </Button>
            )}
          </div>

          <div className="mt-10">
            <ul className="space-y-4">
              {features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {user && (
            <div className="mt-10">
              <Button 
                size="lg" 
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Start 7-Day Free Trial
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
