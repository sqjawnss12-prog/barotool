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
  ['/', 'barotool'], ['/marketing', 'marketing'], ['/marketing/', 'marketing'], ['/qr', 'qr'], ['/qr/', 'qr'], ['/iconmaker', 'iconmaker'], ['/iconmaker/', 'iconmaker'], ['/watermark', 'watermark'], ['/watermark/', 'watermark'], ['/doclab', 'doclab'], ['/doclab/', 'doclab'], ['/couponsem', 'couponsem'], ['/couponsem/', 'couponsem'], ['/unitlab', 'unitlab'], ['/unitlab/', 'unitlab'], ['/stocksem', 'stocksem'], ['/stocksem/', 'stocksem'],
  ['/quote-workshop', 'quote-workshop'], ['/quote-workshop/', 'quote-workshop'], ['/petcost', 'petcost'], ['/petcost/', 'petcost'], ['/roundsem', 'roundsem'], ['/roundsem/', 'roundsem'], ['/rentalsem', 'rentalsem'], ['/rentalsem/', 'rentalsem'],
  ['/carvaluelab', 'carvaluelab'], ['/carvaluelab/', 'carvaluelab'],
  ['/areafit', 'areafit'], ['/areafit/', 'areafit'], ['/floorfit', 'floorfit'], ['/floorfit/', 'floorfit'],
  ['/moldingfit', 'moldingfit'], ['/moldingfit/', 'moldingfit'],
  ['/packfit', 'packfit'], ['/packfit/', 'packfit'], ['/tilefit', 'tilefit'], ['/tilefit/', 'tilefit'],
  ['/powercost', 'powercost'], ['/powercost/', 'powercost'], ['/curtainfit', 'curtainfit'], ['/curtainfit/', 'curtainfit'],
  ['/paintfit', 'paintfit'], ['/paintfit/', 'paintfit'], ['/wallfit', 'wallfit'], ['/wallfit/', 'wallfit'],
  ['/printfit', 'printfit'], ['/printfit/', 'printfit'], ['/tvfit', 'tvfit'], ['/tvfit/', 'tvfit'],
  ['/filmfit', 'filmfit'], ['/filmfit/', 'filmfit'], ['/monitorfit', 'monitorfit'], ['/monitorfit/', 'monitorfit']
]);
class ViewBadgeInjector {
  constructor(site) { this.site = site; }
  element(element) {
    const site = this.site;
    element.append(`<div id="daily-view-badge" aria-live="polite" style="position:fixed;right:14px;bottom:14px;z-index:9999;padding:8px 11px;border-radius:999px;background:rgba(20,24,32,.88);color:#fff;font:600 12px/1.2 system-ui,-apple-system,'Segoe UI',sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.18);backdrop-filter:blur(8px)">오늘 조회수 <span id="daily-view-count">…</span></div><script>(()=>{const n=document.getElementById('daily-view-count');fetch('/api/view?site=${site}',{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject()).then(d=>{n.textContent=Number(d.today||0).toLocaleString('ko-KR')}).catch(()=>{const b=document.getElementById('daily-view-badge');if(b)b.style.display='none'})})()</script>`,{html:true});
  }
}
class QuoteWorkshopCrossLinkInjector {
  element(element) {
    element.append('<aside style="max-width:1040px;margin:18px auto 90px;padding:0 24px"><div style="background:#fff;border:1px solid #e5dfd4;border-radius:18px;padding:20px;line-height:1.7"><b>고액 인테리어 견적 비교</b><br><a href="/quote-workshop/window-replacement-cost.html" style="color:#7b3e20;font-weight:800">24평·32평·34평 샷시 교체 비용·견적 비교 →</a><span style="color:#746e65;font-size:14px"> 전체·부분 교체와 로이유리, 확장 여부를 반영하고 실제 받은 견적도 판정합니다.</span><br><br><b>가전 청소비 비교</b><br><a href="/quote-workshop/dryer-cleaning-cost.html" style="color:#7b3e20;font-weight:800">건조기 분해청소 비용·견적 비교 →</a><span style="color:#746e65;font-size:14px"> 용량·분해범위·오염도를 반영하고 받은 견적도 비교합니다.</span><br><br><b>차량 구매·판매 전 확인</b><br><a href="/carvaluelab/" style="color:#7b3e20">차값랩 중고차 감가율·잔존가치 계산기 →</a><span style="color:#746e65;font-size:14px"> 현재 시세를 기준으로 실제 감가율과 향후 가치 시나리오를 계산합니다.</span></div></aside>',{html:true});
  }
}
class QrCrossLinkInjector {
  element(element) {
    element.append('<aside style="max-width:1120px;margin:0 auto 70px;padding:0 24px"><div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:18px;padding:20px;line-height:1.7"><b>매장·카페에서 쓰는 Wi-Fi QR이 필요하신가요?</b><br><a href="/qr/wifi-qr-print.html" style="color:#1d4ed8;font-weight:800">와이파이 QR + 인쇄 안내문 만들기 →</a><span style="color:#475569;font-size:14px"> SSID와 비밀번호로 QR을 만들고 바로 출력할 수 있습니다.</span></div></aside>',{html:true});
  }
}
class MarketingToolUiInjector {
  element(element) {
    element.append('<script src="/marketing/tool-ui.js"></script>',{html:true});
  }
}
const MARKETING_NON_TOOLS=new Set(['/marketing/','/marketing/index.html','/marketing/about.html','/marketing/privacy.html','/marketing/contact.html']);
export default { async fetch(request, env) {
  const url = new URL(request.url);
  if (url.pathname === '/api/view') {
    const site = (url.searchParams.get('site') || 'barotool').toLowerCase();
    if (!/^[a-z0-9-]{1,40}$/.test(site)) return new Response('Bad Request',{status:400});
    const id=env.VIEW_COUNTER.idFromName(site); return env.VIEW_COUNTER.get(id).fetch(request);
  }
  const response=await env.ASSETS.fetch(request), site=HOME_SITES.get(url.pathname), type=response.headers.get('content-type')||'';
  if(!type.includes('text/html')) return response;
  const marketingTool=url.pathname.startsWith('/marketing/')&&url.pathname.endsWith('.html')&&!MARKETING_NON_TOOLS.has(url.pathname);
  if(!site&&!marketingTool) return response;
  let rewriter=new HTMLRewriter();
  if(site) rewriter=rewriter.on('body',new ViewBadgeInjector(site));
  if(url.pathname==='/quote-workshop'||url.pathname==='/quote-workshop/') rewriter=rewriter.on('body',new QuoteWorkshopCrossLinkInjector());
  if(url.pathname==='/qr'||url.pathname==='/qr/') rewriter=rewriter.on('body',new QrCrossLinkInjector());
  if(marketingTool) rewriter=rewriter.on('body',new MarketingToolUiInjector());
  return rewriter.transform(response);
}};