// Tell Bing (and the other IndexNow engines: Yandex, Seznam, Naver) that pages changed, so
// they recrawl within hours instead of weeks. ChatGPT search draws on Bing's index.
// Run after a deploy that adds or edits a post:
//   npm run indexnow                    → every URL in the live sitemap
//   npm run indexnow -- /blog/my-post   → just these paths
// The key below must match public/<key>.txt, which proves we own the domain.
const KEY = 'ef83185a5f4b790f07e07a63300ab1bd';
const SITE = 'https://www.miraitech.city';

const args = process.argv.slice(2);
let urls = args.map(p => new URL(p, SITE).href);
if (!urls.length) {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urls.length} URL(s)`);
if (res.status >= 400) { console.log(await res.text()); process.exit(1); }
