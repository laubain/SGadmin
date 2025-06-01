import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16'
}

serve(async (req) => {
  const { user_id } = await req.json()

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{
      price: Deno.env.get('STRIPE_PRICE_ID'),
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: `${Deno.env.get('SITE_URL')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${Deno.env.get('SITE_URL')}/pricing`,
    subscription_data: {
      trial_period_days: 7,
      metadata: { user_id }
    }
  })

  return new Response(
    JSON.stringify({ url: session.url }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
