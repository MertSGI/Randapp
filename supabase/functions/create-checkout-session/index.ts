import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { CreateCheckoutSessionRequest, CreateCheckoutSessionResponse } from "../_shared/paymentTypes.ts";
import { getPlanDetails } from "../_shared/subscriptionMapper.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    // TODO: Validate authenticated user via Supabase auth header
    // const authHeader = req.headers.get('Authorization');
    
    const body: CreateCheckoutSessionRequest = await req.json();
    const { tenantId, planId, successUrl, cancelUrl } = body;

    if (!tenantId || !planId) {
      throw new Error('Missing required fields: tenantId, planId');
    }

    const plan = getPlanDetails(planId);

    // TODO: Load IYZICO_API_KEY and IYZICO_SECRET_KEY from Deno.env.get(...)
    // const apiKey = Deno.env.get('IYZICO_API_KEY');
    // const secretKey = Deno.env.get('IYZICO_SECRET_KEY');

    // MOCK RESPONSE
    // Note: To go live, this should call iyzico API to create a Subscription Checkout Form or Payment Link
    console.log(`[iyzico-mock] Creating checkout session for tenant: ${tenantId}, plan: ${plan.name}`);

    const responseData: CreateCheckoutSessionResponse = {
      checkoutUrl: `https://checkout.mock/randapp?tenantId=${tenantId}&planId=${planId}&provider=iyzico`,
      provider: "iyzico",
      sessionId: `mock_session_${Date.now()}`
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
