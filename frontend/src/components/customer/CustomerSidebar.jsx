import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, User, MapPin, ShoppingBag, Heart, ShoppingCart, Package, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { selectSidebarOpen, setSidebarOpen } from '../../store/slices/uiSlice'
import { drawerVariants, overlayVariants } from '../../animations/variants'

const links = [
  { to: '/customer/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/customer/profile',    icon: User,            label: 'Profile' },
  { to: '/customer/addresses',  icon: MapPin,          label: 'Addresses' },
  { to: '/customer/products',   icon: ShoppingBag,     label: 'Browse Products' },
  { to: '/customer/cart',       icon: ShoppingCart,    label: 'Cart' },
  { to: '/customer/wishlist',   icon: Heart,           label: 'Wishlist' },
  { to: '/customer/orders',     icon: Package,         label: 'My Orders' },
]

function SidebarContent({ onClose }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
        <span className="font-display font-semibold text-gray-900 dark:text-gray-100">Customer Menu</span>
        {onClose && (
          <button onClick={onClose} className="btn-icon btn-ghost lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default function CustomerSidebar() {
  const dispatch    = useDispatch()
  const sidebarOpen = useSelector(selectSidebarOpen)
  const close       = () => dispatch(setSidebarOpen(false))

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-16 bottom-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="hidden" animate="visible" exit="exit"
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={close}
            />
            <motion.aside
              variants={drawerVariants}
              initial="hidden" animate="visible" exit="exit"
              className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 z-50 lg:hidden shadow-2xl"
            >
              <SidebarContent onClose={close} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
