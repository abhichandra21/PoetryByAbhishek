#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const POEMS_PATH = path.join(ROOT_DIR, 'src/data/poems.json');
const OUTPUT_PATH = path.join(ROOT_DIR, 'public/dictionary-cache.json');

const cleanWord = (word) => {
  return word.toLowerCase().trim()
    .replace(/[।,;:!?\-"'()\[\]{}]/g, '')
    .replace(/\s+/g, '');
};

const transliterationCache = new Map();

const fetchTransliterationCandidates = async (romanWord) => {
  const normalized = romanWord.toLowerCase();
  if (transliterationCache.has(normalized)) {
    return transliterationCache.get(normalized);
  }

  try {
    const params = new URLSearchParams({
      text: normalized,
      itc: 'hi-t-i0-und',
      num: '5'
    });

    const response = await fetch(`https://inputtools.google.com/request?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`status ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data) && data[0] === 'SUCCESS') {
      const suggestions = data[1]?.[0]?.[1];
      if (Array.isArray(suggestions)) {
        const cleaned = suggestions
          .map((suggestion) => (typeof suggestion === 'string' ? suggestion.trim() : ''))
          .filter((suggestion) => suggestion.length > 0);
        transliterationCache.set(normalized, cleaned);
        return cleaned;
      }
    }
  } catch (error) {
    console.warn(`Transliteration failed for "${romanWord}":`, error instanceof Error ? error.message : error);
  }

  transliterationCache.set(normalized, []);
  return [];
};

const decodeHtmlEntities = (value) => {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
};

const sanitizeRichText = (value) => {
  if (typeof value !== 'string') return null;
  const withoutTags = value.replace(/<[^>]*>/g, ' ');
  const decoded = decodeHtmlEntities(withoutTags);
  const compact = decoded.replace(/\s+/g, ' ').trim();
  return compact.length > 0 ? compact : null;
};

const extractInflectionTarget = (definitionMarkup) => {
  if (!definitionMarkup || typeof definitionMarkup !== 'string') {
    return null;
  }
  if (!definitionMarkup.includes('form-of-definition')) {
    return null;
  }
  const match = definitionMarkup.match(/form-of-definition-link[^>]*>[^]*?href="\/wiki\/([^"#?]+)(?:#[^"]*)?"/);
  if (!match) return null;
  const decodedTarget = decodeURIComponent(match[1]).replace(/_/g, ' ').trim();
  return decodedTarget || null;
};

const fetchFromWiktionary = async (word, visited = new Set()) => {
  if (visited.has(word)) return null;
  visited.add(word);

  try {
    const apiUrl = `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word)}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) return null;

    const data = await response.json();
    const entries = [];
    for (const value of Object.values(data)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item && typeof item === 'object') {
            entries.push(item);
          }
        }
      }
    }

    const preferredEntry = entries.find((entry) => {
      const language = entry.language;
      return typeof language === 'string' && (language === 'Hindi' || language === 'Urdu');
    }) || entries[0];

    if (!preferredEntry) return null;

    const definitions = Array.isArray(preferredEntry.definitions) ? preferredEntry.definitions : [];
    const firstDefinition = definitions.find((def) => typeof def?.definition === 'string' && def.definition.trim().length > 0);
    if (!firstDefinition) return null;

    const rawDefinition = typeof firstDefinition.definition === 'string' ? firstDefinition.definition : '';
    const definitionText = sanitizeRichText(rawDefinition) ?? rawDefinition.trim();
    if (!definitionText) return null;

    const examples = Array.isArray(firstDefinition.examples)
      ? firstDefinition.examples
          .map((example) => sanitizeRichText(example))
          .filter((example) => Boolean(example))
      : undefined;

    const lemmaTarget = extractInflectionTarget(rawDefinition);
    if (lemmaTarget && lemmaTarget !== word) {
      const lemmaMeaning = await fetchFromWiktionary(lemmaTarget, visited);
      if (lemmaMeaning) {
        const note = definitionText ? `Inflection: ${definitionText}` : undefined;
        return {
          ...lemmaMeaning,
          word,
          examples: note ? [...(lemmaMeaning.examples ?? []), note] : lemmaMeaning.examples,
          source: 'Wiktionary'
        };
      }
    }

    return {
      word: typeof preferredEntry.word === 'string' && preferredEntry.word.trim().length > 0
        ? decodeHtmlEntities(preferredEntry.word).trim()
        : word,
      meaning: definitionText,
      partOfSpeech: sanitizeRichText(preferredEntry.partOfSpeech) ?? undefined,
      etymology: sanitizeRichText(preferredEntry.etymology) ?? undefined,
      examples,
      source: 'Wiktionary'
    };
  } catch (error) {
    console.warn(`Wiktionary lookup failed for "${word}":`, error instanceof Error ? error.message : error);
    return null;
  }
};

const fetchFromDictionaryAPI = async (word) => {
  try {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/hi/${encodeURIComponent(word)}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      const entry = data[0];
      const firstMeaning = entry.meanings?.[0];
      const definition = firstMeaning?.definitions?.[0];

      if (definition?.definition) {
        return {
          word: entry.word || word,
          meaning: definition.definition,
          partOfSpeech: firstMeaning?.partOfSpeech,
          examples: definition.example ? [definition.example] : undefined,
          source: 'Dictionary API'
        };
      }
    }
  } catch (error) {
    console.warn(`DictionaryAPI lookup failed for "${word}":`, error instanceof Error ? error.message : error);
  }
  return null;
};

const lookupWordMeaning = async (candidate) => {
  let meaning = await fetchFromWiktionary(candidate);
  if (meaning) return meaning;
  meaning = await fetchFromDictionaryAPI(candidate);
  return meaning;
};

const tokenize = (line) => {
  if (!line) return [];
  return line
    .split(/[^\p{L}\p{N}']+/u)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
};

const isDevanagari = (word) => /[\u0900-\u097F]/u.test(word);
const isRoman = (word) => /^[a-zA-Z]+$/.test(word);

const collectWords = async () => {
  const poemsContent = await fs.readFile(POEMS_PATH, 'utf8');
  const poems = JSON.parse(poemsContent);

  const devanagariWords = new Set();
  const romanWords = new Set();

  poems.forEach((poem) => {
    const lines = [...(poem.lines || []), ...(poem.romanizedLines || [])];
    lines.forEach((line) => {
      tokenize(line).forEach((token) => {
        if (isDevanagari(token)) {
          devanagariWords.add(token);
        } else if (isRoman(token)) {
          romanWords.add(token.toLowerCase());
        }
      });
    });
  });

  return { devanagariWords, romanWords };
};

const loadExistingDictionary = async () => {
  try {
    const existingContent = await fs.readFile(OUTPUT_PATH, 'utf8');
    const parsed = JSON.parse(existingContent);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code !== 'ENOENT') {
        console.warn('Unable to read existing dictionary cache:', error);
      }
    } else {
      console.warn('Unable to read existing dictionary cache:', error);
    }
  }
  return {};
};

const buildDictionary = async () => {
  const { devanagariWords, romanWords } = await collectWords();
  const dictionary = await loadExistingDictionary();
  const processed = new Set(Object.keys(dictionary));

  const storeMeaning = (word, meaning) => {
    const key = cleanWord(word);
    if (!key || processed.has(key)) return;
    dictionary[key] = meaning;
    processed.add(key);
  };

  const plannedLookups = new Map();

  for (const word of devanagariWords) {
    const key = cleanWord(word);
    if (!key || processed.has(key) || plannedLookups.has(key)) continue;
    plannedLookups.set(key, { word, sourceLabel: 'devanagari' });
  }

  for (const romanWord of romanWords) {
    const candidates = await fetchTransliterationCandidates(romanWord);
    for (const candidate of candidates) {
      const key = cleanWord(candidate);
      if (!key || processed.has(key) || plannedLookups.has(key)) continue;
      plannedLookups.set(key, { word: candidate, sourceLabel: `roman:${romanWord}` });
    }
  }

  const tasks = Array.from(plannedLookups.values());
  const total = tasks.length;
  let processedCount = 0;

  for (const { word, sourceLabel } of tasks) {
    const meaning = await lookupWordMeaning(word);
    if (meaning) {
      storeMeaning(word, meaning);
    }

    processedCount += 1;
    if (processedCount % 25 === 0 || processedCount === total) {
      console.log(`Processed ${processedCount}/${total} words (${sourceLabel})...`);
    }

    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  return dictionary;
};

const run = async () => {
  console.log('Generating static dictionary cache...');
  const dictionary = await buildDictionary();
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(dictionary, null, 2), 'utf8');
  console.log(`Saved ${Object.keys(dictionary).length} entries to ${path.relative(ROOT_DIR, OUTPUT_PATH)}`);
};

run().catch((error) => {
  console.error('Failed to generate dictionary cache:', error);
  process.exit(1);
});
