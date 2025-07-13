import type { FC, ReactNode } from 'react';
import { useState, useRef, useEffect } from 'react';
import { fetchWordMeaning, type WordMeaning } from '../lib/dictionary';

interface WordTooltipProps {
  word: string;
  children: ReactNode;
  className?: string;
}

const WordTooltip: FC<WordTooltipProps> = ({ 
  word, 
  children,
  className = ''
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [meaning, setMeaning] = useState<WordMeaning | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState({ top: true, left: 0 });

  // Prevent hydration errors by only rendering tooltip on client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Clean word for API lookup (remove punctuation, trim spaces)
  const cleanWord = word.trim().replace(/[।,;:!?\-"']/g, '');
  
  // Fetch word meaning from external API
  const fetchMeaning = async (targetWord: string) => {
    if (!targetWord || loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchWordMeaning(targetWord);
      
      if (result.success && result.data) {
        setMeaning(result.data);
      } else {
        setError(result.error || 'Failed to fetch meaning');
      }
    } catch (err) {
      console.error('Error fetching word meaning:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch meaning');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle word click
  const handleWordClick = () => {
    setShowTooltip(!showTooltip);
    
    // Only fetch if we don't have meaning and tooltip is being shown
    if (!meaning && !loading && !showTooltip) {
      fetchMeaning(cleanWord);
    }
  };
  
  // Update tooltip position based on space available
  useEffect(() => {
    if (showTooltip && tooltipRef.current && wordRef.current) {
      const wordRect = wordRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      // Check if tooltip would go off screen to the left or right
      const windowWidth = window.innerWidth;
      const center = wordRect.left + (wordRect.width / 2);
      const tooltipHalfWidth = tooltipRect.width / 2;
      
      // Adjust horizontal position to keep tooltip in view
      let leftOffset = 0;
      if (center - tooltipHalfWidth < 10) {
        leftOffset = (center - tooltipHalfWidth) - 10;
      } else if (center + tooltipHalfWidth > windowWidth - 10) {
        leftOffset = (center + tooltipHalfWidth) - (windowWidth - 10);
      }
      
      // Check if tooltip should appear above or below
      const spaceAbove = wordRect.top;
      const tooltipHeight = tooltipRect.height;
      const topPosition = spaceAbove > tooltipHeight + 20;
      
      setPosition({ 
        top: topPosition,
        left: -leftOffset
      });
    }
  }, [showTooltip, meaning, loading]);
  
  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node) &&
          wordRef.current && !wordRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <span style={{ display: 'inline', position: 'relative' }}>
      <span 
        ref={wordRef}
        className={`cursor-pointer hover:text-accent-light dark:hover:text-accent-dark transition-colors duration-200 ${className}`}
        onClick={handleWordClick}
        onMouseEnter={() => {
          if (meaning && !showTooltip) {
            setShowTooltip(true);
          }
        }}
        onMouseLeave={() => {
          if (meaning && showTooltip && !loading) {
            setShowTooltip(false);
          }
        }}
        title={cleanWord ? `Click for meaning of "${cleanWord}"` : undefined}
      >
        {children}
      </span>
      
      {showTooltip && isClient && (
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            zIndex: 50,
            width: 'max-content',
            maxWidth: '320px',
            [position.top ? 'bottom' : 'top']: '100%',
            left: '50%',
            transform: `translateX(-50%) translateX(${position.left}px) translateY(${position.top ? '-8px' : '8px'})`,
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'var(--tooltip-bg, #faf6f2)',
            color: 'var(--tooltip-text, #333)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            fontSize: '0.9rem',
            lineHeight: '1.5',
            textAlign: 'left',
            transition: 'all 0.2s cubic-bezier(0.23, 1, 0.32, 1)'
          }}
          className="dark:!bg-gray-800 dark:!text-gray-100 dark:border-gray-700"
        >
          {loading && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-accent-light dark:border-accent-dark border-t-transparent"></div>
              <span>Looking up meaning...</span>
            </div>
          )}
          
          {error && (
            <div className="text-amber-600 dark:text-amber-400">
              <div className="font-semibold mb-1">{cleanWord}</div>
              <div className="text-sm">
                {error === 'No meaning found for this word' 
                  ? 'Meaning not available in current dictionaries' 
                  : error}
              </div>
            </div>
          )}
          
          {meaning && !loading && (
            <div>
              <div 
                style={{ 
                  fontWeight: 600,
                  marginBottom: '6px', 
                  color: 'var(--tooltip-heading, #333)',
                  letterSpacing: '0.01em'
                }} 
                className="dark:!text-white"
              >
                {meaning.word}
                {meaning.partOfSpeech && (
                  <span className="ml-2 text-xs px-2 py-1 bg-accent-light/20 dark:bg-accent-dark/20 rounded-full">
                    {meaning.partOfSpeech}
                  </span>
                )}
              </div>
              
              <div 
                style={{ 
                  color: 'var(--tooltip-text-secondary, rgba(0, 0, 0, 0.7))',
                  fontWeight: 400,
                  marginBottom: meaning.etymology || meaning.examples ? '8px' : '0'
                }} 
                className="dark:!text-gray-300"
              >
                {meaning.meaning}
              </div>
              
              {meaning.etymology && (
                <div 
                  style={{ 
                    fontSize: '0.8rem',
                    color: 'var(--tooltip-text-secondary, rgba(0, 0, 0, 0.6))',
                    fontStyle: 'italic',
                    marginBottom: meaning.examples ? '6px' : '0'
                  }}
                  className="dark:!text-gray-400"
                >
                  Etymology: {meaning.etymology}
                </div>
              )}
              
              {meaning.examples && meaning.examples.length > 0 && (
                <div 
                  style={{ 
                    fontSize: '0.8rem',
                    color: 'var(--tooltip-text-secondary, rgba(0, 0, 0, 0.6))'
                  }}
                  className="dark:!text-gray-400"
                >
                  <div className="font-medium mb-1">Examples:</div>
                  {meaning.examples.slice(0, 2).map((example, index) => (
                    <div key={index} className="mb-1">• {example}</div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {!meaning && !loading && !error && (
            <div>
              <div 
                style={{ 
                  fontWeight: 600,
                  marginBottom: '4px', 
                  color: 'var(--tooltip-heading, #333)'
                }} 
                className="dark:!text-white"
              >
                {cleanWord}
              </div>
              <div 
                style={{ 
                  color: 'var(--tooltip-text-secondary, rgba(0, 0, 0, 0.7))',
                  fontSize: '0.85rem'
                }} 
                className="dark:!text-gray-300"
              >
                Click to look up meaning
              </div>
            </div>
          )}
          
          {/* Tooltip arrow */}
          <div 
            style={{
              position: 'absolute',
              width: '12px',
              height: '12px',
              backgroundColor: 'var(--tooltip-bg, #faf6f2)',
              transform: 'rotate(45deg)',
              [position.top ? 'bottom' : 'top']: '-6px',
              left: `calc(50% - ${position.left}px)`,
              marginLeft: '-6px',
              borderRight: position.top ? 'none' : '1px solid rgba(0, 0, 0, 0.08)',
              borderBottom: position.top ? 'none' : '1px solid rgba(0, 0, 0, 0.08)',
              borderLeft: position.top ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
              borderTop: position.top ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.23, 1, 0.32, 1)'
            }}
            className="dark:!bg-gray-800 dark:border-gray-700"
          ></div>
        </div>
      )}
    </span>
  );
};

export default WordTooltip;