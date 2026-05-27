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
import { selectUser } from "../../store/slices/authSlice";

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
      ? "bg-primary-600 text-white shadow-md"
      : "text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-gray-800 hover:text-primary-700 dark:hover:text-white"
  }`;

export default function AdminSidebar() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector(selectSidebarOpen);
  const user = useSelector(selectUser);
  const closeSidebar = () => dispatch(setSidebarOpen(false));

  const panelName = user?.firstName
    ? `${user.firstName}'s Admin`
    : "Admin Panel";

  const sidebarContent = (mobile = false) => (
    <>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <span className="font-display font-semibold text-gray-900 dark:text-white">
          {panelName}
        </span>
        {mobile && (
          <button
            onClick={closeSidebar}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={mobile ? closeSidebar : undefined}
            className={({ isActive }) => linkClass(isActive)}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-16 bottom-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-30">
        {sidebarContent()}
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
              className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 lg:hidden flex flex-col shadow-2xl"
            >
              {sidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
