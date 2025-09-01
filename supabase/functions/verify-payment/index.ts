import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';

console.log('Verify Payment function started');

interface VerifyRequest {
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

    const { reference }: VerifyRequest = await req.json();

    if (!reference) {
      throw new Error('Missing required field: reference');
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${paystackSecretKey}`,
        },
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok) {
      console.error('Paystack verification error:', paystackData);
      throw new Error(paystackData.message || 'Failed to verify payment');
    }

    if (paystackData.data.status !== 'success') {
      throw new Error('Payment was not successful');
    }

    // Extract metadata from Paystack response
    const { metadata } = paystackData.data;
    const userId = metadata?.custom_fields?.find(
      (field: any) => field.variable_name === 'user_id'
    )?.value;

    if (!userId) {
      throw new Error('User ID not found in payment metadata');
    }

    // Update user's premium status in the database
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ is_premium: true })
      .eq('id', userId);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error('Failed to update user profile');
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: 'success',
        userId,
        reference: paystackData.data.reference,
        amount: paystackData.data.amount / 100, // Convert back from kobo
        paidAt: paystackData.data.paid_at,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in verify-payment function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        status: 'error',
        error: error.message || 'Failed to verify payment' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
