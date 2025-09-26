import { useState } from 'react'
import type { FC } from 'react' // Type-only import for FC
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import ActionTooltip from './ActionTooltip'

type PaletteOption = 'monochrome' | 'original'

interface LayoutHeaderProps {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  palette: PaletteOption;
  setPalette: (palette: PaletteOption) => void;
}

const LayoutHeader: FC<LayoutHeaderProps> = ({ darkMode, setDarkMode, palette, setPalette }) => {
  const location = useLocation()
  // Add state for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const isActive = (path: string) => {
    if (path === '/read') {
      return location.pathname === '/read' || location.pathname.startsWith('/poem/')
    }
    return location.pathname === path
  }

  const navItems = [
    { path: '/', label: 'Index' },
    { path: '/read', label: 'Read' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    { path: '/subscribe', label: 'Subscribe' },
  ];

  const mobileMenu = (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed inset-y-0 right-0 w-64 md:hidden bg-paper-light dark:bg-paper-dark shadow-medium border-l border-ink-light/10 dark:border-ink-dark/10 z-[60] flex flex-col"
        >
          <nav className="flex flex-col py-6 px-4 overflow-y-auto flex-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg my-1 transition-colors tap-target ${
                  isActive(item.path)
                    ? 'bg-accent-light/10 dark:bg-accent-dark/10 text-accent-light dark:text-accent-dark'
                    : 'text-ink-light-secondary dark:text-ink-dark-secondary hover:bg-paper-accent dark:hover:bg-paper-dark-accent'
                }`}
              >
                <span className="text-base font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </motion.aside>
      )}
    </AnimatePresence>
  )

  return (
    <>
    <header className="sticky top-0 z-50 backdrop-blur-sm bg-paper-light/80 dark:bg-paper-dark/80 border-b border-ink-light/10 dark:border-ink-dark/10 shadow-soft">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-lg md:text-xl font-bold hindi text-ink-light dark:text-ink-dark"
            >
              Poetry By <span className="text-accent-light dark:text-accent-dark">Abhishek</span>
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-sm font-medium transition-colors px-3 py-2 tap-target ${
                  isActive(item.path)
                    ? 'text-accent-light dark:text-accent-dark'
                    : 'text-ink-light-secondary dark:text-ink-dark-secondary hover:text-ink-light dark:hover:text-ink-dark'
                }`}
              >
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent-light dark:bg-accent-dark"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu & Dark Mode Toggle */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <ActionTooltip label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="px-3 py-2 rounded-full bg-paper-accent dark:bg-paper-dark-accent hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 transition-colors flex items-center gap-2 tap-target"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {mobileMenuOpen ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                  <span className="text-sm font-medium text-ink-light dark:text-ink-dark">
                    {mobileMenuOpen ? 'Close' : 'Menu'}
                  </span>
                </motion.button>
              </ActionTooltip>
            </div>

            {/* Palette Toggle */}
            <ActionTooltip label={palette === 'monochrome' ? 'Switch to original colors' : 'Switch to monochrome palette'}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPalette(palette === 'monochrome' ? 'original' : 'monochrome')}
                className="relative p-2 rounded-full bg-paper-accent dark:bg-paper-dark-accent hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 transition-colors duration-200 w-11 h-11 flex items-center justify-center tap-target"
                aria-label={palette === 'monochrome' ? 'Switch to original color palette' : 'Switch to monochrome palette'}
              >
                <motion.div
                  animate={{ rotate: palette === 'monochrome' ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                  className="w-5 h-5 text-center"
                >
                  {palette === 'monochrome' ? '🎨' : '⬛'}
                </motion.div>
              </motion.button>
            </ActionTooltip>

            {/* Dark Mode Toggle */}
            <ActionTooltip label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDarkMode(!darkMode)}
                className="relative p-2 rounded-full bg-paper-accent dark:bg-paper-dark-accent hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 transition-colors duration-200 w-11 h-11 flex items-center justify-center tap-target"
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
            </ActionTooltip>
          </div>
        </div>
      </div>

    </header>
    {typeof document !== 'undefined' && createPortal(mobileMenu, document.body)}
    </>
  )
}

export default LayoutHeader
