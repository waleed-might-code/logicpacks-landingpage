// Tells IndexNow (Bing, Yandex, Seznam, Naver and others) about every URL in the
// production sitemap. The key file is public/a0b60c75ca1a11ce3a31d18ea9f4f16b.txt. Run after a production deploy:
//   node scripts/indexnow.mjs
const KEY = 'a0b60c75ca1a11ce3a31d18ea9f4f16b';
const HOST = 'logicpacks.io';
const sitemap = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URLs`);
process.exit(res.ok ? 0 : 1);
