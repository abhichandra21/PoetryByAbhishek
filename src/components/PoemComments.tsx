// src/components/PoemComments.tsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  likes: number
  liked: boolean
}

interface PoemCommentsProps {
  poemId: number
}

const PoemComments: React.FC<PoemCommentsProps> = ({ poemId }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [author, setAuthor] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Load comments for this poem
  useEffect(() => {
    const savedComments = localStorage.getItem(`poem-${poemId}-comments`)
    if (savedComments) {
      setComments(JSON.parse(savedComments))
    }
  }, [poemId])

  // Save comments to localStorage
  const saveComments = (updatedComments: Comment[]) => {
    localStorage.setItem(`poem-${poemId}-comments`, JSON.stringify(updatedComments))
    setComments(updatedComments)
  }

  // Handle adding a new comment
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !author.trim()) return

    setIsSubmitting(true)
    
    const newCommentObj: Comment = {
      id: Date.now().toString(),
      author: author.trim(),
      content: newComment.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      liked: false
    }

    const updatedComments = [newCommentObj, ...comments]
    saveComments(updatedComments)
    
    setNewComment('')
    setAuthor('')
    setIsSubmitting(false)
    setShowForm(false)
  }

  // Handle liking a comment
  const handleLike = (commentId: string) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
          liked: !comment.liked
        }
      }
      return comment
    })
    saveComments(updatedComments)
  }

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-12 pt-8 border-t border-ink-light/10 dark:border-ink-dark/10"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-ink-light dark:text-ink-dark">
          Reflections ({comments.length})
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-accent-light dark:bg-accent-dark text-paper-light dark:text-paper-dark rounded-lg hover:bg-accent-hover-light dark:hover:bg-accent-hover-dark transition-colors text-sm"
        >
          {showForm ? 'Cancel' : 'Add Reflection'}
        </button>
      </div>

      {/* Comment Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="mb-8 bg-paper-accent dark:bg-paper-dark-accent p-4 rounded-lg"
          >
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full px-3 py-2 border border-ink-light/10 dark:border-ink-dark/10 rounded bg-paper-light dark:bg-paper-dark focus:border-accent-light dark:focus:border-accent-dark outline-none"
              />
              <textarea
                placeholder="Share your thoughts on this poem..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                rows={3}
                className="w-full px-3 py-2 border border-ink-light/10 dark:border-ink-dark/10 rounded bg-paper-light dark:bg-paper-dark focus:border-accent-light dark:focus:border-accent-dark outline-none resize-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded text-sm font-medium transition-colors ${
                  isSubmitting
                    ? 'bg-accent-light/50 dark:bg-accent-dark/50 text-paper-light dark:text-paper-dark cursor-not-allowed'
                    : 'bg-accent-light dark:bg-accent-dark text-paper-light dark:text-paper-dark hover:bg-accent-hover-light dark:hover:bg-accent-hover-dark'
                }`}
              >
                {isSubmitting ? 'Posting...' : 'Post Reflection'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Comments List */}
      <div className="space-y-4">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-paper-accent dark:bg-paper-dark-accent p-4 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-ink-light dark:text-ink-dark">
                    {comment.author}
                  </h4>
                  <p className="text-xs text-ink-light-tertiary dark:text-ink-dark-tertiary">
                    {formatTime(comment.timestamp)}
                  </p>
                </div>
                <button
                  onClick={() => handleLike(comment.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                    comment.liked
                      ? 'bg-accent-light/20 dark:bg-accent-dark/20 text-accent-light dark:text-accent-dark'
                      : 'hover:bg-ink-light/5 dark:hover:bg-ink-dark/5 text-ink-light-tertiary dark:text-ink-dark-tertiary'
                  }`}
                >
                  <svg className="w-3 h-3" fill={comment.liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {comment.likes || 0}
                </button>
              </div>
              <p className="text-ink-light-secondary dark:text-ink-dark-secondary whitespace-pre-wrap">
                {comment.content}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {comments.length === 0 && (
          <div className="text-center py-8 text-ink-light-tertiary dark:text-ink-dark-tertiary">
            No reflections yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default PoemComments