// src/types/index.ts
export interface Poem {
  id: number;
  title: string;
  lines: string[];
  tags?: string[];
  audio?: string;
  // Optional fields for different scripts
  romanizedTitle?: string;
  romanizedLines?: string[];
  translations?: Record<string, string>;
}