#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const POEMS_PATH = path.join(ROOT_DIR, 'src/data/poems.json');
const CACHE_PATH = path.join(ROOT_DIR, 'public/dictionary-cache.json');

const readMtime = async (filepath) => {
  try {
    const stats = await fs.stat(filepath);
    return stats.mtimeMs;
  } catch (error) {
    return null;
  }
};

const formatRelative = (msDiff) => {
  const abs = Math.abs(msDiff);
  const minutes = Math.round(abs / 60000);
  if (minutes < 1) return '<1 minute';
  if (minutes === 1) return '1 minute';
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'}`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'}`;
};

const warn = (message) => {
  console.warn(`[Dictionary Reminder] ${message}`);
};

const run = async () => {
  const [poemsMtime, cacheMtime] = await Promise.all([
    readMtime(POEMS_PATH),
    readMtime(CACHE_PATH)
  ]);

  if (!poemsMtime) {
    return; // Nothing to compare
  }

  if (!cacheMtime) {
    warn('No dictionary cache found. Run "npm run generate:dictionary" to prime definitions.');
    return;
  }

  if (cacheMtime >= poemsMtime) {
    return; // Cache is up to date
  }

  const delta = poemsMtime - cacheMtime;
  warn(`Poems were updated ${formatRelative(delta)} after the dictionary cache. Run "npm run generate:dictionary" to refresh meanings.`);
};

run().catch((error) => {
  warn(`Unable to check dictionary freshness: ${error instanceof Error ? error.message : String(error)}`);
});
