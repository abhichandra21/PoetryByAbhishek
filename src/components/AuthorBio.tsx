// src/components/AuthorBio.tsx
import { motion } from 'framer-motion'

const AuthorBio = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="bg-paper-light dark:bg-paper-dark rounded-xl p-8 md:p-12 shadow-medium border border-ink-light/10 dark:border-ink-dark/10">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold hindi text-accent-light dark:text-accent-dark mb-2">
            अभिषेक चन्द्र
          </h1>
          <p className="text-ink-light-secondary dark:text-ink-dark-secondary">
            Poet & Writer
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Biography */}
          <motion.section variants={fadeInUp} transition={{ delay: 0.2 }}>
            <h2 className="text-xl font-bold text-ink-light dark:text-ink-dark mb-4">
              Biography
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-ink-light-secondary dark:text-ink-dark-secondary leading-relaxed">
                Abhishek Chandra is a contemporary Hindi poet whose works explore the intersections of 
                tradition and modernity, love and loss, and the small moments that make up our daily lives. 
                Born and raised in [birthplace], he draws inspiration from the rich tapestry of Indian culture 
                while addressing universal themes that resonate across boundaries.
              </p>
              <p className="text-ink-light-secondary dark:text-ink-dark-secondary leading-relaxed mt-4">
                His poetry reflects a deep connection to nature, human relationships, and the philosophical 
                questions that arise from everyday experiences. Through simple yet profound verses, Abhishek 
                captures the essence of life's fleeting moments, making the ordinary extraordinary.
              </p>
            </div>
          </motion.section>

          {/* Literary Journey */}
          <motion.section variants={fadeInUp} transition={{ delay: 0.3 }}>
            <h2 className="text-xl font-bold text-ink-light dark:text-ink-dark mb-4">
              Literary Journey
            </h2>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-accent-light dark:bg-accent-dark mt-2 flex-shrink-0" />
                <p className="text-ink-light-secondary dark:text-ink-dark-secondary">
                  Started writing poetry during college years, drawn to the expressive power of Hindi verse
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-accent-light dark:bg-accent-dark mt-2 flex-shrink-0" />
                <p className="text-ink-light-secondary dark:text-ink-dark-secondary">
                  Participates in local poetry readings and cultural events
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-accent-light dark:bg-accent-dark mt-2 flex-shrink-0" />
                <p className="text-ink-light-secondary dark:text-ink-dark-secondary">
                  Focuses on themes of nature, relationships, nostalgia, and philosophical reflection
                </p>
              </div>
            </div>
          </motion.section>

          {/* Influences */}
          <motion.section variants={fadeInUp} transition={{ delay: 0.4 }}>
            <h2 className="text-xl font-bold text-ink-light dark:text-ink-dark mb-4">
              Influences & Inspirations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-paper-accent dark:bg-paper-dark-accent p-4 rounded-lg">
                <h3 className="font-medium text-ink-light dark:text-ink-dark mb-2">
                  Literary Influences
                </h3>
                <p className="text-sm text-ink-light-secondary dark:text-ink-dark-secondary">
                  Premchand, Nirala, Bachan, and other masters of Hindi literature who explored 
                  social themes and human emotions
                </p>
              </div>
              <div className="bg-paper-accent dark:bg-paper-dark-accent p-4 rounded-lg">
                <h3 className="font-medium text-ink-light dark:text-ink-dark mb-2">
                  Natural Inspirations
                </h3>
                <p className="text-sm text-ink-light-secondary dark:text-ink-dark-secondary">
                  The changing seasons, rural landscapes, and the simple beauty of everyday life 
                  in India's countryside
                </p>
              </div>
            </div>
          </motion.section>

          {/* Personal Philosophy */}
          <motion.section variants={fadeInUp} transition={{ delay: 0.5 }}>
            <h2 className="text-xl font-bold text-ink-light dark:text-ink-dark mb-4">
              Personal Philosophy
            </h2>
            <blockquote className="border-l-4 border-accent-light dark:border-accent-dark pl-4 italic">
              <p className="text-ink-light-secondary dark:text-ink-dark-secondary leading-relaxed">
                "Poetry is the bridge between the seen and the unseen, the said and the unsaid. 
                In our rushed lives, it offers moments of pause, reflection, and connection with 
                our deeper selves and the world around us."
              </p>
            </blockquote>
          </motion.section>

          {/* Contact Information */}
          <motion.section variants={fadeInUp} transition={{ delay: 0.6 }}>
            <h2 className="text-xl font-bold text-ink-light dark:text-ink-dark mb-4">
              Connect
            </h2>
            <p className="text-ink-light-secondary dark:text-ink-dark-secondary mb-4">
              For poetry readings, collaborations, or simply to share thoughts about poetry, 
              feel free to reach out:
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="mailto:abhishek@example.com" 
                className="flex items-center gap-2 px-4 py-2 bg-paper-accent dark:bg-paper-dark-accent hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </a>
              <a 
                href="https://twitter.com/abhishekchandra" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-paper-accent dark:bg-paper-dark-accent hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
                Twitter
              </a>
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  )
}

export default AuthorBio