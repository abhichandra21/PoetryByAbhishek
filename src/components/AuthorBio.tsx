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
            Abhishek Chandra/अभिषेक चन्द्रा
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
              Abhishek Chandra is a poet whose work bridges continents and languages, 
              weaving together the delicate threads of memory, longing, and human connection.
              Born in India and now residing in Milwaukee, his Hindi and Urdu verses explore 
              the spaces between past and present, silence and expression, absence and belonging.
              </p>
              <p className="text-ink-light-secondary dark:text-ink-dark-secondary leading-relaxed mt-4">
              Alongside his career as a software engineer, 
              Abhishek captures the world both in words and through the lens of his camera,
              seeking to reveal the poetry that lingers quietly in the everyday. 
              His work invites readers to pause, reflect, and find meaning in the tender intersections of life’s fleeting moments.
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
                  Started writing poetry during school years, drawn to the expressive power of Hindi verse
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
                Writing in Hindi and Urdu, Abhishek captures moments where nature and emotion intertwine,
                offering readers a gentle invitation to pause, reflect, and rediscover wonder in the everyday.
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
                href="mailto:abhi.chandra@gmail.com" 
                className="flex items-center gap-2 px-4 py-2 bg-paper-accent dark:bg-paper-dark-accent hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </a>
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  )
}

export default AuthorBio