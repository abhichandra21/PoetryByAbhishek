// src/components/TranslationTooltip.tsx
import type { FC, ReactNode } from 'react';
import { useState, useRef, useEffect } from 'react';

interface TranslationTooltipProps {
  word: string;
  translation: string;
  children: ReactNode;
}

const TranslationTooltip: FC<TranslationTooltipProps> = ({ 
  word, 
  translation, 
  children 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState({ top: true, left: 0 });
  
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
        // Too close to left edge
        leftOffset = (center - tooltipHalfWidth) - 10;
      } else if (center + tooltipHalfWidth > windowWidth - 10) {
        // Too close to right edge
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
  }, [showTooltip]);
  
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
        style={{
          borderBottom: '1px dotted',
          borderBottomColor: 'var(--tooltip-border, rgba(157, 106, 106, 0.6))',
          cursor: 'help',
          transition: 'all 0.2s ease'
        }}
        className="hover:text-accent-light dark:hover:text-accent-dark"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        {children}
      </span>
      
      {showTooltip && (
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            zIndex: 50,
            width: 'max-content',
            maxWidth: '280px',
            [position.top ? 'bottom' : 'top']: '100%',
            left: '50%',
            transform: `translateX(-50%) translateX(${position.left}px) translateY(${position.top ? '-8px' : '8px'})`,
            padding: '10px 14px',
            borderRadius: '8px',
            backgroundColor: 'var(--tooltip-bg, #faf6f2)',
            color: 'var(--tooltip-text, #333)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            fontSize: '0.9rem',
            lineHeight: '1.5',
            textAlign: 'left',
            transition: 'all 0.2s cubic-bezier(0.23, 1, 0.32, 1)'
          }}
          className="dark:!bg-gray-800 dark:!text-gray-100 dark:border-gray-700"
        >
          <div 
            style={{ 
              fontWeight: 600,
              marginBottom: '4px', 
              color: 'var(--tooltip-heading, #333)',
              letterSpacing: '0.01em'
            }} 
            className="dark:!text-white"
          >
            {word}
          </div>
          <div 
            style={{ 
              color: 'var(--tooltip-text-secondary, rgba(0, 0, 0, 0.7))',
              fontWeight: 400
            }} 
            className="dark:!text-gray-300"
          >
            {translation}
          </div>
          
          {/* Tooltip arrow - position depends on whether tooltip is above or below */}
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
              borderRight: position.top ? 'none' : '1px solid rgba(0, 0, 0, 0.06)',
              borderBottom: position.top ? 'none' : '1px solid rgba(0, 0, 0, 0.06)',
              borderLeft: position.top ? '1px solid rgba(0, 0, 0, 0.06)' : 'none',
              borderTop: position.top ? '1px solid rgba(0, 0, 0, 0.06)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.23, 1, 0.32, 1)'
            }}
            className="dark:!bg-gray-800 dark:border-gray-700"
          ></div>
        </div>
      )}
    </span>
  );
};

export default TranslationTooltip;