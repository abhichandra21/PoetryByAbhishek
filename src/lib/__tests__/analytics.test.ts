import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  trackPoemView,
  getPoemViews,
  trackSearch,
  getSearchHistory
} from '../analytics'

// Reuse the same mock as session tests
const storage: Record<string, string> = {}
const localStorageMock = {
  getItem: (key: string) => (key in storage ? storage[key] : null),
  setItem: (key: string, value: string) => {
    storage[key] = value
  },
  clear: () => {
    for (const k in storage) delete storage[k]
  }
}
vi.stubGlobal('localStorage', localStorageMock)
vi.stubGlobal('window', {} as unknown as Window)

describe('poem view analytics', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('tracks poem views and retrieves count', () => {
    trackPoemView(1)
    expect(localStorage.getItem('poemViews')).not.toBeNull()
    expect(getPoemViews(1)).toBe(1)

    trackPoemView(1)
    expect(getPoemViews(1)).toBe(2)
  })
})

describe('search analytics', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('stores search queries and returns history', () => {
    trackSearch('love')
    trackSearch('life')
    expect(getSearchHistory()).toEqual(['life', 'love'])
  })
})
