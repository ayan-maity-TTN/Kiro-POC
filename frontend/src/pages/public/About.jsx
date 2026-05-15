import { motion } from 'framer-motion'
import { Shield, Truck, Award, Users, Heart, Zap } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem, pageTransition } from '../../animations/variants'

const values = [
  { icon: Shield, title: 'Trust & Safety', desc: 'Every transaction is secured with industry-standard encryption and verified sellers.', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950' },
  { icon: Truck, title: 'Fast Delivery', desc: 'We partner with top logistics providers to ensure your orders arrive on time.', color: 'text-green-500 bg-green-50 dark:bg-green-950' },
  { icon: Award, title: 'Quality First', desc: 'All sellers are vetted and products are quality-checked before listing.', color: 'text-purple-500 bg-purple-50 dark:bg-purple-950' },
  { icon: Heart, title: 'Customer Love', desc: 'Our 24/7 support team is always ready to help you with any issue.', color: 'text-red-500 bg-red-50 dark:bg-red-950' },
  { icon: Users, title: 'Community', desc: 'Join millions of buyers and thousands of sellers in our growing marketplace.', color: 'text-orange-500 bg-orange-50 dark:bg-orange-950' },
  { icon: Zap, title: 'Innovation', desc: 'We continuously improve our platform to give you the best shopping experience.', color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950' },
]

const team = [
  { name: 'Arjun Mehta', role: 'CEO & Founder', avatar: 'AM' },
  { name: 'Priya Kapoor', role: 'CTO', avatar: 'PK' },
  { name: 'Rohit Sharma', role: 'Head of Operations', avatar: 'RS' },
  { name: 'Sneha Patel', role: 'Head of Design', avatar: 'SP' },
]

export default function About() {
  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit">
      {/* Hero */}
      <section className="hero-gradient py-20 text-white text-center">
        <div className="page-container">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">About Shoppers Point</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              India's fastest-growing multi-vendor marketplace connecting buyers and sellers across the country.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="section bg-white dark:bg-gray-900">
        <div className="page-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                At Shoppers Point, we believe everyone deserves access to quality products at fair prices. Our platform empowers small and medium businesses to reach customers across India while giving shoppers an unparalleled selection.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Founded in 2024, we've grown from a small startup to a platform trusted by over 10 lakh customers and 5,000+ verified sellers. We're just getting started.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="grid grid-cols-2 gap-4">
              {[['10L+', 'Customers'], ['5K+', 'Sellers'], ['50K+', 'Products'], ['99.9%', 'Uptime']].map(([val, label]) => (
                <div key={label} className="card p-6 text-center">
                  <div className="text-3xl font-display font-bold gradient-text">{val}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-gray-50 dark:bg-gray-950">
        <div className="page-container">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Our Values</h2>
            <p className="text-gray-500 dark:text-gray-400">What drives us every day</p>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div key={i} variants={staggerItem} className="card p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl ${v.color} flex items-center justify-center mb-4`}>
                  <v.icon size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="section bg-white dark:bg-gray-900">
        <div className="page-container">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Meet the Team</h2>
            <p className="text-gray-500 dark:text-gray-400">The people behind Shoppers Point</p>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div key={i} variants={staggerItem} className="card p-6 text-center hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 rounded-full hero-gradient flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {member.avatar}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
