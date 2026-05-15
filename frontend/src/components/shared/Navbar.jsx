import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, Sun, Moon, Menu, X, User, LogOut, LayoutDashboard, Package } from 'lucide-react'
import { useState } from 'react'
import { toggleTheme, selectTheme } from '../../store/slices/themeSlice'
import { selectIsAuthenticated, selectRole, selectUser } from '../../store/slices/authSlice'
import { selectCartCount } from '../../store/slices/cartSlice'
import { selectWishlistCount } from '../../store/slices/wishlistSlice'
import { toggleSidebar } from '../../store/slices/uiSlice'
import { useAuth } from '../../hooks/useAuth'
import { getInitials } from '../../utils'

export default function Navbar() {
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const location   = useLocation()
  const theme      = useSelector(selectTheme)
  const isAuth     = useSelector(selectIsAuthenticated)
  const role       = useSelector(selectRole)
  const user       = useSelector(selectUser)
  const cartCount  = useSelector(selectCartCount)
  const wishCount  = useSelector(selectWishlistCount)
  const { logout } = useAuth()
  const [menuOpen, setMenuOpen]     = useState(false)
  const [userMenuOpen, setUserMenu] = useState(false)

  // Show sidebar toggle on mobile when inside a dashboard route
  const isDashboardRoute = location.pathname.startsWith('/customer') ||
    location.pathname.startsWith('/seller') ||
    location.pathname.startsWith('/admin')

  const dashboardPath = role === 'ADMIN' ? '/admin/dashboard'
    : role === 'SELLER' ? '/seller/dashboard'
    : '/customer/dashboard'

  return (
    <header className="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
            <div className="w-8 h-8 rounded-xl hero-gradient flex items-center justify-center text-white text-sm font-bold">S</div>
            <span className="gradient-text hidden sm:block">Shoppers Point</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button onClick={() => dispatch(toggleTheme())} className="btn-icon btn-ghost" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuth && role === 'CUSTOMER' && (
              <>
                <Link to="/customer/wishlist" className="btn-icon btn-ghost relative">
                  <Heart size={18} />
                  {wishCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{wishCount}</span>
                  )}
                </Link>
                <Link to="/customer/cart" className="btn-icon btn-ghost relative">
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{cartCount}</span>
                  )}
                </Link>
              </>
            )}

            {isAuth ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full hero-gradient flex items-center justify-center text-white text-xs font-bold">
                    {user ? getInitials(user.firstName, user.lastName) : <User size={14} />}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                    {user?.firstName || 'Account'}
                  </span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 card shadow-lg py-1 z-50"
                      onMouseLeave={() => setUserMenu(false)}
                    >
                      <Link to={dashboardPath} onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      {role === 'CUSTOMER' && (
                        <Link to="/customer/orders" onClick={() => setUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <Package size={15} /> My Orders
                        </Link>
                      )}
                      <hr className="my-1 border-gray-100 dark:border-gray-700" />
                      <button onClick={() => { setUserMenu(false); logout() }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                        <LogOut size={15} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn btn-ghost text-sm">Login</Link>
                <Link to="/register/customer" className="btn btn-primary text-sm">Sign Up</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="btn-icon btn-ghost md:hidden">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar toggle on mobile inside dashboard */}
            {isDashboardRoute && isAuth && (
              <button onClick={() => dispatch(toggleSidebar())} className="btn-icon btn-ghost lg:hidden">
                <Menu size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-gray-100 dark:border-gray-800"
            >
              <nav className="py-3 flex flex-col gap-1">
                <Link to="/" onClick={() => setMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl">Home</Link>
                <Link to="/about" onClick={() => setMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl">About</Link>
                <Link to="/contact" onClick={() => setMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl">Contact</Link>
                {!isAuth && (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl">Login</Link>
                    <Link to="/register/customer" onClick={() => setMenuOpen(false)} className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 rounded-xl">Sign Up</Link>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
