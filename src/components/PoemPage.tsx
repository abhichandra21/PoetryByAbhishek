import type { FC } from 'react'
import { motion } from 'framer-motion'
import type { Poem } from '../types/index.js' 

interface PoemPageProps {
  poem: Poem;
}

const PoemPage: FC<PoemPageProps> = ({ poem }) => {
  const lineVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  }

  return (
    <motion.article 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative"
    >
      {/* Book page effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-paper-accent to-paper-light dark:from-paper-dark-accent dark:to-paper-dark rounded-xl shadow-book" />
      
      {/* Content container */}
      <div className="relative bg-paper-light dark:bg-paper-dark rounded-xl p-8 md:p-12 shadow-medium border border-ink-light/5 dark:border-ink-dark/5">
        {/* Decorative corner */}
        <div className="absolute top-4 right-4 w-16 h-16 opacity-5 dark:opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M0,100 Q50,0 100,0 L100,100 Z" fill="currentColor" />
          </svg>
        </div>
        
        {/* Poem Title */}
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-2xl md:text-3xl font-bold mb-8 hindi text-accent-light dark:text-accent-dark relative"
        >
          {poem.title}
          <span className="absolute -bottom-2 left-0 w-16 h-0.5 bg-gradient-to-r from-accent-light dark:from-accent-dark to-transparent opacity-50" />
        </motion.h1>
        
        {/* Poem Lines */}
        <div className="space-y-4">
          {poem.lines.map((line, index) => (
            <motion.p 
              key={index}
              custom={index}
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              className="hindi text-lg md:text-xl leading-loose text-ink-light dark:text-ink-dark indent-4"
            >
              {line}
            </motion.p>
          ))}
        </div>
        
        {/* Tags */}
        {poem.tags && poem.tags.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="mt-8 pt-6 border-t border-ink-light/10 dark:border-ink-dark/10"
          >
            <div className="flex flex-wrap gap-2">
              {poem.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 text-xs rounded-full bg-sage-light/20 dark:bg-sage-dark/20 text-ink-light-secondary dark:text-ink-dark-secondary border border-sage-light/20 dark:border-sage-dark/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.article>
  )
}

export default PoemPage