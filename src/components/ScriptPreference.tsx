import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,        // 👈 type‑only import
} from 'react';

export type ScriptType = 'devanagari' | 'romanized' | 'translation';

interface CtxShape {
  script: ScriptType;
  setScript: (s: ScriptType) => void;
}

const ScriptCtx = createContext<CtxShape | null>(null);

export const ScriptPreferenceProvider = ({ children }: { children: ReactNode }) => {
  const [script, setScript] = useState<ScriptType>('devanagari');

  /* load persisted preference */
  useEffect(() => {
    const saved = localStorage.getItem('preferredScript') as ScriptType | null;
    if (saved) setScript(saved);
  }, []);

  /* persist on change */
  useEffect(() => {
    localStorage.setItem('preferredScript', script);
  }, [script]);

  return (
    <ScriptCtx.Provider value={{ script, setScript }}>
      {children}
    </ScriptCtx.Provider>
  );
};

export const useScriptPreference = () => {
  const ctx = useContext(ScriptCtx);
  if (!ctx) throw new Error('useScriptPreference must be inside provider');
  return ctx;
};
