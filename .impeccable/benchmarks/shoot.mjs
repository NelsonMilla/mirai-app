// Tiled full-page captures + per-section metrics. Usage: OUT=/some/dir node .impeccable/benchmarks/shoot.mjs '[["name","https://url"]]'
import { chromium } from '/Users/nelson/Downloads/Mirai/mirai-app/legacy-site/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const OUT = process.env.OUT || process.cwd();
const pages = JSON.parse(process.argv[2]);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 0.5, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15' });
for (const [name, url] of pages) {
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(2000);
    // scroll through to trigger lazy content
    const total = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < total + 900; y += 450) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(120); }
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(800);
    const metrics = await page.evaluate(() => {
      const vh = innerHeight;
      const cands = [...document.querySelectorAll('main section, main > div, section')].filter(s => s.getBoundingClientRect().height > 250);
      // keep outermost only
      const secs = cands.filter(s => !cands.some(o => o !== s && o.contains(s)));
      const out = secs.map(s => {
        const r = s.getBoundingClientRect();
        const h = s.querySelector('h1,h2,h3');
        const hs = h ? getComputedStyle(h) : null;
        return {
          cls: (s.id ? '#' + s.id + ' ' : '') + (s.className || '').toString().slice(0, 40),
          topVH: +((r.top + scrollY) / vh).toFixed(1), hVH: +(r.height / vh).toFixed(1),
          headline: h ? h.innerText.replace(/\n/g, ' / ').slice(0, 90) : null,
          hStyle: hs ? `${hs.fontSize}/${hs.fontWeight}/lh${hs.lineHeight}` : null,
          words: s.innerText.split(/\s+/).filter(Boolean).length,
          media: s.querySelectorAll('img,picture,video,canvas').length, videos: s.querySelectorAll('video').length,
          bg: getComputedStyle(s).backgroundColor,
          prices: (s.innerText.match(/\$\d[\d,]*/g) || []).slice(0, 4),
          ctas: [...s.querySelectorAll('a,button')].map(a => a.innerText.trim()).filter(t => t && t.length < 28).slice(0, 8)
        };
      });
      return { vh, docVH: +(document.body.scrollHeight / vh).toFixed(1), sections: out.length, out };
    });
    fs.writeFileSync(`${OUT}/${name}.json`, JSON.stringify(metrics, null, 1));
    const H = await page.evaluate(() => document.body.scrollHeight);
    let i = 0;
    for (let y = 0; y < H; y += 2700, i++) {
      await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(600);
      await page.screenshot({ path: `${OUT}/${name}-${String(i).padStart(2, '0')}.png`, fullPage: true, clip: { x: 0, y, width: 1440, height: Math.min(2700, H - y) } });
    }
    console.log(name, 'docVH', metrics.docVH, 'sections', metrics.sections, 'tiles', i);
  } catch (e) { console.log(name, 'ERR', e.message.slice(0, 200)); }
  await page.close();
}
await browser.close();
