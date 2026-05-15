import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, ChevronDown } from 'lucide-react'
import { pageTransition, staggerContainer, staggerItem } from '../../animations/variants'
import EmptyState from '../../components/ui/EmptyState'
import sellerService from '../../services/sellerService'
import { formatCurrency } from '../../utils'
import toast from 'react-hot-toast'

const SELLER_STATUS_TRANSITIONS = {
  ORDER_PLACED: ['ORDER_CONFIRMED', 'ORDER_REJECTED'],
  ORDER_CONFIRMED: ['ORDER_SHIPPED'],
  ORDER_SHIPPED: ['DELIVERED'],
  RETURN_REQUESTED: ['RETURN_APPROVED', 'RETURN_REJECTED'],
  RETURN_APPROVED: ['PICK_UP_INITIATED'],
  PICK_UP_INITIATED: ['PICK_UP_COMPLETED'],
  PICK_UP_COMPLETED: ['REFUND_INITIATED'],
  REFUND_INITIATED: ['REFUND_COMPLETED'],
}

const STATUS_COLORS = {
  ORDER_PLACED: 'bg-blue-100 text-blue-700',
  ORDER_CONFIRMED: 'bg-indigo-100 text-indigo-700',
  ORDER_SHIPPED: 'bg-yellow-100 text-yellow-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  ORDER_REJECTED: 'bg-red-100 text-red-700',
  RETURN_REQUESTED: 'bg-orange-100 text-orange-700',
  RETURN_APPROVED: 'bg-teal-100 text-teal-700',
  REFUND_COMPLETED: 'bg-purple-100 text-purple-700',
}

function statusLabel(s) { return s?.replace(/_/g, ' ') || 'PLACED' }

export default function SellerOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  const fetchOrders = () => {
    sellerService.getOrders({ page: 0, size: 50 })
      .then((res) => setOrders(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])

  const handleStatusUpdate = async (orderProductId, newStatus) => {
    setUpdating(orderProductId)
    try {
      await sellerService.updateOrderStatus({ orderProductId, newStatus })
      toast.success(`Status updated to ${statusLabel(newStatus)}`)
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-5 animate-pulse h-28 bg-gray-100 dark:bg-gray-800" />
        ))}
      </div>
    )
  }

  // Flatten all order products across orders
  const allItems = orders.flatMap((order) =>
    (order.orderProducts || []).map((op) => ({ ...op, order }))
  )

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Orders</h1>

      {allItems.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="Customer orders for your products will appear here"
        />
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
          {allItems.map((item) => {
            const nextStatuses = SELLER_STATUS_TRANSITIONS[item.currentStatus] || []
            return (
              <motion.div key={item.orderProductId} variants={staggerItem} className="card p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden">
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                      : <ShoppingBag size={20} className="m-auto mt-3 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.productName}</p>
                        <p className="text-xs text-gray-400">{item.brand}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Order #{item.order.id} · Qty: {item.quantity} · {formatCurrency(item.price || 0)} each
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.order.city}, {item.order.state}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${STATUS_COLORS[item.currentStatus] || 'bg-gray-100 text-gray-600'}`}>
                        {statusLabel(item.currentStatus)}
                      </span>
                    </div>

                    {nextStatuses.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {nextStatuses.map((ns) => (
                          <button
                            key={ns}
                            disabled={updating === item.orderProductId}
                            onClick={() => handleStatusUpdate(item.orderProductId, ns)}
                            className="btn-secondary btn-sm text-xs disabled:opacity-50">
                            {updating === item.orderProductId
                              ? <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                              : null}
                            Mark as {statusLabel(ns)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </motion.div>
  )
}
