import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fadeInUp } from '../../animations/variants'

// action can be:
//   { label, to }       → renders a Link
//   { label, onClick }  → renders a button
//   a React element     → rendered as-is (legacy)
export default function EmptyState({ icon: Icon, title, description, action }) {
  const renderAction = () => {
    if (!action) return null
    if (typeof action === 'object' && action.label) {
      if (action.to) {
        return (
          <Link to={action.to} className="btn-primary btn-sm">
            {action.label}
          </Link>
        )
      }
      if (action.onClick) {
        return (
          <button onClick={action.onClick} className="btn-primary btn-sm">
            {action.label}
          </button>
        )
      }
    }
    // legacy: raw JSX element
    return action
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <Icon size={28} className="text-gray-400 dark:text-gray-500" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">{description}</p>
      )}
      {renderAction()}
    </motion.div>
  )
}
