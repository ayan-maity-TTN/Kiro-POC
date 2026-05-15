import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { overlayVariants, modalVariants } from '../../animations/variants'

// Supports both API styles:
//   open/onConfirm/onCancel/variant  (used by pages)
//   isOpen/onClose/onConfirm/danger  (legacy)
export default function ConfirmDialog({
  // new API
  open,
  onCancel,
  variant = 'danger',
  // legacy API
  isOpen,
  onClose,
  // shared
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmLabel = 'Confirm',
  loading = false,
}) {
  const visible = open ?? isOpen ?? false
  const handleClose = onCancel ?? onClose ?? (() => {})
  const isDanger = variant === 'danger'

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            variants={overlayVariants}
            initial="hidden" animate="visible" exit="exit"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            variants={modalVariants}
            initial="hidden" animate="visible" exit="exit"
            className="relative w-full max-w-sm card shadow-2xl p-6"
          >
            <button onClick={handleClose} className="absolute top-4 right-4 btn-icon btn-ghost">
              <X size={16} />
            </button>
            <div className="flex flex-col items-center text-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDanger ? 'bg-red-100 dark:bg-red-900' : 'bg-yellow-100 dark:bg-yellow-900'}`}>
                <AlertTriangle size={24} className={isDanger ? 'text-red-600' : 'text-yellow-600'} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
                {message && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{message}</p>}
              </div>
              <div className="flex gap-3 w-full">
                <button onClick={handleClose} className="btn btn-secondary flex-1">Cancel</button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`btn flex-1 ${isDanger ? 'btn-danger' : 'btn-primary'}`}
                >
                  {loading ? 'Processing…' : confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
