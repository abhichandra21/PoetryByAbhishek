import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const NotFound = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center max-w-md mx-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mb-8"
      >
        <div className="w-24 h-24 mx-auto bg-accent-light/10 dark:bg-accent-dark/10 rounded-full flex items-center justify-center">
          <span className="text-3xl">📖</span>
        </div>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl md:text-3xl font-bold mb-4 text-ink-light dark:text-ink-dark hindi"
      >
        खोया हुआ पन्ना
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-6 text-ink-light-secondary dark:text-ink-dark-secondary"
      >
        The page you're looking for seems to have floated away like a poem on the wind.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent-light dark:bg-accent-dark hover:bg-accent-hover-light dark:hover:bg-accent-hover-dark text-paper-light dark:text-paper-dark rounded-lg transition-all duration-200 shadow-medium hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <span>Return to Poetry</span>
          <span>→</span>
        </Link>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <div className="w-32 h-0.5 mx-auto bg-gradient-to-r from-transparent via-ink-light/20 dark:via-ink-dark/20 to-transparent" />
      </motion.div>
    </motion.div>
  )
}

export default NotFound