import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import { pageTransition, staggerItem, fadeInUp } from '../../animations/variants'
import { formatCurrency } from '../../utils'
import EmptyState from '../../components/ui/EmptyState'
import customerService from '../../services/customerService'
import toast from 'react-hot-toast'

export default function CustomerCart() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  const fetchCart = async () => {
    try {
      const res = await customerService.getCart()
      setItems(res.data || [])
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCart() }, [])

  const total = items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0)
  const shipping = total > 499 ? 0 : 49
  const tax = Math.round(total * 0.18)
  const grandTotal = total + shipping + tax

  const handleUpdate = async (variationId, quantity) => {
    setUpdating(variationId)
    try {
      await customerService.updateCartItem(variationId, quantity)
      await fetchCart()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update cart')
    } finally {
      setUpdating(null)
    }
  }

  const handleRemove = async (variationId) => {
    setUpdating(variationId)
    try {
      await customerService.removeFromCart(variationId)
      setItems((prev) => prev.filter((i) => i.variationId !== variationId))
      toast.success('Item removed')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove item')
    } finally {
      setUpdating(null)
    }
  }

  const handleClear = async () => {
    try {
      await customerService.clearCart()
      setItems([])
      toast.success('Cart cleared')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to clear cart')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-4 animate-pulse h-24 bg-gray-100 dark:bg-gray-800" />
        ))}
      </div>
    )
  }

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
          My Cart {items.length > 0 && <span className="text-gray-400 font-normal text-lg">({items.length})</span>}
        </h1>
        {items.length > 0 && (
          <button onClick={handleClear} className="btn-ghost btn-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950">
            <Trash2 size={15} /> Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Add some products to your cart to get started"
          action={{ label: 'Browse Products', to: '/customer/products' }}
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div key={item.variationId} variants={staggerItem} initial="hidden" animate="visible"
                  exit={{ opacity: 0, x: -20 }} className="card p-4 flex gap-4">
                  <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingBag size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">{item.productName}</h3>
                    <p className="text-xs text-gray-400">{item.brand}</p>
                    <p className="text-primary-600 font-bold mt-1">{formatCurrency(item.price || 0)}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          disabled={updating === item.variationId}
                          onClick={() => handleUpdate(item.variationId, (item.quantity || 1) - 1)}
                          className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50">
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity || 1}</span>
                        <button
                          disabled={updating === item.variationId || item.quantity >= item.quantityAvailable}
                          onClick={() => handleUpdate(item.variationId, (item.quantity || 1) + 1)}
                          className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50">
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        disabled={updating === item.variationId}
                        onClick={() => handleRemove(item.variationId)}
                        className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal ({items.length} items)</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-500 font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>GST (18%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Add {formatCurrency(499 - total)} more for free shipping
                  </p>
                )}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>
              <Link to="/customer/checkout" className="btn-primary w-full btn-lg mt-4">
                Proceed to Checkout <ArrowRight size={18} />
              </Link>
            </div>

            <div className="card p-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>✓ Secure checkout with SSL encryption</p>
              <p>✓ Easy 7-day returns</p>
              <p>✓ 24/7 customer support</p>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
