import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Sun,
  Moon,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Package,
  PanelLeft,
} from "lucide-react";
import { useState } from "react";
import { toggleTheme, selectTheme } from "../../store/slices/themeSlice";
import {
  selectIsAuthenticated,
  selectRole,
  selectUser,
} from "../../store/slices/authSlice";
import { selectCartCount } from "../../store/slices/cartSlice";
import { selectWishlistCount } from "../../store/slices/wishlistSlice";
import { toggleSidebar } from "../../store/slices/uiSlice";
import { useAuth } from "../../hooks/useAuth";
import { getInitials } from "../../utils";

function BagLogo() {
  return (
    <svg viewBox="0 0 48 52" fill="none" className="w-10 h-10 flex-shrink-0">
      {/* Bag body - colorful rainbow gradient with wave shapes */}
      <path
        d="M6 18L9 46C9 47.1 9.9 48 11 48H37C38.1 48 39 47.1 39 46L42 18H6Z"
        fill="url(#bagRainbow)"
      />
      {/* Wave overlay - red/orange swirl on left */}
      <path
        d="M6 18C10 24 8 34 12 42C13 44.5 11 47 11 48H9C9 47.1 9 46 9 46L6 18Z"
        fill="#E53E3E"
        opacity="0.85"
      />
      <path
        d="M9 20C13 26 11 36 15 44L13 48H12C11 44 13 34 9 20Z"
        fill="#ED8936"
        opacity="0.7"
      />
      {/* Blue/teal triangle on bottom right */}
      <path d="M28 36L22 48H34L38 36H28Z" fill="#2B6CB0" opacity="0.6" />
      <path d="M22 42L18 48H26L24 42H22Z" fill="#00B5D8" opacity="0.65" />
      {/* Green on right side */}
      <path
        d="M36 18L38 40C38 42 37 46 37 48H39L42 18H36Z"
        fill="#38A169"
        opacity="0.6"
      />
      {/* Bag top rim */}
      <path
        d="M5 15C5 13.9 5.9 13 7 13H41C42.1 13 43 13.9 43 15V18H5V15Z"
        fill="#E53E3E"
      />
      {/* Outer handle - orange */}
      <path
        d="M16 13C16 7.5 19.4 4 24 4C28.6 4 32 7.5 32 13"
        stroke="#ED8936"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Inner handle - pink */}
      <path
        d="M19 13C19 9 20.8 6.5 24 6.5C27.2 6.5 29 9 29 13"
        stroke="#E53E3E"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Cute closed eyes */}
      <path
        d="M14 27C14.8 26 16.2 26 17 27"
        stroke="#1A202C"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M31 27C31.8 26 33.2 26 34 27"
        stroke="#1A202C"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="bagRainbow" x1="6" y1="18" x2="42" y2="48">
          <stop offset="0%" stopColor="#FC8181" />
          <stop offset="20%" stopColor="#F6AD55" />
          <stop offset="40%" stopColor="#F6E05E" />
          <stop offset="60%" stopColor="#68D391" />
          <stop offset="80%" stopColor="#63B3ED" />
          <stop offset="100%" stopColor="#B794F4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useSelector(selectTheme);
  const isAuth = useSelector(selectIsAuthenticated);
  const role = useSelector(selectRole);
  const user = useSelector(selectUser);
  const cartCount = useSelector(selectCartCount);
  const wishCount = useSelector(selectWishlistCount);
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenu] = useState(false);

  const isDashboardRoute =
    location.pathname.startsWith("/customer") ||
    location.pathname.startsWith("/seller") ||
    location.pathname.startsWith("/admin");

  const dashboardPath =
    role === "ADMIN"
      ? "/admin/dashboard"
      : role === "SELLER"
        ? "/seller/dashboard"
        : "/customer/dashboard";

  return (
    <header className="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Left: Sidebar toggle + Logo */}
          <div className="flex items-center gap-1">
            {isDashboardRoute && isAuth && (
              <button
                onClick={() => dispatch(toggleSidebar())}
                className="btn-icon btn-ghost lg:hidden"
                aria-label="Toggle sidebar"
              >
                <PanelLeft size={20} />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <BagLogo />
              <span className="hidden sm:block font-display font-bold text-[18px] tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
                  Shoppers
                </span>
                <span className="text-gray-900 dark:text-white">Point</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Link
              to="/"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="btn-icon btn-ghost"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuth && role === "CUSTOMER" && (
              <>
                <Link
                  to="/customer/wishlist"
                  className="btn-icon btn-ghost relative"
                >
                  <Heart size={18} />
                  {wishCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {wishCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/customer/cart"
                  className="btn-icon btn-ghost relative"
                >
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAuth ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user.firstName || "Profile"}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-red-400/40"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-red-400/40">
                      {user ? (
                        getInitials(user.firstName, user.lastName)
                      ) : (
                        <User size={14} />
                      )}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                    {user?.firstName || "Account"}
                  </span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg py-1 z-50"
                      onMouseLeave={() => setUserMenu(false)}
                    >
                      <Link
                        to={dashboardPath}
                        onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      {role === "CUSTOMER" && (
                        <Link
                          to="/customer/orders"
                          onClick={() => setUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <Package size={15} /> My Orders
                        </Link>
                      )}
                      <hr className="my-1 border-gray-100 dark:border-gray-700" />
                      <button
                        onClick={() => {
                          setUserMenu(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <LogOut size={15} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn btn-ghost text-sm">
                  Login
                </Link>
                <Link
                  to="/register/customer"
                  className="btn btn-primary text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="btn-icon btn-ghost md:hidden"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-gray-100 dark:border-gray-800"
            >
              <nav className="py-3 flex flex-col gap-1">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl"
                >
                  Contact
                </Link>
                {!isAuth && (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register/customer"
                      onClick={() => setMenuOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 rounded-xl"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
