import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16'
})

serve(async (req) => {
  const { customer_id } = await req.json()

  const session = await stripe.billingPortal.sessions.create({
    customer: customer_id,
    return_url: Deno.env.get('SITE_URL')
  })

  return new Response(
    JSON.stringify({ url: session.url }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
