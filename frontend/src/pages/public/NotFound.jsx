import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import { fadeInUp, pageTransition } from '../../animations/variants'

export default function NotFound() {
  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit"
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        <motion.div variants={fadeInUp}>
          <div className="text-8xl font-display font-bold gradient-text mb-4">404</div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">Page Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-primary btn-lg">
              <Home size={18} /> Go Home
            </Link>
            <button onClick={() => window.history.back()} className="btn-secondary btn-lg">
              <ArrowLeft size={18} /> Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
