import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Store, Package, Tag, Database, ShoppingBag, BarChart2 } from 'lucide-react'

const links = [
  { to: '/admin/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/customers',  icon: Users,           label: 'Customers' },
  { to: '/admin/sellers',    icon: Store,           label: 'Sellers' },
  { to: '/admin/products',   icon: Package,         label: 'Products' },
  { to: '/admin/categories', icon: Tag,             label: 'Categories' },
  { to: '/admin/metadata',   icon: Database,        label: 'Metadata Fields' },
  { to: '/admin/orders',     icon: ShoppingBag,     label: 'Orders' },
  { to: '/admin/analytics',  icon: BarChart2,       label: 'Analytics' },
]

export default function AdminSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-16 bottom-0 bg-gray-900 dark:bg-gray-950 z-30">
      <div className="p-4 border-b border-gray-800">
        <span className="font-display font-semibold text-white">Admin Panel</span>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
