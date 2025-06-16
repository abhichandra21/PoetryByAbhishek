import { useState } from 'react'
import { motion } from 'framer-motion'
import { addSubscriber } from '../lib/subscribers'

const SubscribeForm = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    const { error } = await addSubscriber(email)
    if (error) {
      setStatus('error')
    } else {
      setStatus('success')
      setEmail('')
    }
    setTimeout(() => setStatus('idle'), 3000)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-start gap-3">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        placeholder="you@example.com"
        className="w-full px-3 py-2 border border-ink-light/10 dark:border-ink-dark/10 rounded-lg bg-paper-accent dark:bg-paper-dark-accent focus:border-accent-light dark:focus:border-accent-dark outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          loading
            ? 'bg-accent-light/50 dark:bg-accent-dark/50 text-paper-light dark:text-paper-dark cursor-not-allowed'
            : 'bg-accent-light dark:bg-accent-dark text-paper-light dark:text-paper-dark hover:bg-accent-hover-light dark:hover:bg-accent-hover-dark'
        }`}
      >
        {loading ? 'Subscribing...' : 'Subscribe'}
      </button>
      {status === 'success' && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-states-success text-sm">
          Thank you for subscribing!
        </motion.p>
      )}
      {status === 'error' && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-states-error text-sm">
          Failed to subscribe. Please try again.
        </motion.p>
      )}
    </form>
  )
}

export default SubscribeForm
