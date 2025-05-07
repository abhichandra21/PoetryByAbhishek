// src/components/ScriptPreference.tsx (updated)
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

export type ScriptType = 'devanagari' | 'romanized' | 'translation';

interface ScriptContextType {
  script: ScriptType;
  setScript: (newScript: ScriptType) => void;
}

const ScriptContext = createContext<ScriptContextType | null>(null);

export const ScriptPreferenceProvider = ({ children }: { children: ReactNode }) => {
  const [script, setScript] = useState<ScriptType>('devanagari');

  // Load persisted preference
  useEffect(() => {
    const saved = localStorage.getItem('preferredScript');
    if (saved && ['devanagari', 'romanized', 'translation'].includes(saved)) {
      setScript(saved as ScriptType);
    }
  }, []);

  // Save preference when it changes
  useEffect(() => {
    localStorage.setItem('preferredScript', script);
  }, [script]);

  return (
    <ScriptContext.Provider value={{ script, setScript }}>
      {children}
    </ScriptContext.Provider>
  );
};

export const useScriptPreference = () => {
  const context = useContext(ScriptContext);
  if (!context) {
    throw new Error('useScriptPreference must be used within a ScriptPreferenceProvider');
  }
  return context;
};