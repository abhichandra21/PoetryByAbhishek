// src/components/PoemIndex.tsx
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import poems from '../data/poems.json'

type ViewMode = 'grid' | 'list'

const PoemIndex = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // Filter poems based on search query
  const filteredPoems = useMemo(() => {
    if (!searchQuery) return poems

    return poems.filter(poem => 
      poem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poem.lines.some(line => line.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [searchQuery])

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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pr-12 rounded-lg bg-paper-accent dark:bg-paper-dark-accent border border-ink-light/10 dark:border-ink-dark/10 focus:border-accent-light dark:focus:border-accent-dark outline-none transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 text-ink-light-tertiary dark:text-ink-dark-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-between items-center">
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
              <div className={`p-6 rounded-lg bg-paper-light dark:bg-paper-dark shadow-medium hover:shadow-lg transition-all duration-200 border border-ink-light/10 dark:border-ink-dark/10 hover:border-accent-light dark:hover:border-accent-dark ${
                viewMode === 'list' ? 'flex gap-6' : ''
              }`}>
                {/* Poem Number Circle */}
                <div className={`${viewMode === 'list' ? 'flex-shrink-0' : 'mb-4'}`}>
                  <div className="w-12 h-12 rounded-full bg-accent-light dark:bg-accent-dark text-paper-light dark:text-paper-dark flex items-center justify-center font-bold">
                    {poem.id}
                  </div>
                </div>

                <div className="flex-1">
                  {/* Title */}
                  <h2 className="text-xl font-bold hindi text-ink-light dark:text-ink-dark mb-2">
                    {poem.title}
                  </h2>

                  {/* First line preview */}
                  <p className="text-ink-light-secondary dark:text-ink-dark-secondary line-clamp-2 hindi">
                    {poem.lines[0]}
                  </p>

                  {/* Tags */}
                  {poem.tags && poem.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {poem.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-0.5 rounded bg-sage-light/20 dark:bg-sage-dark/20 text-ink-light-tertiary dark:text-ink-dark-tertiary"
                        >
                          {tag}
                        </span>
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