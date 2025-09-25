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
    .replace(/\s+/g, '') // Remove all spaces
    .replace(/़/g, '') // Remove nukta (optional diacritic)
    .replace(/ँ/g, '') // Remove chandrabindu (optional)
    .replace(/ं/g, '') // Remove anusvara (optional)
    .replace(/्/g, ''); // Remove virama (optional)
};

// Normalize word for better matching (try multiple variations)
const normalizeWord = (word: string): string[] => {
  const cleaned = cleanWord(word);
  const variations = [cleaned];
  
  // Add common variations
  if (cleaned.endsWith('ों')) {
    variations.push(cleaned.slice(0, -2)); // Remove plural ending
    variations.push(cleaned.slice(0, -2) + 'ा'); // Try singular masculine
    variations.push(cleaned.slice(0, -2) + 'ी'); // Try singular feminine
  }
  
  if (cleaned.endsWith('ें')) {
    variations.push(cleaned.slice(0, -2)); // Remove plural ending
    variations.push(cleaned.slice(0, -2) + 'ा'); // Try singular
  }
  
  if (cleaned.endsWith('ी')) {
    variations.push(cleaned.slice(0, -1)); // Remove feminine ending
    variations.push(cleaned.slice(0, -1) + 'ा'); // Try masculine
  }
  
  if (cleaned.endsWith('ा')) {
    variations.push(cleaned.slice(0, -1)); // Remove masculine ending
    variations.push(cleaned.slice(0, -1) + 'ी'); // Try feminine
  }
  
  if (cleaned.endsWith('े')) {
    variations.push(cleaned.slice(0, -1)); // Remove oblique ending
    variations.push(cleaned.slice(0, -1) + 'ा'); // Try direct
  }
  
  return [...new Set(variations)]; // Remove duplicates
};

// Check if cached result is still valid
const isCacheValid = (word: string): boolean => {
  const timestamp = cacheTimestamps.get(word);
  if (!timestamp) return false;
  return Date.now() - timestamp < CACHE_DURATION;
};

// Try Rekhta Dictionary API via proxy (best for Urdu/Hindi poetry)
const fetchFromRekhta = async (word: string): Promise<WordMeaning | null> => {
  try {
    // Check if proxy server is available (you can deploy rekhta-proxy.js)
    const proxyUrl = process.env.REACT_APP_REKHTA_PROXY_URL || 'http://localhost:3001';
    
    const response = await fetch(`${proxyUrl}/api/rekhta/${encodeURIComponent(word)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Rekhta proxy responded with status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success && result.data) {
      return result.data;
    } else {
      console.log(`No Rekhta meaning found for "${word}"`);
      return null;
    }

  } catch (error) {
    // Silently fail if proxy is not available
    console.log(`Rekhta proxy not available for "${word}":`, error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
};

// Note: Removed English-only dictionary APIs (Wiktionary, Free Dictionary)
// since all searches will be for Hindi/Urdu words

// Basic dictionary for complex Hindi/Urdu poetry words only
const basicHindiUrduDictionary: Record<string, WordMeaning> = {
  // Complex poetic and literary words only
  // Complex literary and poetic words
  'ख़्वाब': { word: 'ख़्वाब', meaning: 'dream', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'ग़म': { word: 'ग़म', meaning: 'sorrow, grief', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'कलियाँ': { word: 'कलियाँ', meaning: 'buds, young flowers', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'कांटे': { word: 'कांटे', meaning: 'thorns', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'पथ': { word: 'पथ', meaning: 'path, way', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'हार': { word: 'हार', meaning: 'garland, necklace; defeat', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'हालातों': { word: 'हालातों', meaning: 'conditions, circumstances', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'पलकें': { word: 'पलकें', meaning: 'eyelids', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'बूंदें': { word: 'बूंदें', meaning: 'drops (of rain)', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'बरसातें': { word: 'बरसातें', meaning: 'rainy seasons', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'आवाज़': { word: 'आवाज़', meaning: 'voice, sound', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'ढल': { word: 'ढल', meaning: 'slope, decline', partOfSpeech: 'verb', source: 'Basic Dictionary' },
  'जगाए': { word: 'जगाए', meaning: 'wake up, awaken', partOfSpeech: 'verb', source: 'Basic Dictionary' },
  
  // Complex poetic and literary terms (Romanized)
  'ishq': { word: 'ishq', meaning: 'passionate love, divine love', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'mohabbat': { word: 'mohabbat', meaning: 'love, affection', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'khwab': { word: 'khwab', meaning: 'dream', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'gham': { word: 'gham', meaning: 'sorrow, grief', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'chandan': { word: 'chandan', meaning: 'sandalwood', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'gulab': { word: 'gulab', meaning: 'rose', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'chameli': { word: 'chameli', meaning: 'jasmine', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'chandni': { word: 'chandni', meaning: 'moonlight', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'sitara': { word: 'sitara', meaning: 'star', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'sitare': { word: 'sitare', meaning: 'stars', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'saawan': { word: 'saawan', meaning: 'monsoon season', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'basant': { word: 'basant', meaning: 'spring season', partOfSpeech: 'noun', source: 'Basic Dictionary' },

  // Additional complex literary terms
  'nazm': { word: 'nazm', meaning: 'poem, verse', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'ghazal': { word: 'ghazal', meaning: 'lyrical poetry form', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'sher': { word: 'sher', meaning: 'couplet, verse', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'matla': { word: 'matla', meaning: 'opening couplet of ghazal', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'maqta': { word: 'maqta', meaning: 'final couplet containing poet\'s name', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'husn': { word: 'husn', meaning: 'beauty', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'junoon': { word: 'junoon', meaning: 'passion, madness', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'intezaar': { word: 'intezaar', meaning: 'waiting, anticipation', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'tanhai': { word: 'tanhai', meaning: 'solitude, loneliness', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'viraag': { word: 'viraag', meaning: 'detachment, separation', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'viraha': { word: 'viraha', meaning: 'separation from beloved', partOfSpeech: 'noun', source: 'Basic Dictionary' }
};

// Try basic dictionary lookup (for common Hindi/Urdu words)
const fetchFromBasicDictionary = async (word: string): Promise<WordMeaning | null> => {
  // Try multiple variations of the word
  const variations = normalizeWord(word);
  
  for (const variation of variations) {
    if (basicHindiUrduDictionary[variation]) {
      return {
        ...basicHindiUrduDictionary[variation],
        word: word // Keep the original word in the response
      };
    }
  }
  
  // Also try the original word as-is (in case it's already in the dictionary)
  const original = word.toLowerCase().trim();
  if (basicHindiUrduDictionary[original]) {
    return basicHindiUrduDictionary[original];
  }
  
  return null;
};

// Main function to fetch word meaning from multiple sources
export const fetchWordMeaning = async (word: string): Promise<DictionaryResponse> => {
  const cleaned = cleanWord(word);
  
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

    // 1. Try basic dictionary first (instant results for complex poetic words)
    meaning = await fetchFromBasicDictionary(cleaned);

    // 2. Try Rekhta Dictionary via proxy (best for Hindi/Urdu poetry)
    if (!meaning) {
      meaning = await fetchFromRekhta(cleaned);
    }

    // Note: Removed English-only dictionary APIs since all searches are Hindi/Urdu

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