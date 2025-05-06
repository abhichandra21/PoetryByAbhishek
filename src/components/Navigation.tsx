import type { FC } from 'react'  
import { useEffect } from 'react'

interface NavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

const Navigation: FC<NavigationProps> = ({ 
  onPrevious, 
  onNext, 
  hasPrevious, 
  hasNext 
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
  
  return (
    <nav className="flex justify-between mt-6">
      <button
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="px-4 py-2 disabled:opacity-50"
      >
        ← Previous
      </button>
      
      <button
        onClick={onNext}
        disabled={!hasNext}
        className="px-4 py-2 disabled:opacity-50"
      >
        Next →
      </button>
    </nav>
  )
}

export default Navigation