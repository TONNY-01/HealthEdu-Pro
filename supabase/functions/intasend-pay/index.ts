import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

console.log(`Function "intasend-pay" up and running!`);

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, email, planName } = await req.json()

    if (!amount || !email || !planName) {
      return new Response(JSON.stringify({ error: 'Missing required fields: amount, email, and planName' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const INTASEND_SECRET_KEY = Deno.env.get('INTASEND_SECRET_KEY');
    const VITE_INTASEND_PUBLISHABLE_KEY = Deno.env.get('VITE_INTASEND_PUBLISHABLE_KEY');

    if (!INTASEND_SECRET_KEY || !VITE_INTASEND_PUBLISHABLE_KEY) {
      console.error('Missing IntaSend API keys in environment variables');
      return new Response(JSON.stringify({ error: 'Server configuration error.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // IntaSend REST API expects Authorization: Bearer <SECRET_KEY> directly to protected endpoints.
    // No token exchange step is required for checkout creation.

    // Determine host dynamically from request origin (fallback to deployed URL)
    const origin = req.headers.get('Origin') || req.headers.get('origin');
    const hostUrl = origin && origin.startsWith('http') ? origin : 'https://neon-care-path.vercel.app';

    // Now create the checkout invoice
    const checkoutPayload = {
      public_key: VITE_INTASEND_PUBLISHABLE_KEY,
      currency: 'KES', // Or your desired currency
      email: email,
      amount: amount,
      // Let IntaSend choose available methods on checkout page
      host: hostUrl, // Use the calling app's origin when available
      redirect_url: `${hostUrl}/payments/complete`,
      api_ref: `upgrade-${planName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`
    };

    const checkoutResponse = await fetch('https://payment.intasend.com/api/v1/checkout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INTASEND_SECRET_KEY}`,
        'X-IntaSend-Public-Key': VITE_INTASEND_PUBLISHABLE_KEY
      },
      body: JSON.stringify(checkoutPayload)
    });

    if (!checkoutResponse.ok) {
      const errorBody = await checkoutResponse.text();
      console.error('IntaSend Checkout Error:', errorBody);
      return new Response(
        JSON.stringify({ error: 'Failed to create IntaSend checkout session', details: errorBody }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: checkoutResponse.status }
      );
    }

    const checkoutData = await checkoutResponse.json();

    return new Response(JSON.stringify({ url: checkoutData.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
