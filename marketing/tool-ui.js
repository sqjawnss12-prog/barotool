(()=>{
  const path=location.pathname;
  const excluded=new Set(['/marketing/','/marketing/index.html','/marketing/about.html','/marketing/privacy.html','/marketing/contact.html']);
  if(!path.startsWith('/marketing/')||excluded.has(path))return;
  const main=document.querySelector('main.tool');
  if(!main||main.dataset.platformUi==='1')return;
  main.dataset.platformUi='1';
  main.classList.add('has-platform-ui');

  const toolHead=main.querySelector('.tool-head');
  const title=toolHead?.querySelector('h1')?.textContent?.trim()||'계산기';
  const oldBack=main.querySelector(':scope > .back');
  if(oldBack)oldBack.remove();

  const content=document.createElement('div');
  content.className='tool-main';
  const breadcrumb=document.createElement('nav');
  breadcrumb.className='tool-breadcrumb';
  breadcrumb.setAttribute('aria-label','현재 위치');
  breadcrumb.innerHTML=`<a href="/marketing/">마케팅셈</a><span>›</span><span>${title}</span>`;
  content.appendChild(breadcrumb);
  [...main.children].forEach(el=>content.appendChild(el));

  const sections=[
    ['광고·ROAS',[
      ['/marketing/ad-funnel-kpi.html','광고 퍼널 KPI'],
      ['/marketing/breakeven-roas.html','손익분기 ROAS'],
      ['/marketing/max-cpc.html','최대 CPC'],
      ['/marketing/ad-budget-pacing.html','광고 예산 페이싱']
    ]],
    ['마진·가격',[
      ['/marketing/product-profit.html','상품 마진'],
      ['/marketing/max-discount-rate.html','최대 할인율'],
      ['/marketing/bulk-profit.html','상품 마진 대량 분석'],
      ['/marketing/target-price.html','목표 판매가 역산'],
      ['/marketing/profit-buffer.html','마진 안전구간']
    ]],
    ['전환·고객',[
      ['/marketing/conversion-profit.html','구매전환율 이익'],
      ['/marketing/aov-profit.html','객단가 개선 이익'],
      ['/marketing/ltv-cac.html','LTV·CAC'],
      ['/marketing/repurchase-profit.html','재구매율 이익']
    ]],
    ['판매 운영',[
      ['/marketing/free-shipping-threshold.html','무료배송 기준금액'],
      ['/marketing/return-profit.html','반품률 마진'],
      ['/marketing/channel-fee.html','판매채널 수수료'],
      ['/marketing/break-even-sales.html','손익분기 판매수량']
    ]]
  ];
  const navHtml=sections.map(([name,items])=>`<div class="tool-side-group"><b>${name}</b>${items.map(([href,label])=>`<a class="${path===href?'active':''}" href="${href}">${label}<span>→</span></a>`).join('')}</div>`).join('');
  const aside=document.createElement('aside');
  aside.className='tool-side';
  aside.innerHTML=`
    <a class="tool-side-home" href="/marketing/"><span>⌂</span><strong>마케팅셈 전체 계산기</strong></a>
    ${navHtml}
    <div class="tool-side-group tool-side-sites"><b>다른 무료 도구</b>
      <a href="/stocksem/">재고셈<span>→</span></a>
      <a href="/couponsem/">쿠폰셈<span>→</span></a>
      <a href="/unitlab/">단가랩<span>→</span></a>
      <a href="/qr/">QR공방<span>→</span></a>
      <a href="/">바로툴<span>→</span></a>
    </div>`;

  const mobile=document.createElement('details');
  mobile.className='tool-mobile-nav';
  mobile.innerHTML=`<summary>다른 계산기 보기</summary><div>${sections.flatMap(([_,items])=>items).map(([href,label])=>`<a href="${href}">${label}</a>`).join('')}<a href="/marketing/">전체 계산기 →</a></div>`;
  content.insertBefore(mobile,content.children[1]||null);

  main.replaceChildren(aside,content);
})();