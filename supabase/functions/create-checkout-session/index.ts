import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { CreateCheckoutSessionRequest, CreateCheckoutSessionResponse } from "../_shared/paymentTypes.ts";
import { getPlanDetails } from "../_shared/subscriptionMapper.ts";
import { iyzicoClient } from "../_shared/iyzicoClient.ts";

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

    // Assert sandbox config is present (does not expose values)
    iyzicoClient.assertIyzicoSandboxConfig();

    // TODO: Validate authenticated user via Supabase auth header
    
    const body: CreateCheckoutSessionRequest = await req.json();
    const { tenantId, planId, successUrl, cancelUrl } = body;

    if (!tenantId || !planId) {
      throw new Error('Missing required fields: tenantId, planId');
    }

    const plan = getPlanDetails(planId);
    
    if (!plan) {
      throw new Error(`Invalid planId: ${planId}`);
    }

    const conversationId = `randapp_${tenantId}_${Date.now()}`;

    console.log(`[iyzico-sandbox] Creating checkout session for tenant: ${tenantId}, plan: ${plan.name}`);

    // Create session using sandbox wrapper
    const sessionDetail = await iyzicoClient.createSubscriptionCheckoutSession({
      paymentPlanReferenceCode: plan.iyzicoPricingPlanReferenceCode,
      customer: {
        id: tenantId,
        // email, name, etc. from authenticated user data if needed
      },
      callbackUrl: successUrl,
      conversationId: conversationId
    });

    // TODO: Insert or prepare a pending subscription/session record into DB
    // e.g. await supabaseAdmin.from('subscription_sessions').insert(...)

    const responseData: CreateCheckoutSessionResponse & { conversationId: string } = {
      checkoutUrl: sessionDetail.payWithIyzicoPageUrl,
      provider: "iyzico",
      sessionId: sessionDetail.token,
      conversationId: conversationId
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: error.message.includes('missing') ? 500 : 400,
    });
  }
});
