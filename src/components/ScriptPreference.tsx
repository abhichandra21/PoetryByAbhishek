// src/components/ScriptPreference.tsx (updated)
import {
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { ScriptContext, type ScriptType } from '../hooks/useScriptPreference';

export const ScriptPreferenceProvider = ({ children }: { children: ReactNode }) => {
  const [script, setScript] = useState<ScriptType>('devanagari');

  // Load persisted preference
  useEffect(() => {
    const saved = localStorage.getItem('preferredScript');
    if (saved && ['devanagari', 'roman'].includes(saved)) {
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