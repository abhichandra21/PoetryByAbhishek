// src/components/PoemIndex.tsx
import { useState, useMemo, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScriptToggle from './ScriptToggle'
import { useScriptPreference } from './ScriptPreference'
import poems from '../data/poems.json'
import type { Poem } from '../types'
import allTranslations, { romanToDevanagariMap } from '../translations/poemTranslations'
import { useSEO } from '../hooks/useSEO'

const devToRomanMap: Record<string, string> = {}
Object.entries(allTranslations).forEach(([dev, val]) => {
  if ((val as { roman?: string }).roman) {
    devToRomanMap[dev.toLowerCase()] = (val as { roman: string }).roman.toLowerCase()
  }
})

type ViewMode = 'grid' | 'list'

const PoemIndex = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const { script } = useScriptPreference()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('q') || ''
    const tag = params.get('tag')
    setSearchQuery(q)
    setActiveTag(tag)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (activeTag) params.set('tag', activeTag)
    navigate({ search: params.toString() }, { replace: true })
  }, [searchQuery, activeTag])

  // Filter poems based on search query and active tag
  const filteredPoems = useMemo(() => {
    const reversed = [...poems].reverse()
    const query = searchQuery.toLowerCase()
    const devVariant = romanToDevanagariMap[query]
    const romanVariant = devToRomanMap[query]

    const matchesQuery = (poem: Poem) => {
      if (!query) return true

      const searchTexts = [
        poem.title,
        poem.romanizedTitle ?? '',
        ...(poem.lines ?? []),
        ...(poem.romanizedLines ?? []),
        ...(poem.tags ?? []),
        poem.date ?? ''
      ].map(t => t.toLowerCase())

      if (searchTexts.some(t => t.includes(query))) return true
      if (devVariant && searchTexts.some(t => t.includes(devVariant.toLowerCase()))) return true
      if (romanVariant && searchTexts.some(t => t.includes(romanVariant.toLowerCase()))) return true
      return false
    }

    return reversed.filter(poem => {
      if (!matchesQuery(poem)) return false
      if (activeTag && !(poem.tags || []).includes(activeTag)) return false
      return true
    })
  }, [searchQuery, activeTag])

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

  // Generate structured data for the collection
  const generateCollectionStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "CreativeWorkSeries",
      "name": "Poetry by Abhishek - Hindi Poetry Collection",
      "author": {
        "@type": "Person",
        "name": "Abhishek Chandra",
        "url": "https://poetrybyabhishek.netlify.app/about"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Poetry by Abhishek",
        "url": "https://poetrybyabhishek.netlify.app"
      },
      "inLanguage": "hi",
      "genre": "Poetry",
      "description": "A collection of original Hindi poems by Abhishek Chandra, featuring bilingual text with both Devanagari and romanized scripts.",
      "numberOfItems": poems.length,
      "hasPart": poems.map(poem => ({
        "@type": "CreativeWork",
        "name": poem.title,
        "url": `https://poetrybyabhishek.netlify.app/poem/${poem.id}`,
        "inLanguage": "hi"
      }))
    }
  }

  // SEO optimization for the index page
  useSEO({
    title: activeTag ? `Poems tagged with "${activeTag}"` : searchQuery ? `Search results for "${searchQuery}"` : "Hindi Poetry Collection",
    description: activeTag 
      ? `Browse Hindi poems tagged with "${activeTag}" by Abhishek Chandra. Original poetry with bilingual text support.`
      : searchQuery 
        ? `Search results for "${searchQuery}" in Abhishek Chandra's Hindi poetry collection.`
        : "Browse the complete collection of original Hindi poems by Abhishek Chandra. Features bilingual text with both Devanagari and romanized scripts.",
    keywords: `Hindi poetry, Abhishek Chandra, poetry collection, bilingual poems, Devanagari, romanized Hindi${activeTag ? `, ${activeTag}` : ''}${searchQuery ? `, ${searchQuery}` : ''}`,
    canonicalUrl: "https://poetrybyabhishek.netlify.app/",
    structuredData: generateCollectionStructuredData()
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-center text-ink-light-secondary dark:text-ink-dark-secondary">
          Browse Abhishek's complete collection of poems
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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pr-12 rounded-lg bg-paper-accent dark:bg-paper-dark-accent border border-ink-light/10 dark:border-ink-dark/10 focus:border-accent-light dark:focus:border-accent-dark outline-none transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 text-ink-light-tertiary dark:text-ink-dark-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {/* no search history suggestions */}
        </div>

        {/* Tag filter removed */}

        {/* View Controls */}
        <div className="flex justify-between items-center">
          <ScriptToggle /> {/* Add the script toggle here */}
          
          <div className="flex items-center gap-2">
            <p className="text-sm text-ink-light-secondary dark:text-ink-dark-secondary">
              {filteredPoems.length} poem{filteredPoems.length !== 1 ? 's' : ''} found
            </p>
            
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 rounded bg-paper-accent dark:bg-paper-dark-accent hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 transition-colors w-11 h-11 flex items-center justify-center tap-target"
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

                  {/* tags removed on index */}
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
