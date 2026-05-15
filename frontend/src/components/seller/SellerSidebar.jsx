import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, PlusCircle, ShoppingBag, User } from 'lucide-react'

const links = [
  { to: '/seller/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/seller/products',   icon: Package,         label: 'My Products' },
  { to: '/seller/products/add', icon: PlusCircle,    label: 'Add Product' },
  { to: '/seller/orders',     icon: ShoppingBag,     label: 'Orders' },
  { to: '/seller/profile',    icon: User,            label: 'Profile' },
]

export default function SellerSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-16 bottom-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-30">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <span className="font-display font-semibold text-gray-900 dark:text-gray-100">Seller Panel</span>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
