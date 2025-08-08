export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }
    const data = await request.json();
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: data.token,
        remoteip: request.headers.get('CF-Connecting-IP')
      })
    }).then(r => r.json());
    if (!verify.success) {
      return new Response(JSON.stringify({ error: 'Invalid captcha' }), { status: 400 });
    }
    const author = (data.author || '').replace(/[^\w\s]/g, '').slice(0,60);
    const comment = (data.comment || '').replace(/<[^>]*>/g, '').slice(0,1000);
    const id = crypto.randomUUID();
    await env.COMMENTS.put(id, JSON.stringify({ author, comment, ts: Date.now() }));
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  }
};
