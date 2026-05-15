import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

// items: [{ label, to? }]   (pages use `to`, legacy used `href`)
export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-6">
      <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
        <Home size={14} />
      </Link>
      {items.map((item, i) => {
        const href = item.to ?? item.href
        const isLast = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1">
            <ChevronRight size={14} className="text-gray-300 dark:text-gray-600" />
            {href && !isLast ? (
              <Link to={href} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-700 dark:text-gray-300 font-medium">{item.label}</span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
