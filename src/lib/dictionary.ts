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

// Cache for word meanings to avoid repeated API calls
const meaningCache = new Map<string, WordMeaning>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
const cacheTimestamps = new Map<string, number>();

// Clean word for consistent caching and better matching
const cleanWord = (word: string): string => {
  return word.toLowerCase().trim()
    .replace(/[।,;:!?\-"'()[\]{}]/g, '') // Remove punctuation
    .replace(/\s+/g, ''); // Remove all spaces
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

// Check if cached result is still valid
const isCacheValid = (word: string): boolean => {
  const timestamp = cacheTimestamps.get(word);
  if (!timestamp) return false;
  return Date.now() - timestamp < CACHE_DURATION;
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
  const lookupCandidates = Array.from(new Set(
    [trimmedOriginal, punctuationStripped, cleaned].filter(candidate => candidate.length > 0),
  ));
  
  if (!cleaned) {
    return {
      success: false,
      error: 'Invalid word provided'
    };
  }

  // Check cache first
  if (meaningCache.has(cleaned) && isCacheValid(cleaned)) {
    return {
      success: true,
      data: meaningCache.get(cleaned)!
    };
  }

  try {
    // Try different sources in order of preference
    let meaning: WordMeaning | null = null;

    // 1. Wiktionary REST API (try variants)
    for (const candidate of lookupCandidates) {
      meaning = await fetchFromWiktionary(candidate);
      if (meaning) break;
    }

    if (!meaning) {
      for (const candidate of lookupCandidates) {
        meaning = await fetchFromGoogleDictionary(candidate);
        if (meaning) break;
      }
    }

    if (meaning) {
      // Cache the result
      meaningCache.set(cleaned, meaning);
      cacheTimestamps.set(cleaned, Date.now());

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
  for (const [word, timestamp] of cacheTimestamps.entries()) {
    if (now - timestamp > CACHE_DURATION) {
      meaningCache.delete(word);
      cacheTimestamps.delete(word);
    }
  }
};

// Preload common words (optional optimization)
export const preloadCommonWords = async (words: string[]): Promise<void> => {
  const promises = words.map(word => fetchWordMeaning(word));
  await Promise.allSettled(promises);
};
