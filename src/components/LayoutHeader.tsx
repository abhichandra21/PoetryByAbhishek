import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

interface LayoutHeaderProps {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}

const LayoutHeader: FC<LayoutHeaderProps> = ({ darkMode, setDarkMode }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm bg-paper-light/80 dark:bg-paper-dark/80 border-b border-ink-light/10 dark:border-ink-dark/10">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-lg md:text-xl font-bold hindi text-ink-light dark:text-ink-dark"
            >
              <span className="md:hidden group-hover:text-accent-light dark:group-hover:text-accent-dark transition-colors">कविताएँ</span>
              <span className="hidden md:inline">
                Poetry By <span className="text-accent-light dark:text-accent-dark">Abhishek</span>
              </span>
            </motion.div>
          </Link>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
            className="relative p-2 rounded-full bg-paper-accent dark:bg-paper-dark-accent hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 transition-colors duration-200"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <motion.div
              animate={{ rotate: darkMode ? 0 : 180 }}
              transition={{ duration: 0.3 }}
              className="w-5 h-5"
            >
              {darkMode ? 
                <span className="inline-block">☀️</span> : 
                <span className="inline-block">🌙</span>
              }
            </motion.div>
          </motion.button>
        </div>
      </div>
    </header>
  )
}

export default LayoutHeader