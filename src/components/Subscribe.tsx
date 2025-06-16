import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

const Subscribe = () => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('subscriptions')
        .insert([{ email: email.trim() }])
      if (error) throw error
      setStatus('success')
      setEmail('')
    } catch (err) {
      console.error('Error subscribing:', err)
      setStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

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
        <motion.h1
          variants={fadeInUp}
          className="text-3xl md:text-4xl font-bold hindi text-accent-light dark:text-accent-dark mb-6 text-center"
        >
          Subscribe for Updates
        </motion.h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full px-3 py-2 border border-ink-light/10 dark:border-ink-dark/10 rounded-lg bg-paper-accent dark:bg-paper-dark-accent focus:border-accent-light dark:focus:border-accent-dark outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              isSubmitting
                ? 'bg-accent-light/50 dark:bg-accent-dark/50 text-paper-light dark:text-paper-dark cursor-not-allowed'
                : 'bg-accent-light dark:bg-accent-dark hover:bg-accent-hover-light dark:hover:bg-accent-hover-dark text-paper-light dark:text-paper-dark'
            }`}
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        {status === 'success' && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-states-success text-sm text-center"
          >
            Thank you! You will be notified when new poems are published.
          </motion.p>
        )}
        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-states-error text-sm text-center"
          >
            Sorry, there was an error. Please try again later.
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}

export default Subscribe
