// src/components/PoemPage.tsx
import type { FC } from 'react';
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Poem } from '../types';
import ScriptToggle from './ScriptToggle';
import { useScriptPreference } from '../hooks/useScriptPreference';
import PoemComments from './PoemComments';
import PoemLike from './PoemLike'; // Add this import
import TranslationTooltip from './TranslationTooltip';
import WordTooltip from './WordTooltip';
import { Link } from 'react-router-dom';
import allPoemTranslations, { romanToDevanagariMap } from '../translations/poemTranslations';

interface PoemPageProps {
  poem: Poem;
}

/* ───── Text‑size helpers ────────────────────────────────────── */
export type TextSize = 'small' | 'medium' | 'large' | 'xlarge';

/* ───── Share helpers ────────────────────────────────────────── */
type SharePlatform = 'twitter' | 'facebook' | 'whatsapp' | 'copy' | 'native';

const PoemPage: FC<PoemPageProps> = ({ poem }) => {
  const { script } = useScriptPreference();
  const [textSize, setTextSize] = useState<TextSize>('medium');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showLookupHelp, setShowLookupHelp] = useState(false);
  const reduceMotion = useReducedMotion();

  /* ── persist text‑size preference ─────────────────────────── */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('preferredTextSize');
    if (
      saved &&
      ['small', 'medium', 'large', 'xlarge'].includes(saved)
    ) {
      setTextSize(saved as TextSize);
    }
  }, []);

  /* ── derived values ───────────────────────────────────────── */
  const textSizeClass = useMemo(() => {
    const map: Record<TextSize, string> = {
      small: 'text-base md:text-lg',
      medium: 'text-lg md:text-xl',
      large: 'text-xl md:text-2xl',
      xlarge: 'text-2xl md:text-3xl',
    };
    return map[textSize];
  }, [textSize]);

  const displayLines = useMemo(() => {
    if (script === 'roman' && poem.romanizedLines) return poem.romanizedLines;
    return poem.lines;
  }, [script, poem]);

  const displayTitle = useMemo(() => {
    if (script === 'roman' && poem.romanizedTitle) return poem.romanizedTitle;
    return poem.title;
  }, [script, poem]);

  /* ── native‑share capability check ────────────────────────── */
  const canNativeShare = useRef(
    typeof navigator !== 'undefined' &&
      typeof (navigator as Partial<Navigator>).share === 'function',
  ).current;

  /* ── share handler ────────────────────────────────────────── */
  const handleShare = useCallback(
    async (platform: SharePlatform) => {
      if (typeof window === 'undefined') return;

      const url = window.location.href;
      const text = `Check out this beautiful poem: ${displayTitle}`;

      if (platform === 'native' && canNativeShare) {
        try {
          await (navigator as Navigator).share({
            title: displayTitle,
            text: `${displayLines.slice(0, 4).join('\n')}…`,
            url,
          });
        } catch (err) {
          console.error('Error sharing:', err);
        }
        return;
      }

      const urls: Record<'twitter' | 'facebook' | 'whatsapp' | 'copy', string> = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text,
        )}&url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url,
        )}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
        copy: url,
      };

      if (platform === 'copy') {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard');
      } else if (platform !== 'native') {
        window.open(urls[platform], '_blank', 'noopener');
      }
      setShowShareMenu(false);
    },
    [displayTitle, displayLines, canNativeShare],
  );

  /* ── Add helper function to process line with translations ────── */
  const processLineWithTranslations = useCallback((line: string) => {
    // Get appropriate translations based on script
    const isRoman = script === 'roman';

    // If the line is empty, render a non-breaking space to preserve spacing
    if (line.trim() === "") return <span>&nbsp;</span>;

    // Find all words that need tooltips
    const wordsToReplace: Array<{
      word: string;
      translation: string;
      startIndex: number;
      endIndex: number;
    }> = [];

    if (isRoman) {
      // For Roman script, use the romanToDevanagariMap
      for (const romanWord in romanToDevanagariMap) {
        let startIndex = 0;
        let index: number;

        while ((index = line.toLowerCase().indexOf(romanWord.toLowerCase(), startIndex)) !== -1) {
          const devWord = romanToDevanagariMap[romanWord];
          const translation = allPoemTranslations[devWord];

          wordsToReplace.push({
            word: line.substring(index, index + romanWord.length), // Use original case from poem
            translation: translation.meaning,
            startIndex: index,
            endIndex: index + romanWord.length
          });
          startIndex = index + romanWord.length;
        }
      }
    } else {
      // For Devanagari script, use the direct mapping
      for (const devWord in allPoemTranslations) {
        let startIndex = 0;
        let index: number;

        while ((index = line.indexOf(devWord, startIndex)) !== -1) {
          wordsToReplace.push({
            word: devWord,
            translation: allPoemTranslations[devWord].meaning,
            startIndex: index,
            endIndex: index + devWord.length
          });
          startIndex = index + devWord.length;
        }
      }
    }

    // Sort by startIndex to process from left to right, but prioritize longer matches
    wordsToReplace.sort((a, b) => {
      if (a.startIndex !== b.startIndex) {
        return a.startIndex - b.startIndex;
      }
      // If same start position, prioritize longer word
      return b.word.length - a.word.length;
    });

    // Remove overlapping matches, keeping the longer/better ones
    const filteredWordsToReplace = [];
    for (let i = 0; i < wordsToReplace.length; i++) {
      const current = wordsToReplace[i];
      let isOverlapping = false;
      
      // Check if current word overlaps with any already accepted word
      for (const accepted of filteredWordsToReplace) {
        if (
          (current.startIndex >= accepted.startIndex && current.startIndex < accepted.endIndex) ||
          (current.endIndex > accepted.startIndex && current.endIndex <= accepted.endIndex) ||
          (current.startIndex <= accepted.startIndex && current.endIndex >= accepted.endIndex)
        ) {
          isOverlapping = true;
          break;
        }
      }
      
      if (!isOverlapping) {
        filteredWordsToReplace.push(current);
      }
    }

    // If no words to replace, return the original line
    if (filteredWordsToReplace.length === 0) {
      return <span>{line}</span>;
    }

    // Build result with tooltips
    const result: React.ReactNode[] = [];
    let lastIndex = 0;

    for (let i = 0; i < filteredWordsToReplace.length; i++) {
      const { word, translation, startIndex, endIndex } = filteredWordsToReplace[i];

      // Add text before this word
      if (startIndex > lastIndex) {
        result.push(<span key={`text-${i}`}>{line.substring(lastIndex, startIndex)}</span>);
      }

      // Add the word with a tooltip
      result.push(
        <TranslationTooltip
          key={`tooltip-${i}`}
          word={word}
          translation={translation}
        >
          {line.substring(startIndex, endIndex)}
        </TranslationTooltip>
      );

      lastIndex = endIndex;
    }

    // Add any remaining text
    if (lastIndex < line.length) {
      result.push(<span key="text-end">{line.substring(lastIndex)}</span>);
    }

    return <>{result}</>;
  }, [script]);

  /* ── Helper function to wrap remaining words with external dictionary tooltips ──── */
  const wrapWordsWithDictionaryTooltips = useCallback((content: React.ReactNode): React.ReactNode => {
    if (typeof content === 'string') {
      // Split by spaces and punctuation, but keep the delimiters
      const parts = content.split(/(\s+|[।,;:!?\-"'])/);
      
      return parts.map((part, index) => {
        // If it's whitespace or punctuation, return as is
        if (/^\s+$/.test(part) || /^[।,;:!?\-"']$/.test(part)) {
          return <span key={index}>{part}</span>;
        }
        
        // If it's a word, wrap it with WordTooltip
        if (part.trim() && !/^\s+$/.test(part)) {
          return (
            <WordTooltip key={index} word={part}>
              {part}
            </WordTooltip>
          );
        }
        
        return <span key={index}>{part}</span>;
      });
    }
    
    if (React.isValidElement(content)) {
      if (content.type === TranslationTooltip) {
        // Don't wrap TranslationTooltip children, they already have tooltips
        return content;
      }
      
      if (content.props && typeof content.props === 'object' && 'children' in content.props) {
        const props = content.props as { children: React.ReactNode };
        return React.cloneElement(content as React.ReactElement<{ children: React.ReactNode }>, {
          ...content.props,
          children: wrapWordsWithDictionaryTooltips(props.children)
        });
      }
    }
    
    if (Array.isArray(content)) {
      return content.map((child, index) => (
        <React.Fragment key={index}>
          {wrapWordsWithDictionaryTooltips(child)}
        </React.Fragment>
      ));
    }
    
    return content;
  }, []);

  /* ── Combined processing function ──── */
  const processLineWithAllTooltips = useCallback((line: string): React.ReactNode => {
    // First, process with internal translations
    const translationResult = processLineWithTranslations(line);
    
    // Then, wrap remaining words with external dictionary tooltips
    return wrapWordsWithDictionaryTooltips(translationResult);
  }, [processLineWithTranslations, wrapWordsWithDictionaryTooltips]);

  /* ── framer‑motion variants ───────────────────────────────── */
  const lineVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' },
    }),
  };

  /* ────────────────── render ───────────────────────────────── */
  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative max-w-4xl mx-auto"
    >
      {/* Controls bar */}
      <div className="flex flex-wrap gap-3 mb-6 items-center justify-between">
        <div className="flex items-center gap-3">
          <ScriptToggle />
          {/* Like button */}
          <PoemLike poemId={poem.id} className="scale-75" />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowLookupHelp((value) => !value)}
            className="p-2 bg-paper-accent dark:bg-paper-dark-accent hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 rounded-lg transition-colors w-11 h-11 flex items-center justify-center tap-target"
            aria-label="Toggle word-meaning help"
            aria-pressed={showLookupHelp}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9Z" />
              <path d="M12 8v4" />
              <path d="m12 16 .01-.01" />
            </svg>
          </button>

          {/* share */}
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2 bg-paper-accent dark:bg-paper-dark-accent hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 rounded-lg transition-colors w-11 h-11 flex items-center justify-center tap-target"
              aria-label="Share poem"
              aria-haspopup="menu"
              aria-expanded={showShareMenu}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>

            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute right-0 top-12 bg-paper-light dark:bg-paper-dark border border-ink-light/10 dark:border-ink-dark/10 rounded-lg shadow-lg py-2 z-50 min-w-[150px]"
                role="menu"
              >
                {(['twitter', 'facebook', 'whatsapp', 'copy'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => handleShare(p)}
                    className="w-full px-4 py-2 hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 text-left tap-target"
                    role="menuitem"
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
                {canNativeShare && (
                  <button
                    onClick={() => handleShare('native')}
                    className="w-full px-4 py-2 hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 text-left tap-target"
                    role="menuitem"
                  >
                    More…
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* visual "book‑page" layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-paper-accent to-paper-light dark:from-paper-dark-accent dark:to-paper-dark rounded-xl shadow-book -z-10" />

      {/* main content box */}
      <div className="relative bg-paper-light dark:bg-paper-dark rounded-xl p-6 md:p-12 shadow-medium border border-ink-light/10 dark:border-ink-dark/10">

        {/* Like button - positioned prominently at the top */}
        {/* Removed - now in controls bar */}

        {/* title */}
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className={`${textSizeClass} font-bold mb-8 hindi text-accent-light dark:text-accent-dark relative text-center`}
        >
          {displayTitle}
          <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-accent-light dark:from-accent-dark to-transparent opacity-50" />
        </motion.h1>

        {showLookupHelp && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-6 rounded-lg border border-accent-light/40 dark:border-accent-dark/40 bg-accent-light/10 dark:bg-accent-dark/10 p-4 text-sm text-ink-light-secondary dark:text-ink-dark-secondary"
          >
            <div className="flex flex-col gap-2">
              <span className="font-medium text-ink-light dark:text-ink-dark">Word meanings</span>
              <p className="leading-relaxed">
                Look for the dotted underline. Tap or click those words to see their meaning, related forms, and usage examples. Most entries are pulled straight from Wiktionary, so rare words may take a moment to appear.
              </p>
              <button
                onClick={() => setShowLookupHelp(false)}
                className="self-start text-xs font-medium text-accent-light dark:text-accent-dark hover:underline tap-target"
              >
                Got it
              </button>
            </div>
          </motion.div>
        )}

        {/* lines */}
        <div className="relative poem-content">
          <div className="relative">
            {displayLines.map((line, i) => {
              const trimmed = line.trim();
              const isBlank = trimmed.length === 0;
              const lineHeight = script === 'devanagari' ? '1.75rem' : '1.65rem';
              const marginBottom = isBlank ? '1rem' : '0.6rem';
              const indentClass = isBlank ? 'indent-0' : 'indent-4';

              return (
                <motion.div
                  key={`${poem.id}-${i}`}
                  custom={i}
                  variants={lineVariants}
                  initial="hidden"
                  animate="visible"
                  className={`${textSizeClass} text-ink-light dark:text-ink-dark ${
                    script === 'devanagari' ? 'hindi' : 'roman'
                  } ${indentClass}`}
                  style={{ lineHeight, marginBottom }}
                >
                  {isBlank ? <span>&nbsp;</span> : processLineWithAllTooltips(line)}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* tags */}
        {poem.tags?.length ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="mt-8 pt-6 border-t border-ink-light/10 dark:border-ink-dark/10"
          >
            <div className="flex flex-wrap gap-2">
              {poem.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 text-xs rounded-full bg-sage-light/20 dark:bg-sage-dark/20 text-ink-light-secondary dark:text-ink-dark-secondary border border-sage-light/20 dark:border-sage-dark/20 hover:bg-accent-light/20 dark:hover:bg-accent-dark/20"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </motion.div>
        ) : null}

        {/* comments */}
        <PoemComments poemId={poem.id} />
      </div>

      {/* Tooltip styling */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          :root {
            --tooltip-bg: #faf6f2;
            --tooltip-text: #333;
            --tooltip-text-secondary: rgba(0, 0, 0, 0.7);
            --tooltip-heading: #333;
            --tooltip-border: rgba(157, 106, 106, 0.6);
          }

          .dark {
            --tooltip-bg: #1e293b;
            --tooltip-text: #e5e7eb;
            --tooltip-text-secondary: #cbd5e1;
            --tooltip-heading: #f3f4f6;
            --tooltip-border: rgba(209, 154, 154, 0.6);
          }

          @media print {
            .no-print{display:none!important}
            article{box-shadow:none!important;margin:0!important;padding:20px!important;max-width:100%!important}
            .bg-gradient-to-br{display:none!important}
            .border{border:none!important}
          }`,
        }}
      />
    </motion.article>
  );
};

export default PoemPage;
