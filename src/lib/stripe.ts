import { supabase } from './supabase'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
})

export async function createCheckoutSession(userId: string) {
  // Create Stripe customer if doesn't exist
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single()

  let customerId = subscription?.stripe_customer_id

  if (!customerId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single()

    const customer = await stripe.customers.create({
      email: profile?.email,
      name: profile?.full_name,
      metadata: { user_id: userId }
    })

    customerId = customer.id

    await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_customer_id: customerId
      })
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{
      price: process.env.STRIPE_PRICE_ID,
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${window.location.origin}/pricing`,
    subscription_data: {
      trial_period_days: 7,
      metadata: { user_id: userId }
    }
  })

  return session
}
