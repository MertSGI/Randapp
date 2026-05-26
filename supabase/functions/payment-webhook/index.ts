import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { iyzicoClient } from "../_shared/iyzicoClient.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

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
      throw new Error('Invalid webhook signature');
    }

    // Parse verified payload
    const payload = JSON.parse(rawBody);
    console.log(`[iyzico-webhook] Received webhook payload:`, payload);

    // Map provider event to internal status
    const mappedStatus = iyzicoClient.mapIyzicoWebhookToInternalStatus(payload);
    
    // Init Supabase admin client using Edge Function injected environment secrets
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.log("[iyzico-webhook] Supabase admin config missing. Aborting DB sync.");
      return new Response(JSON.stringify({
        mode: 'sandbox_not_configured',
        message: 'Webhook received but Supabase service role is missing. Real sync skipped.',
        received: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Safe diagnostic true
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    const subscriptionReferenceCode = payload.referenceCode || payload.subscriptionReferenceCode;
    const conversationId = payload.conversationId; // We used this for linking maybe?
    
    // Let's assume payload returns customerReferenceCode as well, mapping to tenantId
    const customerReferenceCode = payload.customerReferenceCode || payload.customer?.referenceCode;
    
    // Extract what we need. For our mock, we can rely on finding subscription by provider_subscription_id 
    // or by checking the pending conversation ID.
    // If we only have ReferenceCode, we search the subscriptions table:
    let tenantIdStr = customerReferenceCode || payload.tenantId; 

    // Update subscriptions table securely
    if (subscriptionReferenceCode) {
        const { data: subData, error: subError } = await supabaseAdmin.from('subscriptions')
          .update({ 
            status: mappedStatus,
            provider_subscription_id: subscriptionReferenceCode,
            updated_at: new Date().toISOString()
          })
          .eq('provider_subscription_id', subscriptionReferenceCode)
          .select('id, tenant_id')
          .single();

        if (!subError && subData) {
            tenantIdStr = subData.tenant_id;
            
            // Insert payment record
            await supabaseAdmin.from('payments').insert({
              tenant_id: tenantIdStr,
              subscription_id: subData.id,
              provider: 'iyzico',
              provider_event_id: payload.token || 'webhook_event',
              amount: payload.price || 0,
              currency: payload.currencyCode || 'TRY',
              status: mappedStatus === 'active' ? 'paid' : 'pending',
              metadata: payload,
              paid_at: mappedStatus === 'active' ? new Date().toISOString() : null
            });

            // Trigger provisioning workflow after first verified successful subscription
            if (mappedStatus === 'active') {
              console.log(`[iyzico-webhook] Mapping successful active sub for tenant ${tenantIdStr}, unlocking...`);
              await supabaseAdmin.from('tenants')
                .update({ status: 'active' }) // Transition from setup or billing-locked to active
                .eq('id', tenantIdStr)
                .eq('status', 'trial'); // or whatever status locking represents
            }
        } else {
             // Fallback: If we couldn't find an existing sub by ID, maybe it's the very first creation ping
             // Usually, createCheckoutSession already created a pending sub if schema supported it.
             console.log("[iyzico-webhook] Sub not found by ref code, looking at conversationId if present...");
        }
    }

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
