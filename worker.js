export class ViewCounter {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async fetch() {
    const kstDate = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const key = `day:${kstDate}`;
    const current = (await this.ctx.storage.get(key)) || 0;
    const next = current + 1;
    await this.ctx.storage.put(key, next);

    return Response.json(
      { today: next, date: kstDate },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/view') {
      const site = (url.searchParams.get('site') || 'barotool').toLowerCase();
      if (!/^[a-z0-9-]{1,40}$/.test(site)) {
        return new Response('Bad Request', { status: 400 });
      }

      const id = env.VIEW_COUNTER.idFromName(site);
      const stub = env.VIEW_COUNTER.get(id);
      return stub.fetch('https://counter.internal/increment');
    }

    return env.ASSETS.fetch(request);
  }
};
