import { Link, useLocation, useNavigate } from "react-router-dom";
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
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";
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
import publicService from "../../services/publicService";

export default function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);
  const isAuth = useSelector(selectIsAuthenticated);
  const role = useSelector(selectRole);
  const user = useSelector(selectUser);
  const cartCount = useSelector(selectCartCount);
  const wishCount = useSelector(selectWishlistCount);
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    publicService
      .getCategories()
      .then((res) => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams({ q: searchQuery.trim() });
      if (selectedCategory) params.set("category", selectedCategory);
      navigate(`/search?${params.toString()}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <header className="sticky top-0 z-50 bg-gray-900 text-white">
        <div className="page-container">
          <div className="flex items-center gap-3 h-14 sm:h-16">
            {/* Sidebar toggle */}
            {isDashboardRoute && isAuth && (
              <button
                onClick={() => dispatch(toggleSidebar())}
                className="p-2 hover:bg-gray-700 rounded-lg lg:hidden"
                aria-label="Toggle sidebar"
              >
                <PanelLeft size={20} />
              </button>
            )}

            {/* Logo */}
            <Link to="/" className="flex items-center gap-1.5 flex-shrink-0">
              <span className="font-display font-bold text-lg sm:text-xl tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Shoppers
                </span>
                <span className="text-white">Point</span>
              </span>
            </Link>

            {/* Search Bar with Category Dropdown - only for public/customer */}
            {(!isAuth || role === "CUSTOMER") && (
              <div className="hidden sm:flex flex-1 max-w-2xl mx-4">
                <form
                  onSubmit={handleSearch}
                  className="flex w-full rounded-lg overflow-hidden"
                >
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-2 py-2 text-xs text-gray-900 bg-gray-200 border-r border-gray-300 focus:outline-none cursor-pointer min-w-[80px]"
                  >
                    <option value="">All</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, brands..."
                    className="flex-1 px-4 py-2 text-sm text-gray-900 bg-white border-0 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-colors"
                  >
                    <Search size={18} className="text-white" />
                  </button>
                </form>
              </div>
            )}

            {/* Right section */}
            <div className="flex items-center gap-1 sm:gap-3 ml-auto">
              {/* Theme toggle */}
              <button
                onClick={() => dispatch(toggleTheme())}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Account */}
              {isAuth ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenu(!userMenuOpen)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-700 transition-colors text-left"
                  >
                    <div className="hidden sm:block">
                      <p className="text-[10px] text-gray-400 leading-none">
                        Hello, {user?.firstName || "User"}
                      </p>
                      <p className="text-sm font-semibold leading-tight">
                        Account
                      </p>
                    </div>
                    {user?.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover sm:hidden"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold sm:hidden">
                        {user ? (
                          getInitials(user.firstName, user.lastName)
                        ) : (
                          <User size={14} />
                        )}
                      </div>
                    )}
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
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-700 text-left"
                >
                  <div>
                    <p className="text-[10px] text-gray-400 leading-none">
                      Hello, Sign in
                    </p>
                    <p className="text-sm font-semibold leading-tight">
                      Account
                    </p>
                  </div>
                </Link>
              )}

              {/* Orders */}
              {isAuth && role === "CUSTOMER" && (
                <Link
                  to="/customer/orders"
                  className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-700 text-left"
                >
                  <div>
                    <p className="text-[10px] text-gray-400 leading-none">
                      Returns
                    </p>
                    <p className="text-sm font-semibold leading-tight">
                      & Orders
                    </p>
                  </div>
                </Link>
              )}

              {/* Wishlist */}
              {isAuth && role === "CUSTOMER" && (
                <Link
                  to="/customer/wishlist"
                  className="p-2 hover:bg-gray-700 rounded-lg relative"
                >
                  <Heart size={20} />
                  {wishCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pink-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {wishCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart - only for customers and public */}
              {(!isAuth || role === "CUSTOMER") && (
                <Link
                  to={
                    isAuth && role === "CUSTOMER" ? "/customer/cart" : "/login"
                  }
                  className="flex items-center gap-1 p-2 hover:bg-gray-700 rounded-lg relative"
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-purple-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                  <span className="hidden sm:block text-sm font-semibold">
                    Cart
                  </span>
                </Link>
              )}

              {/* Mobile menu */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 hover:bg-gray-700 rounded-lg sm:hidden"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="sm:hidden pb-2">
            <form
              onSubmit={handleSearch}
              className="flex rounded-lg overflow-hidden"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2 text-sm text-gray-900 bg-white border-0 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 bg-gradient-to-r from-purple-500 to-pink-500"
              >
                <Search size={16} className="text-white" />
              </button>
            </form>
          </div>
        </div>

        {/* Secondary Nav - Quick Links */}
        {(!isAuth || role === "CUSTOMER") && (
          <div className="bg-gray-800 border-t border-gray-700">
            <div className="page-container">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1.5 text-sm">
                <Link
                  to="/"
                  className="flex-shrink-0 px-3 py-1 rounded hover:bg-gray-700 font-medium text-white"
                >
                  <Menu size={14} className="inline mr-1" />
                  All
                </Link>
                <Link
                  to="/search?q="
                  className="flex-shrink-0 px-3 py-1 rounded hover:bg-gray-700 text-gray-300 hover:text-white whitespace-nowrap transition-colors"
                >
                  Today's Deals
                </Link>
                <Link
                  to="/search?q="
                  className="flex-shrink-0 px-3 py-1 rounded hover:bg-gray-700 text-gray-300 hover:text-white whitespace-nowrap transition-colors"
                >
                  New Releases
                </Link>
                <Link
                  to="/search?q="
                  className="flex-shrink-0 px-3 py-1 rounded hover:bg-gray-700 text-gray-300 hover:text-white whitespace-nowrap transition-colors"
                >
                  Bestsellers
                </Link>
                <Link
                  to="/search?q=electronics"
                  className="flex-shrink-0 px-3 py-1 rounded hover:bg-gray-700 text-gray-300 hover:text-white whitespace-nowrap transition-colors"
                >
                  Electronics
                </Link>
                <Link
                  to="/search?q=fashion"
                  className="flex-shrink-0 px-3 py-1 rounded hover:bg-gray-700 text-gray-300 hover:text-white whitespace-nowrap transition-colors"
                >
                  Fashion
                </Link>
                <Link
                  to="/search?q=home"
                  className="flex-shrink-0 px-3 py-1 rounded hover:bg-gray-700 text-gray-300 hover:text-white whitespace-nowrap transition-colors"
                >
                  Home & Kitchen
                </Link>
                <Link
                  to="/search?q=mobiles"
                  className="flex-shrink-0 px-3 py-1 rounded hover:bg-gray-700 text-gray-300 hover:text-white whitespace-nowrap transition-colors"
                >
                  Mobiles
                </Link>
                <Link
                  to="/register/seller"
                  className="flex-shrink-0 px-3 py-1 rounded hover:bg-gray-700 text-gray-300 hover:text-white whitespace-nowrap transition-colors"
                >
                  Sell
                </Link>
                <Link
                  to="/contact"
                  className="flex-shrink-0 px-3 py-1 rounded hover:bg-gray-700 text-gray-300 hover:text-white whitespace-nowrap transition-colors"
                >
                  Customer Service
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="sm:hidden overflow-hidden border-t border-gray-700"
            >
              <nav className="py-3 px-4 flex flex-col gap-1">
                {!isAuth && (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="px-4 py-2 text-sm font-medium hover:bg-gray-700 rounded-lg"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register/customer"
                      onClick={() => setMenuOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-purple-300 hover:bg-gray-700 rounded-lg"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
                {isAuth && role === "CUSTOMER" && (
                  <>
                    <Link
                      to="/customer/orders"
                      onClick={() => setMenuOpen(false)}
                      className="px-4 py-2 text-sm font-medium hover:bg-gray-700 rounded-lg"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/customer/wishlist"
                      onClick={() => setMenuOpen(false)}
                      className="px-4 py-2 text-sm font-medium hover:bg-gray-700 rounded-lg"
                    >
                      Wishlist
                    </Link>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
