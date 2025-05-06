import { motion } from 'framer-motion'

const LayoutFooter = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="mt-auto bg-paper-light/50 dark:bg-paper-dark/50 backdrop-blur-sm border-t border-ink-light/10 dark:border-ink-dark/10">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <p className="text-sm text-ink-light-secondary dark:text-ink-dark-secondary">
            © {currentYear} <span className="font-medium text-accent-light dark:text-accent-dark">Abhishek Chandra</span>
          </p>
          <p className="text-xs mt-1 text-ink-light-tertiary dark:text-ink-dark-tertiary">
            Made with ❤️ for poetry lovers
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default LayoutFooter