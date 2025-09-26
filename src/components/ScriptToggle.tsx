// src/components/ScriptToggle.tsx
import { useScriptPreference } from '../hooks/useScriptPreference';
import ActionTooltip from './ActionTooltip';

interface ScriptToggleProps {
  className?: string;
}

const ScriptToggle: React.FC<ScriptToggleProps> = ({ className = "" }) => {
  const { script, setScript } = useScriptPreference();
  
  const toggleScript = () => {
    setScript(script === 'devanagari' ? 'roman' : 'devanagari');
  };
  
  return (
    <div className={`relative ${className}`}>
      <ActionTooltip label={`Switch to ${script === 'devanagari' ? 'Roman script' : 'देवनागरी लिपि'}`}>
        <button
          onClick={toggleScript}
          className="flex items-center font-medium text-xs border border-ink-light/30 dark:border-ink-dark/30 rounded-full overflow-hidden transition-all duration-200 hover:border-accent-light dark:hover:border-accent-dark tap-target min-h-11"
          aria-label={`Switch to ${script === 'devanagari' ? 'Roman' : 'Devanagari'} script`}
        >
        {/* Icon container */}
        <span className="flex items-center justify-center bg-paper-accent dark:bg-paper-dark-accent w-6 h-6 rounded-full">
          {/* Rewind/replay icon */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-ink-light dark:text-ink-dark"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
            <path d="M16 21h5v-5"></path>
          </svg>
        </span>
        
        {/* Text label */}
        <span className={`px-2 py-1 text-ink-light-secondary dark:text-ink-dark-secondary`}>
          {script === 'devanagari' ? 'Roman' : 'देवनागरी'}
        </span>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default ScriptToggle;
