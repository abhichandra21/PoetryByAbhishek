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
            Poet & Software Engineer
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-8">
          <motion.section variants={fadeInUp} transition={{ delay: 0.2 }}>
            <div className="prose dark:prose-invert max-w-none space-y-4">
              <h2>About Abhishek Chandra</h2>
              <p>
                Hi, I’m Abhishek — a poet and software engineer, born in India and now living in Milwaukee. I write mostly in Hindi and Urdu, trying to capture the quiet, in-between moments of life — memories, relationships, and the feelings that are hard to put into words.
              </p>
              <p>
                Poetry has been with me since my school days. It’s something I turn to when I need to slow down, reflect, or reconnect with myself. A way of noticing the world more closely, whether in a passing thought or a changing sky.
              </p>
              <p>
                I’m deeply inspired by nature, the old masters of Hindi literature, and everyday conversations. When I’m not writing, you’ll usually find me with a camera in hand, chasing light and stillness.
              </p>
              <p>
                If you ever want to talk poetry, share something, or just say hello, I’d love to hear from you.
              </p>
            </div>
          </motion.section>

          <motion.section variants={fadeInUp} transition={{ delay: 0.3 }}>
            <h2 className="text-xl font-bold text-ink-light dark:text-ink-dark mb-4">
              Connect
            </h2>
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
