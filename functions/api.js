export async function onRequest(context) {
  const { request, env } = context;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const KV = env.DOTA_KV;
  if (!KV) {
    return new Response(JSON.stringify({ error: "KV 'DOTA_KV' not bound to Pages!" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const KEY_NAME = 'game_data';

  try {
    if (request.method === 'GET') {
      let data = await KV.get(KEY_NAME);
      return new Response(data || JSON.stringify({ players: [], teams: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (request.method === 'PUT') {
      let bodyText = await request.text();
      await KV.put(KEY_NAME, bodyText);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}