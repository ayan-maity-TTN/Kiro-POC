import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem, pageTransition } from '../../animations/variants'

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'support@shoppers-point.in', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950' },
  { icon: Phone, label: 'Phone', value: '+91 98765 43210', color: 'text-green-500 bg-green-50 dark:bg-green-950' },
  { icon: MapPin, label: 'Address', value: 'Bangalore, Karnataka, India', color: 'text-red-500 bg-red-50 dark:bg-red-950' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields')
      return
    }
    setLoading(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200))
    toast.success('Message sent! We\'ll get back to you within 24 hours.')
    setForm({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit">
      {/* Hero */}
      <section className="hero-gradient py-16 text-white text-center">
        <div className="page-container">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <h1 className="text-4xl font-display font-bold mb-3">Get in Touch</h1>
            <p className="text-white/80 text-lg">We're here to help. Reach out to us anytime.</p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-gray-50 dark:bg-gray-950">
        <div className="page-container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-6">Contact Information</h2>
              {contactInfo.map((info, i) => (
                <motion.div key={i} variants={staggerItem} className="card p-5 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${info.color} flex items-center justify-center flex-shrink-0`}>
                    <info.icon size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{info.label}</p>
                    <p className="text-gray-900 dark:text-white font-medium text-sm mt-0.5">{info.value}</p>
                  </div>
                </motion.div>
              ))}

              <div className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare size={20} className="text-primary-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Support Hours</h3>
                </div>
                <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                  <p>Monday – Friday: 9 AM – 8 PM</p>
                  <p>Saturday: 10 AM – 6 PM</p>
                  <p>Sunday: 11 AM – 4 PM</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="lg:col-span-2">
              <div className="card p-8">
                <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Full Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="input" required />
                    </div>
                    <div>
                      <label className="label">Email Address *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input" required />
                    </div>
                  </div>
                  <div>
                    <label className="label">Subject</label>
                    <input name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" className="input" />
                  </div>
                  <div>
                    <label className="label">Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={5}
                      placeholder="Describe your issue or question in detail..."
                      className="input resize-none" required />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary btn-lg">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2"><Send size={18} /> Send Message</span>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
