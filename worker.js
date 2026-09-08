export class ViewCounter {
  constructor(ctx) { this.ctx = ctx; }
  async fetch() {
    const kstDate = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const key = `day:${kstDate}`;
    const current = (await this.ctx.storage.get(key)) || 0;
    const next = current + 1;
    await this.ctx.storage.put(key, next);
    return Response.json({ today: next, date: kstDate }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
const HOME_SITES = new Map([
  ['/', 'barotool'], ['/marketing', 'marketing'], ['/marketing/', 'marketing'],
  ['/packfit', 'packfit'], ['/packfit/', 'packfit'], ['/tilefit', 'tilefit'], ['/tilefit/', 'tilefit'],
  ['/powercost', 'powercost'], ['/powercost/', 'powercost']
]);
class ViewBadgeInjector {
  constructor(site) { this.site = site; }
  element(element) {
    const site = this.site;
    element.append(`<div id="daily-view-badge" aria-live="polite" style="position:fixed;right:14px;bottom:14px;z-index:9999;padding:8px 11px;border-radius:999px;background:rgba(20,24,32,.88);color:#fff;font:600 12px/1.2 system-ui,-apple-system,'Segoe UI',sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.18);backdrop-filter:blur(8px)">오늘 조회수 <span id="daily-view-count">…</span></div><script>(()=>{const n=document.getElementById('daily-view-count');fetch('/api/view?site=${site}',{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject()).then(d=>{n.textContent=Number(d.today||0).toLocaleString('ko-KR')}).catch(()=>{const b=document.getElementById('daily-view-badge');if(b)b.style.display='none'})})()</script>`,{html:true});
  }
}
export default { async fetch(request, env) {
  const url = new URL(request.url);
  if (url.pathname === '/api/view') {
    const site = (url.searchParams.get('site') || 'barotool').toLowerCase();
    if (!/^[a-z0-9-]{1,40}$/.test(site)) return new Response('Bad Request',{status:400});
    const id=env.VIEW_COUNTER.idFromName(site); return env.VIEW_COUNTER.get(id).fetch('https://counter.internal/increment');
  }
  const response=await env.ASSETS.fetch(request), site=HOME_SITES.get(url.pathname), type=response.headers.get('content-type')||'';
  if(site&&type.includes('text/html')) return new HTMLRewriter().on('body',new ViewBadgeInjector(site)).transform(response);
  return response;
}};