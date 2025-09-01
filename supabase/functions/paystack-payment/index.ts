import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';

console.log('Paystack payment function started');

interface PaymentRequest {
  email: string;
  amount: number;
  planName: string;
  reference: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) {
      throw new Error('Paystack secret key not configured');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { email, amount, planName, reference }: PaymentRequest = await req.json();

    if (!email || !amount || !planName) {
      throw new Error('Missing required fields: email, amount, or planName');
    }

    // Convert amount to kobo (Paystack uses kobo as the smallest currency unit)
    const amountInKobo = Math.round(amount * 100);

    // Initialize payment with Paystack
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${paystackSecretKey}`,
      },
      body: JSON.stringify({
        email,
        amount: amountInKobo,
        reference: reference || `ref-${Date.now()}`,
        metadata: {
          planName,
          custom_fields: [
            {
              display_name: 'Plan Name',
              variable_name: 'plan_name',
              value: planName,
            },
          ],
        },
        callback_url: `${Deno.env.get('SITE_URL') || 'http://localhost:3000'}/payment/callback`,
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok) {
      console.error('Paystack error:', paystackData);
      throw new Error(paystackData.message || 'Failed to initialize payment');
    }

    return new Response(
      JSON.stringify({
        success: true,
        authorizationUrl: paystackData.data.authorization_url,
        accessCode: paystackData.data.access_code,
        reference: paystackData.data.reference,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in paystack-payment function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to process payment' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
