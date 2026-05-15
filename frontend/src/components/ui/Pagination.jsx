import { ChevronLeft, ChevronRight } from 'lucide-react'

// Supports two API styles:
//   page + totalPages + onPageChange  (full pagination)
//   page + hasNext + onPageChange     (simple prev/next used by pages)
export default function Pagination({ page, totalPages, hasNext, onPageChange }) {
  // Simple prev/next mode when totalPages is not provided
  if (totalPages === undefined) {
    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="btn btn-secondary btn-sm disabled:opacity-40"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-400 px-3">
          Page {page + 1}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className="btn btn-secondary btn-sm disabled:opacity-40"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    )
  }

  if (totalPages <= 1) return null

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i
    if (page < 4) return i
    if (page > totalPages - 4) return totalPages - 7 + i
    return page - 3 + i
  })

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="btn-icon btn-ghost disabled:opacity-40"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
            p === page
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          {p + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="btn-icon btn-ghost disabled:opacity-40"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
