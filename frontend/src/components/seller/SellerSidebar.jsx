import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { selectSidebarOpen, setSidebarOpen } from "../../store/slices/uiSlice";
import { selectUser } from "../../store/slices/authSlice";

const links = [
  { to: "/seller/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/seller/products", icon: Package, label: "My Products" },
  { to: "/seller/products/add", icon: PlusCircle, label: "Add Product" },
  { to: "/seller/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/seller/profile", icon: User, label: "Profile" },
];

export default function SellerSidebar() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector(selectSidebarOpen);
  const user = useSelector(selectUser);

  const closeSidebar = () => dispatch(setSidebarOpen(false));

  const panelName = user?.firstName
    ? `${user.firstName}'s Store`
    : "Seller Panel";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-16 bottom-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-30">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <span className="font-display font-semibold text-gray-900 dark:text-gray-100">
            {panelName}
          </span>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={closeSidebar}
            />
            {/* Sidebar panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-50 lg:hidden flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="font-display font-semibold text-gray-900 dark:text-gray-100">
                  {panelName}
                </span>
                <button
                  onClick={closeSidebar}
                  className="btn-icon btn-ghost"
                  aria-label="Close sidebar"
                >
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {links.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? "active" : ""}`
                    }
                  >
                    <Icon size={18} />
                    {label}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
