// src/components/Contact.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Here you would typically send the form data to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000)
    } catch (error) {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    } finally {
      setIsSubmitting(false)
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
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold hindi text-accent-light dark:text-accent-dark mb-2">
          Connect With Me
          </h1>
          <p className="text-ink-light-secondary dark:text-ink-dark-secondary">
            Get in touch for poetry readings, collaborations, or to share your thoughts
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div variants={fadeInUp} transition={{ delay: 0.2 }}>
            
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-paper-accent dark:bg-paper-dark-accent rounded-lg">
                  <svg className="w-5 h-5 text-accent-light dark:text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-ink-light dark:text-ink-dark">Email</h3>
                  <a href="mailto:abhi.chandra@gmail.com" className="text-accent-light dark:text-accent-dark hover:underline">
                    abhi.chandra@gmail.com
                  </a>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-paper-accent dark:bg-paper-dark-accent rounded-lg">
                  <svg className="w-5 h-5 text-accent-light dark:text-accent-dark" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-ink-light dark:text-ink-dark">Social Media</h3>
                  <div className="flex gap-3 mt-1">
                    <a href="https://linkedin.com/in/abhishekchandra" target="_blank" rel="noopener noreferrer" className="text-accent-light dark:text-accent-dark hover:underline">
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-paper-accent dark:bg-paper-dark-accent rounded-lg">
                  <svg className="w-5 h-5 text-accent-light dark:text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-ink-light dark:text-ink-dark">Location</h3>
                  <p className="text-ink-light-secondary dark:text-ink-dark-secondary">Based in Milwaukee, Wisconsin, USA</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={fadeInUp} transition={{ delay: 0.3 }}>
            <h2 className="text-xl font-bold text-ink-light dark:text-ink-dark mb-6">
              Send a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-ink-light dark:text-ink-dark mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-ink-light/10 dark:border-ink-dark/10 rounded-lg bg-paper-accent dark:bg-paper-dark-accent focus:border-accent-light dark:focus:border-accent-dark outline-none transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink-light dark:text-ink-dark mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-ink-light/10 dark:border-ink-dark/10 rounded-lg bg-paper-accent dark:bg-paper-dark-accent focus:border-accent-light dark:focus:border-accent-dark outline-none transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-ink-light dark:text-ink-dark mb-1">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-ink-light/10 dark:border-ink-dark/10 rounded-lg bg-paper-accent dark:bg-paper-dark-accent focus:border-accent-light dark:focus:border-accent-dark outline-none transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="poetry-reading">Poetry Reading Request</option>
                  <option value="collaboration">Collaboration Opportunity</option>
                  <option value="general">General Inquiry</option>
                  <option value="feedback">Feedback on Poems</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-ink-light dark:text-ink-dark mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-ink-light/10 dark:border-ink-dark/10 rounded-lg bg-paper-accent dark:bg-paper-dark-accent focus:border-accent-light dark:focus:border-accent-dark outline-none transition-colors resize-vertical"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-accent-light/50 dark:bg-accent-dark/50 text-paper-light dark:text-paper-dark cursor-not-allowed'
                    : 'bg-accent-light dark:bg-accent-dark hover:bg-accent-hover-light dark:hover:bg-accent-hover-dark text-paper-light dark:text-paper-dark'
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              
              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-states-success text-sm text-center"
                >
                  Thank you! Your message has been sent successfully.
                </motion.p>
              )}
              
              {submitStatus === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-states-error text-sm text-center"
                >
                  Sorry, there was an error sending your message. Please try again.
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Contact