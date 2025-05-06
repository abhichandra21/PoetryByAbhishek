import type { FC } from 'react'  
import { useEffect } from 'react'
import { motion } from 'framer-motion'

interface NavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  currentPage?: number;
  totalPages?: number;
}

const Navigation: FC<NavigationProps> = ({ 
  onPrevious, 
  onNext, 
  hasPrevious, 
  hasNext,
  currentPage,
  totalPages
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          if (hasPrevious) onPrevious()
          break
        case 'ArrowRight':
        case ' ':
          if (hasNext) onNext()
          break
        default:
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onPrevious, onNext, hasPrevious, hasNext])
  
  const buttonVariants = {
    hover: { scale: 1.05, y: -2 },
    tap: { scale: 0.95 },
    disabled: { scale: 1, opacity: 0.5 }
  }
  
  return (
    <nav className="flex items-center justify-between mt-8 px-4">
      <motion.button
        variants={buttonVariants}
        whileHover={hasPrevious ? "hover" : "disabled"}
        whileTap={hasPrevious ? "tap" : ""}
        onClick={onPrevious}
        disabled={!hasPrevious}
        className={`group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          hasPrevious
            ? 'bg-paper-accent dark:bg-paper-dark-accent hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 text-ink-light dark:text-ink-dark'
            : 'bg-ink-light/5 dark:bg-ink-dark/5 text-ink-light-tertiary dark:text-ink-dark-tertiary cursor-not-allowed'
        }`}
      >
        <motion.span 
          animate={{ x: hasPrevious ? 0 : 5 }}
          transition={{ duration: 0.2 }}
          className="group-hover:-translate-x-1 transition-transform"
        >
          ←
        </motion.span>
        <span className="font-medium">Previous</span>
      </motion.button>
      
      {/* Page indicator */}
      {currentPage && totalPages && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-ink-light-secondary dark:text-ink-dark-secondary font-medium"
        >
          {currentPage} of {totalPages}
        </motion.div>
      )}
      
      <motion.button
        variants={buttonVariants}
        whileHover={hasNext ? "hover" : "disabled"}
        whileTap={hasNext ? "tap" : ""}
        onClick={onNext}
        disabled={!hasNext}
        className={`group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          hasNext
            ? 'bg-paper-accent dark:bg-paper-dark-accent hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 text-ink-light dark:text-ink-dark'
            : 'bg-ink-light/5 dark:bg-ink-dark/5 text-ink-light-tertiary dark:text-ink-dark-tertiary cursor-not-allowed'
        }`}
      >
        <span className="font-medium">Next</span>
        <motion.span 
          animate={{ x: hasNext ? 0 : -5 }}
          transition={{ duration: 0.2 }}
          className="group-hover:translate-x-1 transition-transform"
        >
          →
        </motion.span>
      </motion.button>
    </nav>
  )
}

export default Navigation