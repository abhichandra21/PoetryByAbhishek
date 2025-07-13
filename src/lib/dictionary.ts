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

// Fallback to Free Dictionary API (English definitions)
const fetchFromFreeDictionary = async (word: string): Promise<WordMeaning | null> => {
  try {
    // Use proxy in development, direct API in production
    const isDev = import.meta.env.DEV;
    const apiUrl = isDev 
      ? `/api/dictionary/${encodeURIComponent(word)}`
      : `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) throw new Error('Free Dictionary API failed');

    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      const entry = data[0];
      const firstMeaning = entry.meanings?.[0];
      const definition = firstMeaning?.definitions?.[0];
      
      return {
        word: entry.word,
        meaning: definition?.definition || 'No definition available',
        etymology: entry.etymology || undefined,
        examples: definition?.example ? [definition.example] : undefined,
        partOfSpeech: firstMeaning?.partOfSpeech,
        source: 'Free Dictionary API'
      };
    }
  } catch (error) {
    console.warn('Free Dictionary API failed:', error);
  }
  return null;
};

// Basic dictionary for common Hindi/Urdu words (fallback)
const basicHindiUrduDictionary: Record<string, WordMeaning> = {
  // Core emotional words
  'दिल': { word: 'दिल', meaning: 'heart, mind, soul', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'प्रेम': { word: 'प्रेम', meaning: 'love, affection', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'आँख': { word: 'आँख', meaning: 'eye', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'रात': { word: 'रात', meaning: 'night', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'सुबह': { word: 'सुबह', meaning: 'morning', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'ख़्वाब': { word: 'ख़्वाब', meaning: 'dream', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'याद': { word: 'याद', meaning: 'memory, remembrance', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'दर्द': { word: 'दर्द', meaning: 'pain, ache', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'ख़ुशी': { word: 'ख़ुशी', meaning: 'happiness, joy', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'ग़म': { word: 'ग़म', meaning: 'sorrow, grief', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  
  // Words from your poems
  'दुनियां': { word: 'दुनियां', meaning: 'world, universe', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'बातें': { word: 'बातें', meaning: 'talks, conversations, things', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'सपने': { word: 'सपने', meaning: 'dreams', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'रातें': { word: 'रातें', meaning: 'nights', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'गुज़री': { word: 'गुज़री', meaning: 'passed, went by', partOfSpeech: 'verb', source: 'Basic Dictionary' },
  'गुज़रे': { word: 'गुज़रे', meaning: 'passed, went by', partOfSpeech: 'verb', source: 'Basic Dictionary' },
  'दिन': { word: 'दिन', meaning: 'day', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'पल': { word: 'पल', meaning: 'moment, instant', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'खुशियों': { word: 'खुशियों', meaning: 'happiness, joys', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'कलियाँ': { word: 'कलियाँ', meaning: 'buds, young flowers', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'फूल': { word: 'फूल', meaning: 'flower', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'कांटे': { word: 'कांटे', meaning: 'thorns', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'जीवन': { word: 'जीवन', meaning: 'life', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'पथ': { word: 'पथ', meaning: 'path, way', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'यादें': { word: 'यादें', meaning: 'memories', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'हार': { word: 'हार', meaning: 'garland, necklace; defeat', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'हालातों': { word: 'हालातों', meaning: 'conditions, circumstances', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'पलकें': { word: 'पलकें', meaning: 'eyelids', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'बूंदें': { word: 'बूंदें', meaning: 'drops (of rain)', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'बरसातें': { word: 'बरसातें', meaning: 'rainy seasons', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'घर': { word: 'घर', meaning: 'home, house', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'माँ': { word: 'माँ', meaning: 'mother', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'बहन': { word: 'बहन', meaning: 'sister', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'आवाज़': { word: 'आवाज़', meaning: 'voice, sound', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'नींद': { word: 'नींद', meaning: 'sleep', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'मेरी': { word: 'मेरी', meaning: 'my, mine (feminine)', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'मेरा': { word: 'मेरा', meaning: 'my, mine (masculine)', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'तेरी': { word: 'तेरी', meaning: 'your, yours (feminine)', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'तेरा': { word: 'तेरा', meaning: 'your, yours (masculine)', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'कैसा': { word: 'कैसा', meaning: 'how, what kind of', partOfSpeech: 'adverb', source: 'Basic Dictionary' },
  'कैसी': { word: 'कैसी', meaning: 'how, what kind of (feminine)', partOfSpeech: 'adverb', source: 'Basic Dictionary' },
  'रहा': { word: 'रहा', meaning: 'was, remained', partOfSpeech: 'verb', source: 'Basic Dictionary' },
  'आज': { word: 'आज', meaning: 'today', partOfSpeech: 'adverb', source: 'Basic Dictionary' },
  'ढल': { word: 'ढल', meaning: 'slope, decline', partOfSpeech: 'verb', source: 'Basic Dictionary' },
  'जाएगी': { word: 'जाएगी', meaning: 'will go (feminine)', partOfSpeech: 'verb', source: 'Basic Dictionary' },
  'सौ': { word: 'सौ', meaning: 'hundred', partOfSpeech: 'number', source: 'Basic Dictionary' },
  'कुछ': { word: 'कुछ', meaning: 'some, something', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'और': { word: 'और', meaning: 'and, more', partOfSpeech: 'conjunction', source: 'Basic Dictionary' },
  'भी': { word: 'भी', meaning: 'also, too', partOfSpeech: 'particle', source: 'Basic Dictionary' },
  'में': { word: 'में', meaning: 'in, within', partOfSpeech: 'postposition', source: 'Basic Dictionary' },
  'पर': { word: 'पर', meaning: 'on, at, but', partOfSpeech: 'postposition', source: 'Basic Dictionary' },
  'से': { word: 'से', meaning: 'from, with, by', partOfSpeech: 'postposition', source: 'Basic Dictionary' },
  'को': { word: 'को', meaning: 'to, for (object marker)', partOfSpeech: 'postposition', source: 'Basic Dictionary' },
  'का': { word: 'का', meaning: 'of, belonging to (masculine)', partOfSpeech: 'postposition', source: 'Basic Dictionary' },
  'की': { word: 'की', meaning: 'of, belonging to (feminine)', partOfSpeech: 'postposition', source: 'Basic Dictionary' },
  'के': { word: 'के', meaning: 'of, belonging to (oblique)', partOfSpeech: 'postposition', source: 'Basic Dictionary' },
  'हैं': { word: 'हैं', meaning: 'are, is (plural)', partOfSpeech: 'verb', source: 'Basic Dictionary' },
  'है': { word: 'है', meaning: 'is, are', partOfSpeech: 'verb', source: 'Basic Dictionary' },
  'था': { word: 'था', meaning: 'was (masculine)', partOfSpeech: 'verb', source: 'Basic Dictionary' },
  'थी': { word: 'थी', meaning: 'was (feminine)', partOfSpeech: 'verb', source: 'Basic Dictionary' },
  'थे': { word: 'थे', meaning: 'were (plural)', partOfSpeech: 'verb', source: 'Basic Dictionary' },
  'हम': { word: 'हम', meaning: 'we, us', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'तुम': { word: 'तुम', meaning: 'you', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'वो': { word: 'वो', meaning: 'that, he/she/it', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'यह': { word: 'यह', meaning: 'this', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'ये': { word: 'ये', meaning: 'these', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'जो': { word: 'जो', meaning: 'who, which, that', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'बात': { word: 'बात', meaning: 'matter, thing, talk', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'क्या': { word: 'क्या', meaning: 'what', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'कौन': { word: 'कौन', meaning: 'who', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'कहाँ': { word: 'कहाँ', meaning: 'where', partOfSpeech: 'adverb', source: 'Basic Dictionary' },
  'कब': { word: 'कब', meaning: 'when', partOfSpeech: 'adverb', source: 'Basic Dictionary' },
  'क्यों': { word: 'क्यों', meaning: 'why', partOfSpeech: 'adverb', source: 'Basic Dictionary' },
  'अब': { word: 'अब', meaning: 'now', partOfSpeech: 'adverb', source: 'Basic Dictionary' },
  'तो': { word: 'तो', meaning: 'then, so', partOfSpeech: 'particle', source: 'Basic Dictionary' },
  'फिर': { word: 'फिर', meaning: 'again, then', partOfSpeech: 'adverb', source: 'Basic Dictionary' },
  'जगाए': { word: 'जगाए', meaning: 'wake up, awaken', partOfSpeech: 'verb', source: 'Basic Dictionary' },
  'ना': { word: 'ना', meaning: 'no, not', partOfSpeech: 'particle', source: 'Basic Dictionary' },
  'नहीं': { word: 'नहीं', meaning: 'no, not', partOfSpeech: 'particle', source: 'Basic Dictionary' },
  'कोई': { word: 'कोई', meaning: 'someone, anyone, any', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  
  // Romanized versions
  'ishq': { word: 'ishq', meaning: 'passionate love, divine love', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'mohabbat': { word: 'mohabbat', meaning: 'love, affection', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'dil': { word: 'dil', meaning: 'heart, mind, soul', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'raat': { word: 'raat', meaning: 'night', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'subah': { word: 'subah', meaning: 'morning', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'khwab': { word: 'khwab', meaning: 'dream', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'yaad': { word: 'yaad', meaning: 'memory, remembrance', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'dard': { word: 'dard', meaning: 'pain, ache', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'khushi': { word: 'khushi', meaning: 'happiness, joy', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'gham': { word: 'gham', meaning: 'sorrow, grief', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'duniyaan': { word: 'duniyaan', meaning: 'world, universe', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'baaten': { word: 'baaten', meaning: 'talks, conversations, things', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'sapane': { word: 'sapane', meaning: 'dreams', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'raaten': { word: 'raaten', meaning: 'nights', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'ghar': { word: 'ghar', meaning: 'home, house', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'maa': { word: 'maa', meaning: 'mother', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'behan': { word: 'behan', meaning: 'sister', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'aawaz': { word: 'aawaz', meaning: 'voice, sound', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'neend': { word: 'neend', meaning: 'sleep', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'meri': { word: 'meri', meaning: 'my, mine (feminine)', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'mera': { word: 'mera', meaning: 'my, mine (masculine)', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'teri': { word: 'teri', meaning: 'your, yours (feminine)', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'tera': { word: 'tera', meaning: 'your, yours (masculine)', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'kaisa': { word: 'kaisa', meaning: 'how, what kind of', partOfSpeech: 'adverb', source: 'Basic Dictionary' },
  'kaisi': { word: 'kaisi', meaning: 'how, what kind of (feminine)', partOfSpeech: 'adverb', source: 'Basic Dictionary' },
  'din': { word: 'din', meaning: 'day', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'aaj': { word: 'aaj', meaning: 'today', partOfSpeech: 'adverb', source: 'Basic Dictionary' },
  'sau': { word: 'sau', meaning: 'hundred', partOfSpeech: 'number', source: 'Basic Dictionary' },
  'kuch': { word: 'kuch', meaning: 'some, something', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'aur': { word: 'aur', meaning: 'and, more', partOfSpeech: 'conjunction', source: 'Basic Dictionary' },
  'bhi': { word: 'bhi', meaning: 'also, too', partOfSpeech: 'particle', source: 'Basic Dictionary' },
  'men': { word: 'men', meaning: 'in, within', partOfSpeech: 'postposition', source: 'Basic Dictionary' },
  'par': { word: 'par', meaning: 'on, at, but', partOfSpeech: 'postposition', source: 'Basic Dictionary' },
  'se': { word: 'se', meaning: 'from, with, by', partOfSpeech: 'postposition', source: 'Basic Dictionary' },
  'ko': { word: 'ko', meaning: 'to, for (object marker)', partOfSpeech: 'postposition', source: 'Basic Dictionary' },
  'ka': { word: 'ka', meaning: 'of, belonging to (masculine)', partOfSpeech: 'postposition', source: 'Basic Dictionary' },
  'ki': { word: 'ki', meaning: 'of, belonging to (feminine)', partOfSpeech: 'postposition', source: 'Basic Dictionary' },
  'ke': { word: 'ke', meaning: 'of, belonging to (oblique)', partOfSpeech: 'postposition', source: 'Basic Dictionary' },
  'hain': { word: 'hain', meaning: 'are, is (plural)', partOfSpeech: 'verb', source: 'Basic Dictionary' },
  'hai': { word: 'hai', meaning: 'is, are', partOfSpeech: 'verb', source: 'Basic Dictionary' },
  'tha': { word: 'tha', meaning: 'was (masculine)', partOfSpeech: 'verb', source: 'Basic Dictionary' },
  'thi': { word: 'thi', meaning: 'was (feminine)', partOfSpeech: 'verb', source: 'Basic Dictionary' },
  'the': { word: 'the', meaning: 'were (plural)', partOfSpeech: 'verb', source: 'Basic Dictionary' },
  'ham': { word: 'ham', meaning: 'we, us', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'tum': { word: 'tum', meaning: 'you', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'vo': { word: 'vo', meaning: 'that, he/she/it', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'yah': { word: 'yah', meaning: 'this', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'ye': { word: 'ye', meaning: 'these', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'jo': { word: 'jo', meaning: 'who, which, that', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'baat': { word: 'baat', meaning: 'matter, thing, talk', partOfSpeech: 'noun', source: 'Basic Dictionary' },
  'kya': { word: 'kya', meaning: 'what', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'kaun': { word: 'kaun', meaning: 'who', partOfSpeech: 'pronoun', source: 'Basic Dictionary' },
  'kahan': { word: 'kahan', meaning: 'where', partOfSpeech: 'adverb', source: 'Basic Dictionary' },
  'kab': { word: 'kab', meaning: 'when', partOfSpeech: 'adverb', source: 'Basic Dictionary' },
  'kyon': { word: 'kyon', meaning: 'why', partOfSpeech: 'adverb', source: 'Basic Dictionary' },
  'ab': { word: 'ab', meaning: 'now', partOfSpeech: 'adverb', source: 'Basic Dictionary' },
  'to': { word: 'to', meaning: 'then, so', partOfSpeech: 'particle', source: 'Basic Dictionary' },
  'phir': { word: 'phir', meaning: 'again, then', partOfSpeech: 'adverb', source: 'Basic Dictionary' },
  'na': { word: 'na', meaning: 'no, not', partOfSpeech: 'particle', source: 'Basic Dictionary' },
  'nahin': { word: 'nahin', meaning: 'no, not', partOfSpeech: 'particle', source: 'Basic Dictionary' },
  'koi': { word: 'koi', meaning: 'someone, anyone, any', partOfSpeech: 'pronoun', source: 'Basic Dictionary' }
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

    // 1. Try basic dictionary first (instant results for common words)
    meaning = await fetchFromBasicDictionary(cleaned);

    // 2. Try Rekhta Dictionary via proxy (best for Hindi/Urdu poetry)
    if (!meaning) {
      meaning = await fetchFromRekhta(cleaned);
    }

    // 3. Try Free Dictionary API (good for English words)
    if (!meaning) {
      meaning = await fetchFromFreeDictionary(cleaned);
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