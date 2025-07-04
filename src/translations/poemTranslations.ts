// src/translations/poemTranslations.ts

// Type for a word with translations in both scripts
export interface WordTranslation {
  meaning: string;
  roman?: string; // Optional romanized version
}

// Type for a dictionary of translations
export type TranslationDictionary = Record<string, WordTranslation>;

  // Single dictionary for all poem translations
  export const allPoemsTranslations: TranslationDictionary = {
    // Poem 1
    "संजोये": { meaning: "cherished", roman: "sanjoye" },
    "पिरोए": { meaning: "strung together", roman: "piroe" },
    "हालातों": { meaning: "situations", roman: "haalaaton" },

    // Poem 2
    "तना-तनी": { meaning: "tension, struggle", roman: "tanaa-tanii" },
    "दुहराये": { meaning: "repeat", roman: "duhraaye" },
    "सागर अथाह": { meaning: "endless ocean", roman: "saagar athaah" },
    "निर्झर": { meaning: "spring, waterfall", roman: "nirjhar" },
    "निष्प्राण": { meaning: "lifeless, without spirit", roman: "nishpraaN" },
    "उजियाले": { meaning: "light, brightness", roman: "ujiyaale" },
    "ज़ंजीरें": { meaning: "chains", roman: "zanjiiren" },

    // Poem 3
    "सब्र": { meaning: "patience", roman: "sabr" },
    "हर्फ़": { meaning: "letter, word", roman: "harf" },
    "गूंजते": { meaning: "echoing", roman: "goonjate" },
    "बेशक": { meaning: "indeed, no doubt", roman: "beshak" },
    "चली पुरवाई": { meaning: "gentle breeze of the east (associated with memories)", roman: "chalii puravaaii" },
    "धुँध": { meaning: "fog, haze", roman: "dhundh" },
    "लम्हा": { meaning: "moment", roman: "lamhaa" },
    "फ़ासले": { meaning: "distances", roman: "faasale" },
    "दरम्यान": { meaning: "between", roman: "daramyaan" },

    // Poem 4
    "ख़्वाब": { meaning: "dream", roman: "khvaab" },
    "चैन": { meaning: "peace, tranquility", roman: "chain" },
    "पहर": { meaning: "period of time, watch (of day/night)", roman: "pahar" },
    "दौर-ए-तन्हा": { meaning: "era/period of loneliness", roman: "daur-e-tanhaa" },
    "हमबशर": { meaning: "fellow human being, companion", roman: "hambashar" },
    "मुज़्तर": { meaning: "restless, distressed", roman: "muzstar" },
    "शज़र": { meaning: "tree", roman: "shazar" },
    "चराग़-ए-उम्मीद": { meaning: "lamp of hope", roman: "charaag-e-ummiid" },
    "आँधियों": { meaning: "storms", roman: "aandhiyon" },
    "ख्वाहिशों": { meaning: "desires", roman: "khvaahishon" },
    "जान-ओ-दौलत": { meaning: "life and wealth", roman: "jaan-o-daulat" },
    "कूचा": { meaning: "street, lane", roman: "koochaa" },
    "रहगुज़र": { meaning: "path, way, road", roman: "rahaguzar" },
    "जानिब": { meaning: "towards, in the direction of", roman: "jaanib" },

    // Poem 5
    "चौखट": { meaning: "threshold", roman: "chaukhat" },
    "गुज़री उम्र": { meaning: "passed age, past life", roman: "guzrii umr" },
    "क़िस्से": { meaning: "stories", roman: "qisse" },
    "चंद बातों": { meaning: "a few matters/conversations", roman: "chand baaton" },
    "टीस": { meaning: "pang, ache", roman: "tiis" },

    // Poem 6
    "जगाए": { meaning: "awaken", roman: "jagaae" },
    "खामोशियाँ": { meaning: "silences", roman: "khaamoshiyaan" },
    "सुकून": { meaning: "peace, tranquility", roman: "sukoon" },
    "ज़ख़्म": { meaning: "wounds", roman: "zakhm" },
    "ज़हन": { meaning: "mind", roman: "zahan" },
    "निशां": { meaning: "marks/scars", roman: "nishaan" },
    "गुज़श्ता": { meaning: "past", roman: "guzashtaa" },
    "मुक़द्दर": { meaning: "destiny/fate", roman: "muqaddar" },
    "कार-ज़ार-ए-ज़िश्त": { meaning: "harsh/ugly battlefield of life", roman: "kaar-zaar-e-zisht" },
    "शम'-ए-उम्मीद": { meaning: "lamp of hope", roman: "sham'-e-ummiid" },
    "इमरोज़": { meaning: "today", roman: "imroz" },
    "बुझाए": { meaning: "extinguish", roman: "buzhaae" },

    // Poem 7
    "ढल जाएगी": { meaning: "will pass, will set", roman: "Dhal jaaegii" },
    "गुमनाम": { meaning: "unnamed, unknown", roman: "gumanaam" },
    "दस्तक": { meaning: "knock", roman: "dastak" },
    "मचल जाएगी": { meaning: "will stir, become restless", roman: "machal jaaegii" },
    "वीरानी": { meaning: "desolation, emptiness", roman: "viiraanii" },
    "रवानी": { meaning: "flow", roman: "ravaanii" },
    "बिखर जाएँगे": { meaning: "will scatter", roman: "bikhar jaaenge" },
    "तक़दीर": { meaning: "destiny, fate", roman: "taqdiir" },

    // Poem 8
    "कसक": { meaning: "pang, ache, yearning", roman: "kasak" },
    "आहट": { meaning: "sound of footsteps, presence", roman: "aahat" },
    "शम्मा": { meaning: "lamp", roman: "shammaa" },
    "तनहाइयों": { meaning: "loneliness", roman: "tanhaaiyon" },
    "आग़ाज़": { meaning: "beginning", roman: "aagaaz" },

    // Poem 9
    "परस्पर": { meaning: "mutually, with each other", roman: "paraspar" },
    "चंद": { meaning: "a few", roman: "chand" },
    "सिरहाने": { meaning: "by the head (bedside)", roman: "sirahaane" },
    "लॉ": { meaning: "flame (of a lamp/desire)", roman: "lau" },

    // Poem 10
    "ख़याल": { meaning: "thought", roman: "khayaal" },
    "मलाल": { meaning: "regret", roman: "malaal" },
    "सवाल": { meaning: "question", roman: "savaal" },
    "चाक-ए-दिल": { meaning: "wounded/torn heart", roman: "chaak-e-dil" },
    "जमाल": { meaning: "beauty", roman: "jamaal" },
    "अल्फ़ाज़": { meaning: "words", roman: "alfaaz" },
    "एहसास": { meaning: "feeling, sense", roman: "ehasaas" },
    "देरीना": { meaning: "long-held, old", roman: "deriina" },
    "सहरा": { meaning: "desert, waste, wilderness", roman: "sahraa" },

    // Poem 11
    "फ़ज़ा": { meaning: "ambience", roman: "fazaa" },
    "दरख़्तों": { meaning: "trees", roman: "daraKto.n" },
    "सिहरता": { meaning: "shivered", roman: "siharta" },
    "नक़्श-ए-क़दम": { meaning: "footprints/footsteps", roman: "naqsh-e-qadam" },
    "मंज़र": { meaning: "spectacle, a scene, view", roman: "ma.nzar" },
    "साहिल": { meaning: "the sea-shore, beach, coast", roman: "saahil" },
    "फ़क़त": { meaning: "merely, simply, only", roman: "faqat" },

    // Poem 12
    "तसव्वुर": { meaning: "imagination, fancy", roman: "tasavvur" },

    // Poem 16
    "तह": { meaning: "layer, fold", roman: "teh" },
    "रंजिशें": { meaning: "grievances, resentments", roman: "ranjishein" },

    // Poem 17
    "बा-कमाल": { meaning: "wonderful, excellent", roman: "ba-kamaal" },
    "हिज्र": { meaning: "separation (from a lover)", roman: "hijr" },
    "मयस्सर": { meaning: "available, obtainable", roman: "mayassar" },
    "बा'द-ए-विसाल": { meaning: "after the union", roman: "ba'ad-e-visaal" },
    "रिवायत": { meaning: "tradition, custom", roman: "riwaayat" },
    "उसूलों": { meaning: "principles", roman: "usoolon" },
    "पाएमाल": { meaning: "trampled, ruined", roman: "paayemaal" },
    "ताउम्र": { meaning: "lifelong", roman: "ta-umr" },
    "मिसाल": { meaning: "example", roman: "misaal" },
    "नक़्स-ए-कमाल": { meaning: "flaw in perfection", roman: "naqs-e-kamaal" },
    "पुर-अमन": { meaning: "peaceful", roman: "pur-aman" },
    "शहर-ए-वबाल": { meaning: "city of calamity/affliction", roman: "sheher-e-wabaal" },
    "वक़्त-ए-रुख़सत": { meaning: "time of departure", roman: "waqt-e-rukhsat" },
    "बयाँ": { meaning: "narration, description", roman: "bayaan" },
    "अर्ज़-ए-हाल": { meaning: "statement of one's condition", roman: "arz-e-haal" },
    "इत्मीनान-ए-दिल": { meaning: "peace of heart, contentment", roman: "itminaan-e-dil" },
    "बे-मलाल": { meaning: "without regret", roman: "be-malaal" },
  };

// Create a reverse mapping from Roman to Devanagari
export const romanToDevanagariMap: Record<string, string> = {};

// Populate the reverse mapping
Object.entries(allPoemsTranslations).forEach(([devWord, translation]) => {
  if (translation.roman) {
    romanToDevanagariMap[translation.roman] = devWord;
  }
});

// Export the dictionaries
export default allPoemsTranslations;
