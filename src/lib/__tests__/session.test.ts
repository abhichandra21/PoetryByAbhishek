import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getSessionId } from '../session'

// Minimal localStorage mock for node environment
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

describe('getSessionId', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('generates and stores a session id when none exists', () => {
    const id = getSessionId()
    expect(id).toBeTypeOf('string')
    expect(localStorage.getItem('session_id')).toBe(id)
  })

  it('returns existing session id if present', () => {
    localStorage.setItem('session_id', 'abc123')
    const id = getSessionId()
    expect(id).toBe('abc123')
    expect(localStorage.getItem('session_id')).toBe('abc123')
  })
})
