export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/blog-index') {
      const cacheKey = new Request(url.toString(), request);
      const cache = caches.default;
      let response = await cache.match(cacheKey);
      if (!response) {
        response = await fetch('https://aspartameawareness.org/json/posts.json');
        response = new Response(await response.arrayBuffer(), response);
        response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
        ctx.waitUntil(cache.put(cacheKey, response.clone()));
      }
      return response;
    }
    return fetch(request);
  }
};
