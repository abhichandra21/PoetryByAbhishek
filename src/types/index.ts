// src/types/index.ts
export interface Poem {
  id: number;
  title: string;
  lines: string[];
  date: string;
  tags?: string[];
  audio?: string;
  // Optional fields for different scripts
  romanizedTitle?: string;
  romanizedLines?: string[];
  translations?: Record<string, string>;
}

export interface Subscriber {
  id: string
  email: string
  created_at: string
}
