// Rend tous les liens internes href="/..." et action="/..." sensibles a la base de deploiement.
// Transforme href="/xxx" -> href={u('/xxx')} et injecte l'import du helper.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';

const SRC = 'D:/CLAUDE CODE/nathanael-site/src';

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.astro')) yield p;
  }
}

let modifies = 0;
for await (const file of walk(SRC)) {
  let txt = await readFile(file, 'utf8');
  const avant = txt;
  // href="/..." ou action="/..." -> ={u('/...')} — uniquement chemins internes
  txt = txt.replace(/(href|action)="(\/[^"]*)"/g, (m, attr, chemin) => {
    if (chemin.startsWith('//')) return m; // protocole relatif = externe
    return `${attr}={u('${chemin}')}`;
  });
  if (txt === avant) continue;
  // injecte l'import si absent
  if (!txt.includes("from '../lib/url'") && !txt.includes("from '../../lib/url'") && !txt.includes("from '../../../lib/url'")) {
    const depth = relative(SRC, dirname(file)).split(/[\\/]/).filter(Boolean).length;
    const prefix = '../'.repeat(depth) || './';
    txt = txt.replace(/^---\r?\n/, (m) => m + `import { u } from '${prefix}lib/url';\n`);
  }
  await writeFile(file, txt);
  modifies++;
  console.log('modifie:', relative(SRC, file));
}
console.log(`${modifies} fichiers modifies`);
