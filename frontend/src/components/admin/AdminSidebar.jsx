import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  Tag,
  Database,
  ShoppingBag,
  BarChart2,
  X,
} from "lucide-react";
import { selectSidebarOpen, setSidebarOpen } from "../../store/slices/uiSlice";

const links = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/customers", icon: Users, label: "Customers" },
  { to: "/admin/sellers", icon: Store, label: "Sellers" },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/categories", icon: Tag, label: "Categories" },
  { to: "/admin/metadata", icon: Database, label: "Metadata Fields" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/admin/analytics", icon: BarChart2, label: "Analytics" },
];

const linkClass = (isActive) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
    isActive
      ? "bg-primary-600 text-white"
      : "text-gray-400 hover:bg-gray-800 hover:text-white"
  }`;

export default function AdminSidebar() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector(selectSidebarOpen);
  const closeSidebar = () => dispatch(setSidebarOpen(false));

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-16 bottom-0 bg-gray-900 dark:bg-gray-950 z-30">
        <div className="p-4 border-b border-gray-800">
          <span className="font-display font-semibold text-white">
            Admin Panel
          </span>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => linkClass(isActive)}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={closeSidebar}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-gray-900 dark:bg-gray-950 z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <span className="font-display font-semibold text-white">
                  Admin Panel
                </span>
                <button
                  onClick={closeSidebar}
                  className="text-gray-400 hover:text-white transition-colors"
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
                    className={({ isActive }) => linkClass(isActive)}
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
