// src/components/ScriptToggle.tsx (updated)
import { motion } from 'framer-motion';
import { useScriptPreference } from './ScriptPreference'; // Updated import

interface ScriptToggleProps {
  className?: string;
}

const ScriptToggle: React.FC<ScriptToggleProps> = ({ className = "" }) => {
  const { script, setScript } = useScriptPreference(); // Use the context
  
  const scripts = [
    { value: 'devanagari' as const, label: 'हिं', fullLabel: 'देवनागरी' },
    { value: 'romanized' as const, label: 'Ro', fullLabel: 'Romanized' },
    { value: 'translation' as const, label: 'EN', fullLabel: 'English' }
  ];

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex bg-paper-accent dark:bg-paper-dark-accent rounded-lg p-1 shadow-inner"
      >
        {scripts.map((scriptOption) => (
          <motion.button
            key={scriptOption.value}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScript(scriptOption.value)}
            className={`relative px-3 py-1.5 min-w-[3rem] rounded-md text-sm font-medium transition-all duration-200 ${
              script === scriptOption.value
                ? 'text-paper-light dark:text-paper-dark'
                : 'text-ink-light-secondary dark:text-ink-dark-secondary hover:text-ink-light dark:hover:text-ink-dark'
            }`}
          >
            <span className="hidden sm:inline">{scriptOption.fullLabel}</span>
            <span className="sm:hidden">{scriptOption.label}</span>
            
            {script === scriptOption.value && (
              <motion.div
                layoutId="activeScript"
                className="absolute inset-0 bg-accent-light dark:bg-accent-dark rounded-md"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default ScriptToggle;