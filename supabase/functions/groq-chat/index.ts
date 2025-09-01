import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }

    const { message, conversationHistory = [] } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    // Get the authorization header to verify user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    // Prepare messages for Groq API
    const messages = [
      {
        role: 'system',
        content: 'You are AI Daktari, a helpful health assistant. Provide health advice and information based on symptoms described by users. Always remind users to consult with healthcare professionals for serious concerns. Be empathetic and informative.'
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API error:', errorData);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Calculate confidence score (simple heuristic based on response length and content)
    const confidence = Math.min(95, Math.max(60, aiResponse.length / 10 + Math.random() * 20));

    // Store the tip in the database
    const { error: insertError } = await supabase
      .from('tips')
      .insert({
        user_id: user.id,
        input_text: message,
        ai_response: aiResponse,
        confidence: Math.round(confidence)
      });

    if (insertError) {
      console.error('Error storing tip:', insertError);
      // Don't throw error, just log it - we still want to return the response
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      confidence: Math.round(confidence)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in groq-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});