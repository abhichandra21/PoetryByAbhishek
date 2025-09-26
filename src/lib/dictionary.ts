import allPoemTranslations, { romanToDevanagariMap } from '../translations/poemTranslations';
import type { WordTranslation } from '../translations/poemTranslations';
// Dictionary service for external API lookups
export interface WordMeaning {
  word: string;
  meaning: string;
  etymology?: string;
  examples?: string[];
  partOfSpeech?: string;
  source?: string;
}

export interface DictionaryResponse {
  success: boolean;
  data?: WordMeaning;
  error?: string;
}

// Clean word for consistent caching and better matching
const cleanWord = (word: string): string => {
  return word.toLowerCase().trim()
    .replace(/[।,;:!?\-"'()[\]{}]/g, '') // Remove punctuation
    .replace(/\s+/g, ''); // Remove all spaces
};

type ManualDictionaryEntry = {
  devWord: string;
  translation: WordTranslation;
};

const manualDictionary = new Map<string, ManualDictionaryEntry>();

const registerManualEntry = (key: string, devWord: string, translation: WordTranslation): void => {
  const normalized = cleanWord(key);
  if (!normalized || manualDictionary.has(normalized)) {
    return;
  }
  manualDictionary.set(normalized, { devWord, translation });
};

Object.entries(allPoemTranslations).forEach(([devWord, translation]) => {
  registerManualEntry(devWord, devWord, translation);
  if (translation.roman) {
    registerManualEntry(translation.roman, devWord, translation);
  }
});

const buildManualMeaning = (entry: ManualDictionaryEntry): WordMeaning => {
  return {
    word: entry.devWord,
    meaning: entry.translation.meaning,
    source: 'Manual Dictionary'
  };
};

const getManualMeaning = (candidate: string): WordMeaning | null => {
  if (!candidate) {
    return null;
  }

  const normalized = cleanWord(candidate);
  if (!normalized) {
    return null;
  }

  const entry = manualDictionary.get(normalized);
  if (entry) {
    return buildManualMeaning(entry);
  }

  const romanTarget = romanToDevanagariMap[candidate.toLowerCase()];
  if (romanTarget) {
    const romanEntry = manualDictionary.get(cleanWord(romanTarget));
    if (romanEntry) {
      return buildManualMeaning(romanEntry);
    }
  }

  return null;
};

const transliterationCache = new Map<string, string[]>();
const runtimeCache = new Map<string, { meaning: WordMeaning; timestamp: number }>();
const RUNTIME_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

let staticDictionaryPromise: Promise<Record<string, WordMeaning>> | null = null;

const getStaticDictionary = async (): Promise<Record<string, WordMeaning>> => {
  if (typeof window === 'undefined') {
    return {};
  }

  if (!staticDictionaryPromise) {
    staticDictionaryPromise = fetch('/dictionary-cache.json')
      .then(async response => {
        if (!response.ok) {
          throw new Error(`Failed to load dictionary cache (status ${response.status})`);
        }
        const data = await response.json();
        if (data && typeof data === 'object') {
          return data as Record<string, WordMeaning>;
        }
        return {};
      })
      .catch(error => {
        console.warn('Unable to load dictionary cache:', error instanceof Error ? error.message : error);
        return {} as Record<string, WordMeaning>;
      });
  }

  return staticDictionaryPromise;
};

const fetchTransliterationCandidates = async (romanWord: string): Promise<string[]> => {
  const normalized = romanWord.toLowerCase();

  if (transliterationCache.has(normalized)) {
    return transliterationCache.get(normalized)!;
  }

  try {
    const params = new URLSearchParams({
      text: normalized,
      itc: 'hi-t-i0-und',
      num: '5'
    });

    const response = await fetch(`https://inputtools.google.com/request?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Transliteration API error: ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data) && data[0] === 'SUCCESS') {
      const suggestions = data[1]?.[0]?.[1];
      if (Array.isArray(suggestions)) {
        const cleaned = suggestions
          .map((suggestion: unknown) => (typeof suggestion === 'string' ? suggestion.trim() : ''))
          .filter((suggestion: string) => suggestion.length > 0);

        transliterationCache.set(normalized, cleaned);
        return cleaned;
      }
    }
  } catch (error) {
    console.warn(`Transliteration lookup failed for "${romanWord}":`, error instanceof Error ? error.message : error);
  }

  transliterationCache.set(normalized, []);
  return [];
};

const getDevanagariCandidates = async (romanWord: string): Promise<string[]> => {
  const dynamicSuggestions = await fetchTransliterationCandidates(romanWord);
  return [...new Set(dynamicSuggestions.filter(Boolean))];
};

// Convert HTML strings from Wiktionary responses into readable text
const decodeHtmlEntities = (value: string): string => {
  if (typeof document !== 'undefined') {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = value;
    return textarea.value;
  }

  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
};

const sanitizeRichText = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;

  const withoutTags = value.replace(/<[^>]*>/g, ' ');
  const decoded = decodeHtmlEntities(withoutTags);
  const compact = decoded.replace(/\s+/g, ' ').trim();

  return compact.length > 0 ? compact : null;
};

const extractInflectionTarget = (definitionMarkup: string): string | null => {
  if (!definitionMarkup || typeof definitionMarkup !== 'string') {
    return null;
  }

  if (!definitionMarkup.includes('form-of-definition')) {
    return null;
  }

  const targetMatch = definitionMarkup.match(/form-of-definition-link[^>]*>[^]*?href="\/wiki\/([^"#?]+)(?:#[^"]*)?"/);
  if (!targetMatch) {
    return null;
  }

  const decodedTarget = decodeURIComponent(targetMatch[1]).replace(/_/g, ' ').trim();
  if (!decodedTarget) {
    return null;
  }

  return decodedTarget;
};

// Try Wiktionary REST API (best lexical coverage, includes Hindi/Urdu)
const fetchFromWiktionary = async (word: string, visited = new Set<string>()): Promise<WordMeaning | null> => {
  if (visited.has(word)) {
    return null;
  }
  visited.add(word);

  try {
    const apiUrl = `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word)}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json() as Record<string, unknown>;
    const entries: Array<Record<string, unknown>> = [];

    for (const value of Object.values(data)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item && typeof item === 'object') {
            entries.push(item as Record<string, unknown>);
          }
        }
      }
    }

    const preferredEntry = entries.find(entry => {
      const language = entry.language;
      return typeof language === 'string' && (language === 'Hindi' || language === 'Urdu');
    }) || entries[0];

    if (!preferredEntry) {
      return null;
    }

    const definitions = Array.isArray(preferredEntry.definitions) ? preferredEntry.definitions as Array<Record<string, unknown>> : [];
    const firstDefinition = definitions.find(def => typeof def?.definition === 'string' && (def.definition as string).trim().length > 0);

    if (!firstDefinition) {
      return null;
    }

    const rawDefinition = typeof firstDefinition.definition === 'string' ? firstDefinition.definition : '';
    const definitionText = sanitizeRichText(rawDefinition) ?? rawDefinition.trim();

    if (!definitionText) {
      return null;
    }

    const examples = Array.isArray(firstDefinition.examples)
      ? (firstDefinition.examples as unknown[])
          .map(example => sanitizeRichText(example))
          .filter((example): example is string => Boolean(example))
      : undefined;

    const lemmaTarget = extractInflectionTarget(rawDefinition);
    if (lemmaTarget && lemmaTarget !== word) {
      const lemmaMeaning = await fetchFromWiktionary(lemmaTarget, visited);
      if (lemmaMeaning) {
        const inflectionNote = definitionText ? `Inflection: ${definitionText}` : undefined;
        const combinedExamples = inflectionNote
          ? [...(lemmaMeaning.examples ?? []), inflectionNote]
          : lemmaMeaning.examples;

        return {
          ...lemmaMeaning,
          word,
          examples: combinedExamples,
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
    console.log(`Wiktionary lookup failed for "${word}":`, error instanceof Error ? error.message : 'Unknown error');
  }
  return null;
};

// Try unofficial Google Dictionary API (works with Hindi/Urdu and has CORS support)
const fetchFromGoogleDictionary = async (word: string): Promise<WordMeaning | null> => {
  try {
    // Using unofficial Google Dictionary API through CORS-enabled endpoint
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/hi/${encodeURIComponent(word)}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const entry = data[0];
        const firstMeaning = entry.meanings?.[0];
        const definition = firstMeaning?.definitions?.[0];

        return {
          word: entry.word || word,
          meaning: definition?.definition || 'Definition found',
          partOfSpeech: firstMeaning?.partOfSpeech,
          examples: definition?.example ? [definition.example] : undefined,
          source: 'Dictionary API'
        };
      }
    }

    // Fallback: Try with English API for romanized Hindi words
    const romanApiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    const romanResponse = await fetch(romanApiUrl);

    if (romanResponse.ok) {
      const romanData = await romanResponse.json();

      if (Array.isArray(romanData) && romanData.length > 0) {
        const entry = romanData[0];
        const firstMeaning = entry.meanings?.[0];
        const definition = firstMeaning?.definitions?.[0];

        return {
          word: entry.word || word,
          meaning: definition?.definition || 'Definition found',
          partOfSpeech: firstMeaning?.partOfSpeech,
          examples: definition?.example ? [definition.example] : undefined,
          source: 'Dictionary API'
        };
      }
    }
  } catch (error) {
    console.log(`Google Dictionary lookup failed for "${word}":`, error instanceof Error ? error.message : 'Unknown error');
  }
  return null;
};

