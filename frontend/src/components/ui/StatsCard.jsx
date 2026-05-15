import { motion } from 'framer-motion'
import { staggerItem } from '../../animations/variants'
import { cn } from '../../utils'

export default function StatsCard({ title, value, icon: Icon, trend, color = 'primary', subtitle }) {
  const colorMap = {
    primary: 'from-primary-500 to-primary-600',
    accent:  'from-accent-500 to-accent-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    danger:  'from-red-500 to-red-600',
    purple:  'from-purple-500 to-purple-600',
  }

  return (
    <motion.div variants={staggerItem} className="card p-6 hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          {trend !== undefined && (
            <p className={cn('text-xs font-medium mt-2', trend >= 0 ? 'text-green-600' : 'text-red-500')}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-sm', colorMap[color])}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </motion.div>
  )
}
