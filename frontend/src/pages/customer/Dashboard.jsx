import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart, MapPin, Package, ArrowRight, User, ShoppingCart } from 'lucide-react'
import { selectUser } from '../../store/slices/authSlice'
import customerService from '../../services/customerService'
import { pageTransition, staggerContainer, staggerItem, fadeInUp } from '../../animations/variants'
import StatsCard from '../../components/ui/StatsCard'

const quickLinks = [
  { label: 'Browse Products', desc: 'Explore thousands of products', to: '/customer/products', icon: ShoppingBag, color: 'from-blue-500 to-blue-600' },
  { label: 'My Cart', desc: 'View items in your cart', to: '/customer/cart', icon: ShoppingCart, color: 'from-green-500 to-emerald-600' },
  { label: 'Wishlist', desc: 'Products you love', to: '/customer/wishlist', icon: Heart, color: 'from-red-500 to-pink-600' },
  { label: 'My Orders', desc: 'Track your orders', to: '/customer/orders', icon: Package, color: 'from-purple-500 to-violet-600' },
  { label: 'Addresses', desc: 'Manage delivery addresses', to: '/customer/addresses', icon: MapPin, color: 'from-orange-500 to-amber-600' },
  { label: 'My Profile', desc: 'Update your information', to: '/customer/profile', icon: User, color: 'from-teal-500 to-cyan-600' },
]

export default function CustomerDashboard() {
  const user = useSelector(selectUser)
  const [stats, setStats] = useState({ cart: 0, wishlist: 0, orders: 0, addresses: 0 })

  useEffect(() => {
    Promise.allSettled([
      customerService.getCart(),
      customerService.getWishlist(),
      customerService.getOrders({ page: 0, size: 1 }),
      customerService.getAddresses(),
    ]).then(([cartRes, wishRes, ordersRes, addrRes]) => {
      setStats({
        cart: cartRes.status === 'fulfilled' ? (cartRes.value.data || []).length : 0,
        wishlist: wishRes.status === 'fulfilled' ? (wishRes.value.data || []).length : 0,
        orders: ordersRes.status === 'fulfilled' ? (ordersRes.value.data || []).length : 0,
        addresses: addrRes.status === 'fulfilled' ? (addrRes.value.data || []).length : 0,
      })
    })
  }, [])

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      {/* Welcome Banner */}
      <motion.div variants={fadeInUp} className="rounded-2xl hero-gradient p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_50%,white,transparent)]" />
        <div className="relative">
          <p className="text-white/70 text-sm font-medium mb-1">Welcome back,</p>
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
            {user?.firstName || 'Customer'} {user?.lastName || ''}!
          </h1>
          <p className="text-white/80 text-sm">Ready to discover something new today?</p>
          <Link to="/customer/products" className="inline-flex items-center gap-2 mt-4 bg-white text-primary-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors">
            Start Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div variants={staggerItem}>
          <StatsCard title="Cart Items" value={stats.cart} icon={ShoppingCart} color="primary" />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatsCard title="Wishlist" value={stats.wishlist} icon={Heart} color="accent" />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatsCard title="Orders" value={stats.orders} icon={Package} color="success" />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatsCard title="Addresses" value={stats.addresses} icon={MapPin} color="warning" />
        </motion.div>
      </motion.div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link, i) => (
            <motion.div key={i} variants={staggerItem}>
              <Link to={link.to}
                className="card p-5 flex items-center gap-4 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <link.icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{link.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{link.desc}</p>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
