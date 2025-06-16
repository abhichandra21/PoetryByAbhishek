// src/components/PoemIndex.tsx
import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScriptToggle from './ScriptToggle'
import { useScriptPreference } from './ScriptPreference'
import poems from '../data/poems.json'
import type { Poem } from '../types'
import { recordSearchQuery, getSearchHistory } from '../lib/analytics'

type ViewMode = 'grid' | 'list'

const PoemIndex = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTag = searchParams.get('tag')
  const initialQuery = searchParams.get('q') || ''

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeTag, setActiveTag] = useState<string | null>(initialTag)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState<{ term: string; count: number }[]>([])
  const { script } = useScriptPreference()

  useEffect(() => {
    setSearchHistory(getSearchHistory())
  }, [])

  useEffect(() => {
    const params: Record<string, string> = {}
    if (activeTag) params.tag = activeTag
    if (searchQuery) params.q = searchQuery
    setSearchParams(params, { replace: true })
  }, [activeTag, searchQuery, setSearchParams])

  const allTags = useMemo(
    () => [...new Set(poems.flatMap(p => p.tags || []))].sort(),
    []
  )

  // Filter poems based on search query and selected tag
  const filteredPoems = useMemo(() => {
    const reversed = [...poems].reverse()
    const query = searchQuery.toLowerCase()

    const matchesQuery = (poem: Poem) => {
      if (!query) return true
      return (
        poem.title.toLowerCase().includes(query) ||
        (poem.romanizedTitle && poem.romanizedTitle.toLowerCase().includes(query)) ||
        poem.lines.some(line => line.toLowerCase().includes(query)) ||
        (poem.romanizedLines && poem.romanizedLines.some(l => l.toLowerCase().includes(query))) ||
        (poem.tags && poem.tags.some(tag => tag.toLowerCase().includes(query))) ||
        (poem.date && poem.date.includes(query))
      )
    }

    return reversed.filter(poem => {
      if (!matchesQuery(poem)) return false
      if (activeTag && !(poem.tags || []).includes(activeTag)) return false
      return true
    })
  }, [searchQuery, activeTag])

  const suggestions = useMemo(() => {
    const q = searchQuery.toLowerCase()
    if (!q) {
      return searchHistory.slice(0, 5).map((h) => h.term)
    }
    const historyMatches = searchHistory
      .filter((h) => h.term.toLowerCase().includes(q))
      .map((h) => h.term)
    const tagMatches = allTags.filter((tag) => tag.toLowerCase().includes(q))
    const titleMatches = poems
      .map((p) => (script === 'roman' ? p.romanizedTitle || p.title : p.title))
      .filter((t) => t.toLowerCase().includes(q))
    return Array.from(new Set([...historyMatches, ...tagMatches, ...titleMatches])).slice(0, 5)
  }, [searchQuery, searchHistory, allTags, script])

  // Display title based on script preference - with proper type
  const getDisplayTitle = (poem: Poem) => {
    if (script === 'roman' && poem.romanizedTitle) return poem.romanizedTitle
    return poem.title
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-center hindi mb-2">कविता संग्रह</h1>
        <p className="text-center text-ink-light-secondary dark:text-ink-dark-secondary">
          Browse the complete collection of poems
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search poems by title or content..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                recordSearchQuery(searchQuery)
                setSearchHistory(getSearchHistory())
                setShowSuggestions(false)
              }
            }}
            className="w-full px-4 py-3 pr-12 rounded-lg bg-paper-accent dark:bg-paper-dark-accent border border-ink-light/10 dark:border-ink-dark/10 focus:border-accent-light dark:focus:border-accent-dark outline-none transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 text-ink-light-tertiary dark:text-ink-dark-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {showSuggestions && (
            <ul className="absolute left-0 right-0 mt-1 bg-paper-light dark:bg-paper-dark border border-ink-light/10 dark:border-ink-dark/10 rounded-lg shadow-medium z-10 max-h-40 overflow-y-auto">
              {suggestions.map((term) => (
                <li key={term}>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setSearchQuery(term)
                      recordSearchQuery(term)
                      setSearchHistory(getSearchHistory())
                      setShowSuggestions(false)
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-accent-light/10 dark:hover:bg-accent-dark/10"
                  >
                    {term}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tag Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              !activeTag
                ? 'bg-accent-light text-paper-light dark:bg-accent-dark dark:text-paper-dark'
                : 'bg-paper-accent dark:bg-paper-dark-accent hover:bg-accent-light/20'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                activeTag === tag
                  ? 'bg-accent-light text-paper-light dark:bg-accent-dark dark:text-paper-dark'
                  : 'bg-paper-accent dark:bg-paper-dark-accent hover:bg-accent-light/20'
              }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* View Controls */}
        <div className="flex justify-between items-center">
          <ScriptToggle /> {/* Add the script toggle here */}
          
          <div className="flex items-center gap-2">
            <p className="text-sm text-ink-light-secondary dark:text-ink-dark-secondary">
              {filteredPoems.length} poem{filteredPoems.length !== 1 ? 's' : ''} found
            </p>
            
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 rounded bg-paper-accent dark:bg-paper-dark-accent hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 transition-colors"
              aria-label={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
            >
              {viewMode === 'grid' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Poems Grid/List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}
      >
        {filteredPoems.map((poem) => (
          <motion.div key={poem.id} variants={itemVariants}>
            <Link to={`/poem/${poem.id}`} className="block">
              <div className={`p-6 rounded-lg bg-paper-light dark:bg-paper-dark shadow-soft hover:shadow-deep transition-all duration-300 transform hover:-translate-y-1 border border-ink-light/10 dark:border-ink-dark/10 hover:border-accent-light dark:hover:border-accent-dark ${
                viewMode === 'list' ? 'flex gap-6' : ''
              }`}>
                {/* Poem Number Circle */}
                <div className={`${viewMode === 'list' ? 'flex-shrink-0' : 'mb-4'}`}>
                  <div className="w-12 h-12 rounded-full bg-accent-light dark:bg-accent-dark text-paper-light dark:text-paper-dark flex items-center justify-center font-bold">
                    {poem.id}
                  </div>
                </div>

                <div className="flex-1">
                  {/* Title - Update to use script preference */}
                  <h2 className={`text-xl font-bold text-ink-light dark:text-ink-dark mb-2 ${script === 'devanagari' ? 'hindi' : 'roman'}`}>
                    {getDisplayTitle(poem)}
                  </h2>

                  {/* First line preview - could update to use romanizedLines if needed */}
                  <p className={`text-ink-light-secondary dark:text-ink-dark-secondary line-clamp-2 ${script === 'devanagari' ? 'hindi' : 'roman'}`}>
                    {script === 'roman' && poem.romanizedLines ? poem.romanizedLines[0] : poem.lines[0]}
                  </p>

                  {/* Tags */}
                  {poem.tags && poem.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {poem.tags.slice(0, 3).map((tag, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.preventDefault()
                            setActiveTag(tag)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          className={`text-xs px-2 py-0.5 rounded transition-colors ${
                            activeTag === tag
                              ? 'bg-accent-light text-paper-light dark:bg-accent-dark dark:text-paper-dark'
                              : 'bg-sage-light/20 dark:bg-sage-dark/20 text-ink-light-tertiary dark:text-ink-dark-tertiary hover:bg-accent-light/20 dark:hover:bg-accent-dark/20'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                      {poem.tags.length > 3 && (
                        <span className="text-xs px-2 py-0.5 rounded bg-sage-light/20 dark:bg-sage-dark/20 text-ink-light-tertiary dark:text-ink-dark-tertiary">
                          +{poem.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <div className={`${viewMode === 'list' ? 'self-center' : 'mt-4 text-right'}`}>
                  <span className="text-ink-light-tertiary dark:text-ink-dark-tertiary">
                    →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* No Results */}
      {filteredPoems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-ink-light-secondary dark:text-ink-dark-secondary">
            No poems found matching "{searchQuery}".
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default PoemIndex
