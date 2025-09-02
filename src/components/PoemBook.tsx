import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PoemPage from './PoemPage.tsx'
import Navigation from './Navigation.tsx'
import poems from '../data/poems.json'
import { trackPoemView } from '../lib/analytics'
import { useSEO } from '../hooks/useSEO'

const PoemBook = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const poemList = [...poems].reverse()

  const [currentIndex, setCurrentIndex] = useState(() => {
    if (location.pathname === '/read') return 0

    if (id) {
      const idx = poemList.findIndex(p => p.id === parseInt(id))
      if (idx !== -1) return idx
    }

    return 0
  })
  
  const [direction, setDirection] = useState(0)

  const currentPoem = poemList[currentIndex] || poemList[0]

  useEffect(() => {
    if (location.pathname !== '/read') {
      navigate(`/poem/${currentPoem.id}`, { replace: true })
    }
  }, [currentIndex, navigate, location.pathname, currentPoem.id])

  // Track poem view for simple analytics
  useEffect(() => {
    trackPoemView(currentPoem.id)
  }, [currentPoem.id])

  // Generate structured data for the poem
  const generateStructuredData = () => {
    if (!currentPoem) return null

    return {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": `https://poetrybyabhishek.netlify.app/poem/${currentPoem.id}`,
      "name": currentPoem.title,
      "alternativeHeadline": currentPoem.romanizedTitle,
      "author": {
        "@type": "Person",
        "name": "Abhishek Chandra",
        "url": "https://poetrybyabhishek.netlify.app/about"
      },
      "creator": {
        "@type": "Person",
        "name": "Abhishek Chandra"
      },
      "inLanguage": "hi",
      "text": currentPoem.lines.join(' '),
      "genre": "Poetry",
      "keywords": currentPoem.tags?.join(', '),
      "datePublished": (currentPoem as any).dateWritten || currentPoem.date || new Date().toISOString().split('T')[0],
      "publisher": {
        "@type": "Organization",
        "name": "Poetry by Abhishek",
        "url": "https://poetrybyabhishek.netlify.app"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://poetrybyabhishek.netlify.app/poem/${currentPoem.id}`
      }
    }
  }

  // SEO optimization for individual poems
  useSEO({
    title: `${currentPoem.title} - Hindi Poetry`,
    description: `Read "${currentPoem.title}" (${currentPoem.romanizedTitle}) - A beautiful Hindi poem by Abhishek Chandra. Part of a collection of original Hindi poetry.`,
    keywords: `Hindi poetry, ${currentPoem.title}, ${currentPoem.romanizedTitle}, Abhishek Chandra, ${currentPoem.tags?.join(', ')}`,
    canonicalUrl: `https://poetrybyabhishek.netlify.app/poem/${currentPoem.id}`,
    ogTitle: `${currentPoem.title} | Poetry by Abhishek`,
    ogDescription: `Read this beautiful Hindi poem "${currentPoem.title}" by Abhishek Chandra. Original Hindi poetry with romanized text.`,
    ogType: 'article',
    structuredData: generateStructuredData()
  })
  
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentIndex < poemList.length - 1) {
      setDirection(1)
      setCurrentIndex(currentIndex + 1)
    }
  }

  // Swipe support for mobile devices
  useEffect(() => {
    let startX = 0
    let startY = 0
    const threshold = 50

    const handleStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const handleEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX
      const dy = e.changedTouches[0].clientY - startY
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
        if (dx < 0) {
          goToNext()
        } else {
          goToPrevious()
        }
      }
    }

    window.addEventListener('touchstart', handleStart)
    window.addEventListener('touchend', handleEnd)
    return () => {
      window.removeEventListener('touchstart', handleStart)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [currentIndex])
  
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
            key={currentPoem.id}
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
        hasPrevious={currentIndex > 0}
        hasNext={currentIndex < poemList.length - 1}
        currentPage={currentIndex + 1}
        totalPages={poemList.length}
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