// Main function to fetch word meaning from multiple sources
export const fetchWordMeaning = async (word: string): Promise<DictionaryResponse> => {
  const cleaned = cleanWord(word);
  const trimmedOriginal = word.trim();
  const punctuationStripped = trimmedOriginal.replace(/[।,;:!?\-"'()[\]{}]/g, '').trim();
  const isRomanInput = /^[a-zA-Z]+$/.test(cleaned);

  const candidateSet = new Set<string>();

  if (!isRomanInput) {
    [trimmedOriginal, punctuationStripped, cleaned].forEach(candidate => {
      if (candidate.length > 0) {
        candidateSet.add(candidate);
      }
    });
  } else {
    const devCandidates = await getDevanagariCandidates(cleaned);
    devCandidates.forEach(candidate => {
      if (candidate) {
        candidateSet.add(candidate);
      }
    });
  }

  const lookupCandidates = Array.from(candidateSet);

  if (lookupCandidates.length === 0) {
    return {
      success: false,
      error: 'No meaning found for this word'
    };
  }
  
  if (!cleaned) {
    return {
      success: false,
      error: 'Invalid word provided'
    };
  }
  try {
    const staticDictionary = await getStaticDictionary();

    const getRuntimeCachedMeaning = (key: string): WordMeaning | null => {
      if (!key) return null;
      const entry = runtimeCache.get(key);
      if (!entry) return null;
      if (Date.now() - entry.timestamp > RUNTIME_CACHE_DURATION) {
        runtimeCache.delete(key);
        return null;
      }
      return entry.meaning;
    };

    const setRuntimeCachedMeaning = (key: string, meaning: WordMeaning): void => {
      if (!key) return;
      runtimeCache.set(key, { meaning, timestamp: Date.now() });
    };

    const getCachedMeaning = (candidate: string): WordMeaning | null => {
      const key = cleanWord(candidate);
      if (!key) return null;
      const runtimeHit = getRuntimeCachedMeaning(key);
      if (runtimeHit) return runtimeHit;
      const staticHit = staticDictionary[key];
      if (staticHit) {
        setRuntimeCachedMeaning(key, staticHit);
        return staticHit;
      }
      return null;
    };

    const directCacheHit = getCachedMeaning(word);
    if (directCacheHit) {
      if (cleaned !== cleanWord(directCacheHit.word)) {
        setRuntimeCachedMeaning(cleaned, directCacheHit);
      }
      return {
        success: true,
        data: directCacheHit
      };
    }

    // Try different sources in order of preference
    let meaning: WordMeaning | null = null;
    let resolvedCandidate: string | null = null;

    for (const candidate of lookupCandidates) {
      const cached = getCachedMeaning(candidate);
      if (cached) {
        if (cleaned !== cleanWord(candidate)) {
          setRuntimeCachedMeaning(cleaned, cached);
        }
        return {
          success: true,
          data: cached
        };
      }
    }

    // 1. Wiktionary REST API (try variants)
    for (const candidate of lookupCandidates) {
      meaning = await fetchFromWiktionary(candidate);
      if (meaning) {
        resolvedCandidate = candidate;
        break;
      }
    }

    if (!meaning) {
      for (const candidate of lookupCandidates) {
        meaning = await fetchFromGoogleDictionary(candidate);
        if (meaning) {
          resolvedCandidate = candidate;
          break;
        }
      }
    }

    if (!meaning) {
      for (const candidate of lookupCandidates) {
        const manual = getManualMeaning(candidate);
        if (manual) {
          meaning = manual;
          resolvedCandidate = candidate;
          break;
        }
      }
    }

    if (meaning) {
      const candidateKey = resolvedCandidate ? cleanWord(resolvedCandidate) : cleaned;
      setRuntimeCachedMeaning(candidateKey, meaning);
      setRuntimeCachedMeaning(cleaned, meaning);

      return {
        success: true,
        data: meaning
      };
    } else {
      return {
        success: false,
        error: 'No meaning found for this word'
      };
    }
  } catch (error) {
    console.error('Error fetching word meaning:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Utility function to clear old cache entries
export const clearOldCache = (): void => {
  const now = Date.now();
  for (const [key, entry] of runtimeCache.entries()) {
    if (now - entry.timestamp > RUNTIME_CACHE_DURATION) {
      runtimeCache.delete(key);
    }
  }
};

// Preload common words (optional optimization)
export const preloadCommonWords = async (words: string[]): Promise<void> => {
  const promises = words.map(word => fetchWordMeaning(word));
  await Promise.allSettled(promises);
};
