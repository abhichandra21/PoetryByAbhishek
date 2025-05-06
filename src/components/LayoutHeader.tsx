import type { FC } from 'react'
import { Link } from 'react-router-dom'

interface LayoutHeaderProps {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}

const LayoutHeader: FC<LayoutHeaderProps> = ({ darkMode, setDarkMode }) => {
  return (
    <header className="p-4 border-b border-ink-light/10 dark:border-ink-dark/10">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-lg md:text-xl font-bold hindi">
          <span className="md:hidden">कविताएँ</span>
          <span className="hidden md:inline">अभिषेक की कविताएँ</span>
        </Link>
        
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-ink-light/10 dark:hover:bg-ink-dark/10"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <span>☀️</span> : <span>🌙</span>}
        </button>
      </div>
    </header>
  )
}

export default LayoutHeader