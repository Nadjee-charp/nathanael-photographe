// Fusionne les scores de triage (sheet+tile) avec la legende (fichiers reels)
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const SCORES = process.argv[2]; // dossier des triage-*.json
const LEGEND = 'D:/CLAUDE CODE/nathanael-site/assets/_sheets/legend.json';
const OUT = join(SCORES, 'aggregat.json');

const legend = JSON.parse(await readFile(LEGEND, 'utf8'));
const all = [];
for (const f of (await readdir(SCORES)).filter(f => f.startsWith('triage-') && f.endsWith('.json'))) {
  let raw = await readFile(join(SCORES, f), 'utf8');
  raw = raw.replace(/^﻿/, '');
  const entries = JSON.parse(raw);
  for (const e of entries) {
    const file = legend[e.sheet]?.[String(e.tile)];
    if (!file) { console.error(`Legende manquante: ${e.sheet} #${e.tile} (${f})`); continue; }
    const category = e.sheet.replace(/-\d+$/, '');
    all.push({ ...e, file, category, source: f });
  }
}

all.sort((a, b) => b.note - a.note);
await writeFile(OUT, JSON.stringify(all, null, 1));

const byCat = {};
for (const e of all) (byCat[e.category] ??= []).push(e);
for (const [cat, list] of Object.entries(byCat)) {
  const n5 = list.filter(e => e.note === 5).length;
  const n4 = list.filter(e => e.note === 4).length;
  console.log(`${cat}: ${list.length} notes — ${n5} x5, ${n4} x4`);
  for (const e of list.filter(e => e.note >= 4)) {
    console.log(`  [${e.note}]${e.hero ? ' HERO' : ''} ${e.file} — ${e.desc} (${(e.tags || []).join(',')})`);
  }
}
