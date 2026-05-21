import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    // Read payload
    const body = await req.text(); // Raw body needed for signature verification
    const signature = req.headers.get('x-iyzico-signature'); // example header, varies by provider

    // TODO: verify provider signature
    // if (!verifySignature(body, signature, Deno.env.get('IYZICO_SECRET_KEY'))) {
    //   throw new Error('Invalid signature');
    // }

    // Parse verified payload
    const payload = JSON.parse(body);
    console.log(`[iyzico-mock] Received webhook payload:`, payload);

    // TODO: Map provider event to internal status:
    // const status = mapIyzicoStatus(payload.status);
    
    // TODO: Update subscriptions table only after verified webhook
    // const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
    // await supabaseAdmin.from('subscriptions').update({ status }).eq('provider_reference', payload.referenceCode);

    // TODO: Insert payment record
    // TODO: Trigger provisioning workflow after first verified successful subscription

    return new Response(JSON.stringify({ received: true }), {
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
