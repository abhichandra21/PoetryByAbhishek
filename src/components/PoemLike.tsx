// src/components/PoemLike.tsx
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { getSessionId } from '../lib/session'

interface PoemLikeProps {
  poemId: number
  className?: string
}

const PoemLike: React.FC<PoemLikeProps> = ({ poemId, className = '' }) => {
  const [likeCount, setLikeCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLikeData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const sessionId = getSessionId()
      
      // Get like count
      const { data: countData, error: countError } = await supabase
        .from('poem_like_counts')
        .select('likes_count')
        .eq('poem_id', poemId)
        .single()

      if (countError && countError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching like count:', countError)
        // Don't throw here, just use 0 as default
      }

      // Check if current user has liked
      const { data: likeData, error: likeError } = await supabase
        .from('poem_likes')
        .select('id')
        .eq('poem_id', poemId)
        .eq('session_id', sessionId)
        .single()

      if (likeError && likeError.code !== 'PGRST116') {
        console.error('Error checking like status:', likeError)
        // Don't throw here, just use false as default
      }

      setLikeCount(countData?.likes_count || 0)
      setIsLiked(!!likeData)
    } catch (error) {
      console.error('Error fetching like data:', error)
      setError('Failed to load likes')
      setLikeCount(0)
      setIsLiked(false)
    } finally {
      setIsLoading(false)
    }
  }, [poemId])

  useEffect(() => {
    fetchLikeData()
  }, [fetchLikeData])

  const handleLike = async () => {
    if (isUpdating) return
    
    setIsUpdating(true)
    setError(null)
    const sessionId = getSessionId()

    // Optimistic update
    const wasLiked = isLiked
    const prevCount = likeCount
    
    setIsLiked(!wasLiked)
    setLikeCount(prev => wasLiked ? Math.max(0, prev - 1) : prev + 1)

    try {
      if (wasLiked) {
        // Unlike
        const { error } = await supabase
          .from('poem_likes')
          .delete()
          .eq('poem_id', poemId)
          .eq('session_id', sessionId)

        if (error) throw error
      } else {
        // Like
        const { error } = await supabase
          .from('poem_likes')
          .insert([
            {
              poem_id: poemId,
              session_id: sessionId
            }
          ])

        if (error) throw error
      }
    } catch (error) {
      console.error('Error updating like:', error)
      setError('Failed to update like')
      // Revert optimistic update
      setIsLiked(wasLiked)
      setLikeCount(prevCount)
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-8 h-8 rounded-full bg-accent-light/20 dark:bg-accent-dark/20 animate-pulse flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-accent-light/40 dark:bg-accent-dark/40" />
        </div>
        <div className="w-8 h-3 rounded bg-ink-light/10 dark:bg-ink-dark/10 animate-pulse" />
      </div>
    )
  }

  if (error && !isLoading) {
    return (
      <div className={`flex items-center gap-2 text-red-500 dark:text-red-400 ${className}`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.865-.833-2.635 0L4.179 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span className="text-xs">Error</span>
      </div>
    )
  }

  return (
    <motion.div 
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLike}
        disabled={isUpdating}
        className={`relative p-2 rounded-full transition-all duration-300 border ${
          isLiked
            ? 'bg-accent-light dark:bg-accent-dark text-paper-light dark:text-paper-dark border-accent-light dark:border-accent-dark'
            : 'bg-paper-accent dark:bg-paper-dark-accent border-ink-light/20 dark:border-ink-dark/20 hover:border-accent-light dark:hover:border-accent-dark hover:bg-accent-light/10 dark:hover:bg-accent-dark/10'
        } ${isUpdating ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
        aria-label={isLiked ? 'Unlike poem' : 'Like poem'}
      >
        <motion.svg 
          className="w-4 h-4 transition-all duration-200" 
          fill={isLiked ? 'currentColor' : 'none'} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          animate={isLiked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </motion.svg>
        
        {/* Ripple effect for likes */}
        {isLiked && (
          <motion.div
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 rounded-full bg-accent-light dark:bg-accent-dark"
          />
        )}
        
        {/* Loading spinner */}
        {isUpdating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </motion.button>
      
      <motion.span
        key={likeCount} // This will trigger animation when count changes
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={`text-sm font-medium transition-colors duration-200 ${
          isLiked 
            ? 'text-accent-light dark:text-accent-dark' 
            : 'text-ink-light-secondary dark:text-ink-dark-secondary'
        }`}
      >
        {likeCount}
      </motion.span>
    </motion.div>
  )
}

export default PoemLike
