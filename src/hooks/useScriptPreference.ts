// src/hooks/useScriptPreference.ts
import { createContext, useContext } from 'react';

export type ScriptType = 'devanagari' | 'roman';

export interface ScriptContextType {
  script: ScriptType;
  setScript: (newScript: ScriptType) => void;
}

export const ScriptContext = createContext<ScriptContextType | null>(null);

export const useScriptPreference = (): ScriptContextType => {
  const context = useContext(ScriptContext);
  if (!context) {
    throw new Error('useScriptPreference must be used within a ScriptPreferenceProvider');
  }
  return context;
};