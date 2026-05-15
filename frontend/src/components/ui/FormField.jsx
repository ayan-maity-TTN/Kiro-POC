import { cn } from '../../utils'
import { AlertCircle } from 'lucide-react'

export default function FormField({ label, error, children, required, hint, className }) {
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label className="label">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-gray-400 dark:text-gray-500">{hint}</p>}
      {error && (
        <p className="error-msg">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  )
}
