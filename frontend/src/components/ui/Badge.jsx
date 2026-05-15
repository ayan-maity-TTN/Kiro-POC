import { cn } from '../../utils'

const variants = {
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
  success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  danger:  'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  gray:    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  accent:  'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300',
}

export default function Badge({ children, variant = 'gray', className }) {
  return (
    <span className={cn('badge', variants[variant], className)}>
      {children}
    </span>
  )
}
