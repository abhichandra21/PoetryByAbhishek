import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom' // Add useLocation
import { motion, AnimatePresence } from 'framer-motion'
import PoemPage from './PoemPage.tsx'
import Navigation from './Navigation.tsx'
import poems from '../data/poems.json'  

const PoemBook = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation() // Add this
  
  const [currentPoemId, setCurrentPoemId] = useState(() => {
    // If coming from /read route, default to the first poem
    if (location.pathname === '/read') {
      return 1
    }
    // Otherwise use the ID from URL params or default to 1
    return id ? parseInt(id) : 1
  })
  
  const [direction, setDirection] = useState(0)
  
  const currentPoem = poems.find(poem => poem.id === currentPoemId) || poems[0]
  
  useEffect(() => {
    // Don't replace the URL if we're on the /read path
    if (location.pathname !== '/read') {
      navigate(`/poem/${currentPoemId}`, { replace: true })
    }
  }, [currentPoemId, navigate, location.pathname])
  
  const goToPrevious = () => {
    if (currentPoemId > 1) {
      setDirection(-1)
      setCurrentPoemId(currentPoemId - 1)
    }
  }
  
  const goToNext = () => {
    if (currentPoemId < poems.length) {
      setDirection(1)
      setCurrentPoemId(currentPoemId + 1)
    }
  }
  
  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      rotateY: direction > 0 ? 90 : -90,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      rotateY: direction > 0 ? -90 : 90,
      scale: 0.8
    })
  }
  
  const transition = {
    duration: 0.5,
    ease: [0.25, 0.1, 0.25, 1],
  }
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Book container with perspective */}
      <div className="relative" style={{ perspective: '1000px' }}>
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={currentPoemId}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            style={{ transformOrigin: direction > 0 ? 'left center' : 'right center' }}
          >
            <PoemPage poem={currentPoem} />
          </motion.div>
        </AnimatePresence>
      </div>
      
      <Navigation 
        onPrevious={goToPrevious}
        onNext={goToNext}
        hasPrevious={currentPoemId > 1}
        hasNext={currentPoemId < poems.length}
        currentPage={currentPoemId}
        totalPages={poems.length}
      />
      
      {/* Keyboard hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="text-center mt-6"
      >
        <p className="text-xs text-ink-light-tertiary dark:text-ink-dark-tertiary">
          Use arrow keys or tap to navigate
        </p>
      </motion.div>
    </div>
  )
}

export default PoemBook