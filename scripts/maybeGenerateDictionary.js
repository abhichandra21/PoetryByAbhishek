#!/usr/bin/env node
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');
const POEMS_PATH = path.join(ROOT, 'src/data/poems.json');
const CACHE_PATH = path.join(ROOT, 'public/dictionary-cache.json');

const shouldForce = process.env.FORCE_DICTIONARY === 'true';

const getMtime = async (filePath) => {
  try {
    const stats = await fs.stat(filePath);
    return stats.mtimeMs;
  } catch (error) {
    return null;
  }
};

const runGenerate = () => {
  return new Promise((resolve, reject) => {
    const child = spawn('node', ['scripts/generateDictionaryCache.js'], {
      cwd: ROOT,
      stdio: 'inherit',
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`generateDictionaryCache.js exited with code ${code}`));
      }
    });

    child.on('error', (error) => reject(error));
  });
};

const run = async () => {
  if (shouldForce) {
    console.log('[dictionary] FORCE_DICTIONARY=true -> regenerating cache');
    await runGenerate();
    return;
  }

  const [poemsMtime, cacheMtime] = await Promise.all([
    getMtime(POEMS_PATH),
    getMtime(CACHE_PATH)
  ]);

  if (!poemsMtime) {
    console.log('[dictionary] poems.json missing; skipping refresh');
    return;
  }

  if (!cacheMtime) {
    console.log('[dictionary] Cache missing -> generating dictionary');
    await runGenerate();
    return;
  }

  if (poemsMtime > cacheMtime) {
    console.log('[dictionary] poems.json updated since cache -> regenerating dictionary');
    await runGenerate();
    return;
  }

  console.log('[dictionary] Cache is up to date; skipping regeneration');
};

run().catch((error) => {
  console.error('[dictionary] Failed to update cache:', error instanceof Error ? error.message : error);
  process.exit(1);
});
