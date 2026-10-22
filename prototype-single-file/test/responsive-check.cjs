const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const fs = require('fs');

(async () => {
const body = fs.readFileSync(require('path').join(__dirname,'..','quiet-hours.html'),'utf8');
const page_html = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style>
</head><body>${body}</body></html>`;
fs.writeFileSync('/tmp/check.html', page_html);

const browser = await chromium.launch();
const sizes = [[1680,1000],[1440,900],[1240,900],[1024,800],[900,800],[768,800],[600,800],[390,844],[360,740]];
const views = ['home','feed','library','listen','sources','settings'];
const problems = [];
for (const [w,h] of sizes){
  const page = await browser.newPage({ viewport:{width:w,height:h} });
  await page.goto('file:///tmp/check.html');
  for (const v of views){
    await page.evaluate(view => { window.go ? window.go(view) : null; }, v).catch(()=>{});
    // navigate via the UI instead, since go() is module-scoped
    const nav = await page.$$('.nav button');
    const idx = views.indexOf(v);
    if (nav[idx]) await nav[idx].click();
    await page.waitForTimeout(60);
    const r = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      overflowing: [...document.querySelectorAll('*')]
        .filter(el => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
        .slice(0,3).map(el => (el.className && typeof el.className==='string' ? '.'+el.className.split(' ')[0] : el.tagName)
          + ' right=' + Math.round(el.getBoundingClientRect().right)),
      contentW: (document.querySelector('.wrap') || {}).clientWidth,
    }));
    if (r.scrollW > r.clientW + 1) problems.push(`${w}x${h} ${v}: page scrolls sideways (${r.scrollW} > ${r.clientW}) ${r.overflowing.join(' | ')}`);
    else if (r.overflowing.length) problems.push(`${w}x${h} ${v}: element past the edge: ${r.overflowing.join(' | ')}`);
    if (v==='home') console.log(`${String(w).padStart(4)}px  content column ${r.contentW}px`);
  }
  await page.close();
}
console.log('---');
console.log(problems.length ? problems.join('\n') : 'no horizontal overflow at any width, on any page');
await browser.close();
})();
