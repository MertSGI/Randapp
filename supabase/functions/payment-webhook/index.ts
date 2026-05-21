import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { iyzicoClient } from "../_shared/iyzicoClient.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    // Read raw payload for signature verification
    const rawBody = await req.text();
    
    // Verify signature using shared client
    const isValidSignature = iyzicoClient.verifyIyzicoWebhookSignature(rawBody, req.headers);
    if (!isValidSignature) {
      throw new Error('Invalid signature');
    }

    // Parse verified payload
    const payload = JSON.parse(rawBody);
    console.log(`[iyzico-webhook] Received webhook payload:`, payload);

    // Map provider event to internal status
    const mappedStatus = iyzicoClient.mapIyzicoWebhookToInternalStatus(payload);
    
    // TODO: Require SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to init admin client
    // const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    // TODO: Update subscriptions table securely
    // await supabaseAdmin.from('subscriptions').update({ status: mappedStatus }).eq('provider_reference', payload.referenceCode);

    // TODO: Insert payment record
    // await supabaseAdmin.from('payments').insert({ ... })

    // TODO: Trigger provisioning workflow after first verified successful subscription
    // If newly active, call: await supabaseAdmin.from('tenants').update({ provisioning_status: 'onboarding_required' })...

    return new Response(JSON.stringify({ received: true, status: mappedStatus }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error("Webhook processing error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
