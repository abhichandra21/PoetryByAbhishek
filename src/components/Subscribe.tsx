import { motion } from 'framer-motion'
import SubscribeForm from './SubscribeForm'

const Subscribe = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-center hindi text-accent-light dark:text-accent-dark mb-6">
        सदस्यता लें
      </h1>
      <SubscribeForm />
    </motion.div>
  )
}

export default Subscribe
