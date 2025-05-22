import { useState, useEffect } from 'react'
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

  useEffect(() => {
    fetchLikeData()
  }, [poemId])

  const fetchLikeData = async () => {
    try {
      const sessionId = getSessionId()
      
      // Get like count
      const { data: countData, error: countError } = await supabase
        .from('poem_like_counts')
        .select('likes_count')
        .eq('poem_id', poemId)
        .single()

      if (countError && countError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching like count:', countError)
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
      }

      setLikeCount(countData?.likes_count || 0)
      setIsLiked(!!likeData)
    } catch (error) {
      console.error('Error fetching like data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async () => {
    if (isUpdating) return
    
    setIsUpdating(true)
    const sessionId = getSessionId()

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('poem_likes')
          .delete()
          .eq('poem_id', poemId)
          .eq('session_id', sessionId)

        if (error) throw error

        setIsLiked(false)
        setLikeCount(prev => Math.max(0, prev - 1))
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

        setIsLiked(true)
        setLikeCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error updating like:', error)
      // Revert optimistic update
      setIsLiked(!isLiked)
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-8 h-8 rounded-full bg-ink-light/10 dark:bg-ink-dark/10 animate-pulse" />
        <div className="w-12 h-4 rounded bg-ink-light/10 dark:bg-ink-dark/10 animate-pulse" />
      </div>
    )
  }

  return (
    <motion.div 
      className={`flex items-center gap-3 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleLike}
        disabled={isUpdating}
        className={`relative p-2 rounded-full transition-all duration-200 ${
          isLiked
            ? 'bg-accent-light dark:bg-accent-dark text-paper-light dark:text-paper-dark'
            : 'bg-paper-accent dark:bg-paper-dark-accent hover:bg-accent-light/10 dark:hover:bg-accent-dark/10'
        }`}
        aria-label={isLiked ? 'Unlike poem' : 'Like poem'}
      >
        <svg 
          className="w-5 h-5 transition-all duration-200" 
          fill={isLiked ? 'currentColor' : 'none'} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
        
        {/* Ripple effect */}
        {isLiked && (
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 rounded-full bg-accent-light dark:bg-accent-dark"
          />
        )}
      </motion.button>
      
      <span className={`text-sm font-medium transition-colors duration-200 ${
        isLiked 
          ? 'text-accent-light dark:text-accent-dark' 
          : 'text-ink-light-secondary dark:text-ink-dark-secondary'
      }`}>
        {likeCount} {likeCount === 1 ? 'like' : 'likes'}
      </span>
    </motion.div>
  )
}

export default PoemLike