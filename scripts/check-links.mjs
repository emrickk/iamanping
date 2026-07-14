import { projects, articles, site } from '../src/data/site-content.ts';

const strict = process.argv.includes('--strict');
const targets = [
  site.linkedin,
  ...projects.filter((p) => strict || !p.pending).map((p) => p.blogUrl),
  ...articles.map((a) => a.blogUrl),
];

let failures = 0;
for (const url of targets) {
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'follow' });
    const ok = res.status === 200 || (url.includes('linkedin.com') && res.status === 999);
    console.log(`${ok ? 'OK ' : 'FAIL'} ${res.status} ${url}`);
    if (!ok) failures++;
  } catch (err) {
    console.log(`FAIL ERR ${url} (${err.message})`);
    failures++;
  }
}
console.log(failures === 0 ? '\nAll links OK' : `\n${failures} broken link(s)`);
process.exit(failures === 0 ? 0 : 1);
