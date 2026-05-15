import { motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-primary-100 dark:border-primary-900" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading…</p>
      </motion.div>
    </div>
  )
}
