const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const fs = require('fs');
(async () => {
  const body = fs.readFileSync(require('path').join(__dirname,'..','quiet-hours.html'),'utf8');
  fs.writeFileSync('/tmp/check.html', `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}</style></head><body>${body}</body></html>`);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport:{width:1280,height:950} });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  await page.goto('file:///tmp/check.html');
  const step = async (label, fn) => {
    try { await fn(); await page.waitForTimeout(90); console.log('ok   ' + label); }
    catch (e) { console.log('FAIL ' + label + ' :: ' + e.message.split('\n')[0]); }
  };
  await step('open a Fresh today row', async()=>{ await page.click('.row.plain'); await page.waitForSelector('.reader h1'); });
  await step('reader text size menu', async()=>{ await page.click('[data-sizeopen]'); await page.waitForSelector('[data-size]'); await page.click('[data-size="23"]'); });
  await step('reader Later', async()=>{ await page.click('[data-act^="later"]'); await page.waitForSelector('.toast'); });
  await step('toast Undo', async()=>{ await page.click('.toast .tundo'); });
  await step('back to feed', async()=>{ await page.click('[data-back]'); await page.waitForSelector('.controls'); });
  await step('feed row archive', async()=>{ await page.click('.nav button:text-is("Feed")'); await page.click('.row [data-act^="archive"]', {force:true}); await page.waitForSelector('.toast'); });
  await step('feed filter panel', async()=>{ await page.click('.fbtn'); await page.waitForSelector('.panel'); await page.click('[data-fk$="video"]'); });
  await step('group by source', async()=>{ await page.selectOption('[data-pref$="group"]', 'Source'); });
  await step('search overlay', async()=>{ await page.click('[aria-label="Search"]'); await page.fill('#search-q','soup'); await page.waitForSelector('.search-hits .mi'); await page.keyboard.press('Escape'); });
  await step('add overlay validation', async()=>{ await page.click('.add'); await page.click('[data-follow]'); await page.waitForSelector('.alert'); });
  await step('follow a source', async()=>{ await page.fill('#add-url','newsource.example'); await page.click('[data-follow]'); await page.waitForSelector('.toast'); });
  await step('new folder', async()=>{ await page.click('[data-overlay="newfolder"]'); await page.fill('#folder-name','Testing'); await page.click('[data-newfolder]'); await page.waitForSelector('.toast'); });
  await step('edit folders, add + drag target exists', async()=>{ await page.click('.nav button:text-is("Home")'); await page.click('[data-overlay="folders"]'); await page.waitForSelector('.pickrow'); });
  await step('remove a home folder', async()=>{ await page.click('.pickrow [data-fremove]'); await page.waitForSelector('[data-fadd]'); await page.click('[data-fadd]'); await page.keyboard.press('Escape'); });
  await step('goal edit', async()=>{ await page.click('[data-goaledit]'); await page.fill('#goal-input','45'); await page.click('[data-goalsave]'); });
  await step('play from For your listen', async()=>{ await page.click('.playbtn'); await page.waitForSelector('.player'); await page.click('[data-pp]'); await page.click('[data-pclose]'); });
  await step('library + archive', async()=>{ await page.click('.nav button:text-is("Library")'); await page.click('[data-shelf="archive"]'); await page.waitForSelector('h1'); });
  await step('settings reseed', async()=>{ await page.click('.nav button:text-is("Settings")').catch(()=>page.click('[data-go="settings"]')); await page.click('[data-seed="demo"]'); await page.waitForSelector('.toast'); });
  console.log('---');
  console.log(errors.length ? errors.join('\n') : 'no page errors through the whole flow');
  await browser.close();
})();
