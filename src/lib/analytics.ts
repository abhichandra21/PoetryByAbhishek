// Prefer the Vite provided env var when available but fall back to process.env
// so the utilities can run in Node contexts like tests or scripts.
const GA_MEASUREMENT_ID =
  import.meta.env?.VITE_GA_MEASUREMENT_ID ||
  process.env.VITE_GA_MEASUREMENT_ID ||
  ''

export const trackPoemView = (id: number) => {
  if (typeof window === 'undefined') return
  const data = JSON.parse(localStorage.getItem('poemViews') || '{}') as Record<string, number>
  data[id] = (data[id] || 0) + 1
  localStorage.setItem('poemViews', JSON.stringify(data))
  const w = window as unknown as { gtag?: (...args: unknown[]) => void }
  if (w.gtag) {
    w.gtag('event', 'poem_view', { poem_id: id })
  }
}

export const getPoemViews = (id: number): number => {
  if (typeof window === 'undefined') return 0
  const data = JSON.parse(localStorage.getItem('poemViews') || '{}') as Record<string, number>
  return data[id] || 0
}

export const trackPageView = (path: string) => {
  if (typeof window === 'undefined') return
  const pages = JSON.parse(localStorage.getItem('pageViews') || '{}') as Record<string, number>
  pages[path] = (pages[path] || 0) + 1
  localStorage.setItem('pageViews', JSON.stringify(pages))
  const w = window as unknown as { gtag?: (...args: unknown[]) => void }
  if (w.gtag) {
    w.gtag('event', 'page_view', {
      page_path: path,
      send_to: GA_MEASUREMENT_ID
    })
  }
}

export const trackSearch = (query: string) => {
  if (typeof window === 'undefined' || !query) return
  const history = JSON.parse(
    localStorage.getItem('searchHistory') || '[]'
  ) as string[]
  history.unshift(query)
  localStorage.setItem(
    'searchHistory',
    JSON.stringify(history.slice(0, 10))
  )
  const w = window as unknown as { gtag?: (...args: unknown[]) => void }
  if (w.gtag) {
    w.gtag('event', 'search', { search_term: query })
  }
}

export const getSearchHistory = (): string[] => {
  if (typeof window === 'undefined') return []
  return JSON.parse(localStorage.getItem('searchHistory') || '[]') as string[]
}
