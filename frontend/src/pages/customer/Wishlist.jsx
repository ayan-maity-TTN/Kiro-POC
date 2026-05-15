import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { pageTransition, staggerContainer, staggerItem } from '../../animations/variants'
import { formatCurrency } from '../../utils'
import EmptyState from '../../components/ui/EmptyState'
import customerService from '../../services/customerService'
import toast from 'react-hot-toast'

export default function CustomerWishlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchWishlist = async () => {
    try {
      const res = await customerService.getWishlist()
      setItems(res.data || [])
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchWishlist() }, [])

  const handleRemove = async (variationId) => {
    try {
      await customerService.removeFromWishlist(variationId)
      setItems((prev) => prev.filter((i) => i.variationId !== variationId))
      toast.success('Removed from wishlist')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove')
    }
  }

  const moveToCart = async (item) => {
    try {
      await customerService.addToCart({ productVariationId: item.variationId, quantity: 1 })
      await customerService.removeFromWishlist(item.variationId)
      setItems((prev) => prev.filter((i) => i.variationId !== item.variationId))
      toast.success('Moved to cart!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to move to cart')
    }
  }

  const handleClearAll = async () => {
    try {
      await Promise.all(items.map((i) => customerService.removeFromWishlist(i.variationId)))
      setItems([])
      toast.success('Wishlist cleared')
    } catch {
      toast.error('Failed to clear wishlist')
    }
  }

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card animate-pulse h-64 bg-gray-100 dark:bg-gray-800" />
        ))}
      </div>
    )
  }

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
          Wishlist {items.length > 0 && <span className="text-gray-400 font-normal text-lg">({items.length})</span>}
        </h1>
        {items.length > 0 && (
          <button onClick={handleClearAll} className="btn-ghost btn-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950">
            <Trash2 size={15} /> Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save products you love to your wishlist"
          action={{ label: 'Browse Products', to: '/customer/products' }}
        />
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible"
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div key={item.variationId} variants={staggerItem} exit={{ opacity: 0, scale: 0.9 }}
                className="card overflow-hidden group">
                <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Heart size={40} />
                    </div>
                  )}
                  <button onClick={() => handleRemove(item.variationId)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors">
                    <Heart size={15} fill="currentColor" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">{item.productName}</h3>
                  <p className="text-xs text-gray-400 mb-2">{item.brand}</p>
                  <p className="font-bold text-gray-900 dark:text-white mb-3">{formatCurrency(item.price || 0)}</p>
                  <button onClick={() => moveToCart(item)} className="btn-primary w-full btn-sm">
                    <ShoppingCart size={14} /> Move to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  )
}
