// src/components/PoemPage.tsx
import type { FC } from 'react';
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { motion } from 'framer-motion';
import type { Poem } from '../types';
import ScriptToggle, { useScriptPreference } from './ScriptToggle';
import PoemComments from './PoemComments';

interface PoemPageProps {
  poem: Poem;
}

/* ───── Text‑size helpers ────────────────────────────────────── */
export type TextSize = 'small' | 'medium' | 'large' | 'xlarge';

const SIZE_BUTTONS: { size: TextSize; extraClass: string }[] = [
  { size: 'small', extraClass: 'text-sm' },
  { size: 'medium', extraClass: '' },
  { size: 'large', extraClass: 'text-lg' },
  { size: 'xlarge', extraClass: 'text-xl' },
];

/* ───── Share helpers ────────────────────────────────────────── */
type SharePlatform = 'twitter' | 'facebook' | 'whatsapp' | 'copy' | 'native';

const PoemPage: FC<PoemPageProps> = ({ poem }) => {
  const { script } = useScriptPreference();
  const [textSize, setTextSize] = useState<TextSize>('medium');
  const [showShareMenu, setShowShareMenu] = useState(false);

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

  const handleTextSizeChange = useCallback((size: TextSize) => {
    setTextSize(size);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredTextSize', size);
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
    if (script === 'romanized' && poem.romanizedLines) return poem.romanizedLines;
    if (script === 'translation' && poem.translatedLines) return poem.translatedLines;
    return poem.lines;
  }, [script, poem]);

  const displayTitle = useMemo(() => {
    if (script === 'romanized' && poem.romanizedTitle) return poem.romanizedTitle;
    if (script === 'translation' && poem.translatedTitle) return poem.translatedTitle;
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
        alert('Link copied to clipboard'); // swap for toast.success when ready
      } else if (platform !== 'native') {
        window.open(urls[platform], '_blank', 'noopener');
      }
      setShowShareMenu(false);
    },
    [displayTitle, displayLines, canNativeShare],
  );

  /* ── print handler ────────────────────────────────────────── */
  const handlePrint = useCallback(() => {
    if (typeof window !== 'undefined') window.print();
  }, []);

  /* ── framer‑motion variants ───────────────────────────────── */
  const lineVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' },
    }),
  };

  /* ────────────────── render ───────────────────────────────── */
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative max-w-4xl mx-auto"
    >
      {/* Controls bar */}
      <div className="flex flex-wrap gap-3 mb-6 items-center justify-between">
        <ScriptToggle />

        <div className="flex gap-2">
          {/* text‑size buttons */}
          <div className="flex bg-paper-accent dark:bg-paper-dark-accent rounded-lg p-1">
            {SIZE_BUTTONS.map(({ size, extraClass }) => (
              <button
                key={size}
                onClick={() => handleTextSizeChange(size)}
                className={`p-2 rounded ${extraClass} ${
                  textSize === size
                    ? 'bg-accent-light dark:bg-accent-dark text-paper-light dark:text-paper-dark'
                    : 'text-ink-light-secondary dark:text-ink-dark-secondary'
                }`}
                aria-label={`${size} text size`}
              >
                A
              </button>
            ))}
          </div>

          {/* print */}
          <button
            onClick={handlePrint}
            className="p-2 bg-paper-accent dark:bg-paper-dark-accent hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 rounded-lg transition-colors"
            aria-label="Print poem"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
          </button>

          {/* share */}
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2 bg-paper-accent dark:bg-paper-dark-accent hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 rounded-lg transition-colors"
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
                    className="w-full px-4 py-2 hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 text-left"
                    role="menuitem"
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
                {canNativeShare && (
                  <button
                    onClick={() => handleShare('native')}
                    className="w-full px-4 py-2 hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 text-left"
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

      {/* visual “book‑page” layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-paper-accent to-paper-light dark:from-paper-dark-accent dark:to-paper-dark rounded-xl shadow-book" />

      {/* main content box */}
      <div className="relative bg-paper-light dark:bg-paper-dark rounded-xl p-8 md:p-12 shadow-medium border border-ink-light/5 dark:border-ink-dark/5">
        {/* decorative corner */}
        <div className="absolute top-4 right-4 w-16 h-16 opacity-5 dark:opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M0,100 Q50,0 100,0 L100,100 Z" fill="currentColor" />
          </svg>
        </div>

        {/* title */}
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className={`${textSizeClass} font-bold mb-8 hindi text-accent-light dark:text-accent-dark relative`}
        >
          {displayTitle}
          <span className="absolute -bottom-2 left-0 w-16 h-0.5 bg-gradient-to-r from-accent-light dark:from-accent-dark to-transparent opacity-50" />
        </motion.h1>

        {/* lines */}
        <div className="space-y-4">
          {displayLines.map((line, i) => (
            <motion.p
              key={`${poem.id}-${i}`}
              custom={i}
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              className={`${textSizeClass} leading-loose text-ink-light dark:text-ink-dark indent-4 ${
                script === 'devanagari' ? 'hindi' : ''
              }`}
            >
              {line}
            </motion.p>
          ))}
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
                <span
                  key={tag}
                  className="px-3 py-1 text-xs rounded-full bg-sage-light/20 dark:bg-sage-dark/20 text-ink-light-secondary dark:text-ink-dark-secondary border border-sage-light/20 dark:border-sage-dark/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ) : null}

        {/* comments */}
        <PoemComments poemId={poem.id} />
      </div>

      {/* print‑specific overrides */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
