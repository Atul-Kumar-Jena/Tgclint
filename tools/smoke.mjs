/* smoke test: verify built site has no broken local links/assets and key hooks exist */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
let errors = 0;
const warn = (m) => { console.log('  ✗ ' + m); errors++; };

function htmlFiles(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const f = join(dir, e);
    if (statSync(f).isDirectory()) out.push(...htmlFiles(f));
    else if (f.endsWith('.html')) out.push(f);
  }
  return out;
}

const files = htmlFiles(DIST);
console.log(`Checking ${files.length} HTML files in dist/`);

const attrRe = /(?:href|src)="([^"]+)"/g;
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const dir = dirname(file);
  let m;
  while ((m = attrRe.exec(html))) {
    let url = m[1];
    if (/^(https?:|\/\/|mailto:|tel:|data:|#)/.test(url)) continue;
    url = url.split('#')[0].split('?')[0];
    if (!url) continue;
    const target = resolve(dir, url);
    if (!existsSync(target)) warn(`${relative(DIST, file)} -> missing ${url}`);
  }
}

// required shared assets
for (const a of ['app.css', 'app.js', 'assets/favicon.svg', '.nojekyll']) {
  if (!existsSync(join(DIST, a))) warn(`missing required asset: ${a}`);
}

// key JS hooks present where expected
function need(file, token, label) {
  const p = join(DIST, file);
  if (!existsSync(p)) return warn(`${file} not found`);
  if (!readFileSync(p, 'utf8').includes(token)) warn(`${file} missing ${label} (${token})`);
}
need('index.html', 'data-hero-canvas', 'hero canvas');
need('index.html', 'data-stories-counter', 'stories counter');
need('index.html', 'data-pavilion', 'pavilion');
need('index.html', 'id="pvclip"', 'pavilion clip');
need('index.html', 'data-loader', 'loader');
need('index.html', 'data-menu-open', 'menu opener');
need('index.html', 'data-quote-open', 'quote opener');
need('approach.html', 'class="step"', 'approach steps');
need('collection.html', 'class="product-section"', 'product sections');
need('projects/ashmead-barn.html', 'project-hero', 'project hero');

// every page must load the chrome + scripts
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const rel = relative(DIST, file);
  if (!html.includes('app.js')) warn(`${rel} missing app.js`);
  if (!html.includes('class="pill')) warn(`${rel} missing nav pill`);
  if (!html.includes('id="menu"')) warn(`${rel} missing menu`);
  if (!/<\/html>\s*$/.test(html)) warn(`${rel} not closed properly`);
}

console.log(errors ? `\nFAILED with ${errors} issue(s)` : '\n✓ all smoke checks passed');
process.exit(errors ? 1 : 0);
