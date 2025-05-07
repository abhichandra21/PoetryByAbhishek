// src/components/ScriptToggle.tsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export type ScriptType = 'devanagari' | 'romanized' | 'translation'

interface ScriptToggleProps {
  className?: string;
}

// Hook to use script preference
export const useScriptPreference = () => {
  const [script, setScript] = useState<ScriptType>('devanagari')

  useEffect(() => {
    const saved = localStorage.getItem('preferredScript')
    if (saved && ['devanagari', 'romanized', 'translation'].includes(saved)) {
      setScript(saved as ScriptType)
    }
  }, [])

  const handleScriptChange = (newScript: ScriptType) => {
    setScript(newScript)
    localStorage.setItem('preferredScript', newScript)
  }

  return { script, setScript: handleScriptChange }
}

const ScriptToggle: React.FC<ScriptToggleProps> = ({ className = "" }) => {
  const { script, setScript } = useScriptPreference()
  
  const scripts = [
    { value: 'devanagari' as ScriptType, label: 'हिं', fullLabel: 'देवनागरी' },
    { value: 'romanized' as ScriptType, label: 'Ro', fullLabel: 'Romanized' },
    { value: 'translation' as ScriptType, label: 'EN', fullLabel: 'English' }
  ]

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
  )
}

export default ScriptToggle