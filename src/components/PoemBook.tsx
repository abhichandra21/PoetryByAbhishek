import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PoemPage from './PoemPage.js'  
import Navigation from './Navigation.js'
import poems from '../data/poems.json'  

const PoemBook = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [currentPoemId, setCurrentPoemId] = useState(id ? parseInt(id) : 1)
  const [direction, setDirection] = useState(0)
  
  const currentPoem = poems.find(poem => poem.id === currentPoemId) || poems[0]
  
  useEffect(() => {
    navigate(`/poem/${currentPoemId}`, { replace: true })
  }, [currentPoemId, navigate])
  
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
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0
    })
  }
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={currentPoemId}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
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
      />
    </div>
  )
}

export default PoemBook