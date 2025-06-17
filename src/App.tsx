// src/App.tsx

import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import LayoutHeader from './components/LayoutHeader.tsx'
import LayoutFooter from './components/LayoutFooter.tsx'
import PoemBook from './components/PoemBook.tsx'
import PoemIndex from './components/PoemIndex.tsx'
import AuthorBio from './components/AuthorBio.tsx'
import Contact from './components/Contact.tsx'
import NotFound from './components/NotFound.tsx'
import Subscribe from './components/Subscribe.tsx'
import { trackPageView } from './lib/analytics'
// import DebugEnv from './components/DebugEnv'

function App() {
  const location = useLocation()
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode')
    return savedMode ? JSON.parse(savedMode) : false
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Add smooth transition when theme changes
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease'
  }, [darkMode])

  useEffect(() => {
    // Simulate loading for initial theme setup
    const timer = setTimeout(() => setIsLoading(false), 100)
    return () => clearTimeout(timer)
  }, [])

  // Track page views
  useEffect(() => {
    trackPageView(location.pathname)
  }, [location.pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper-light dark:bg-paper-dark flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-ink-light dark:text-ink-dark"
        >
          <span className="hindi text-xl">लोड हो रहा है...</span>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col min-h-screen bg-gradient-to-br from-paper-light to-paper-accent dark:from-paper-dark dark:to-paper-dark-accent transition-colors duration-300"
    >
      <LayoutHeader darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main className="flex-grow flex items-center justify-center px-4 py-8 relative">
        {/*<DebugEnv />*/}
        {/* Decorative background patterns */}
        <div className="absolute inset-0 overflow-hidden opacity-5 dark:opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent-light dark:bg-accent-dark rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-light dark:bg-accent-dark rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="relative w-full max-w-6xl">
          <Routes>
            <Route path="/" element={<PoemIndex />} />
            <Route path="/poem/:id" element={<PoemBook />} />
            <Route path="/poems" element={<PoemIndex />} />
            <Route path="/read" element={<PoemBook />} />
            <Route path="/about" element={<AuthorBio />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      
      <LayoutFooter />
    </motion.div>
  )
}

export default App

