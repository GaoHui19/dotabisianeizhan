export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 允许跨域的 Header
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // 处理浏览器的 OPTIONS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 假设你用的是 KV 存储，key 叫 'DOTA_STORE'
      if (request.method === 'GET') {
        let data = await env.DOTA_KV.get('DOTA_STORE');
        let body = data ? data : JSON.stringify({ players: [], teams: [], bracket4: null, match6: null });
        return new Response(body, {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (request.method === 'PUT') {
        let reqBody = await request.text();
        await env.DOTA_KV.put('DOTA_STORE', reqBody);
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
