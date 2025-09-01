// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Send Booking Email function started")

interface EmailPayload {
  to: string
  subject: string
  html: string
}

async function sendEmail(payload: EmailPayload, resendApiKey: string) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Neon Care <no-reply@neoncare.ke>',
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error('Resend API error:', data)
      throw new Error(JSON.stringify(data))
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the Resend API key from environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable not set')
    }

    // Parse the request body
    const { to, subject, html } = await req.json()

    if (!to || !subject || !html) {
      throw new Error('Missing required fields: to, subject, or html')
    }

    // Send the email
    const { data, error } = await sendEmail({ to, subject, html }, resendApiKey)
    
    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in send-booking-email function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send email' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
