import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Search, ChevronDown } from 'lucide-react'
import { pageTransition, staggerContainer, staggerItem } from '../../animations/variants'
import EmptyState from '../../components/ui/EmptyState'
import adminService from '../../services/adminService'
import { formatCurrency } from '../../utils'
import toast from 'react-hot-toast'
import useDebounce from '../../hooks/useDebounce'

const ALL_STATUSES = [
  'ORDER_PLACED', 'ORDER_CONFIRMED', 'ORDER_SHIPPED', 'DELIVERED',
  'CANCELLED', 'ORDER_REJECTED', 'RETURN_REQUESTED', 'RETURN_APPROVED',
  'PICK_UP_INITIATED', 'PICK_UP_COMPLETED', 'REFUND_INITIATED', 'REFUND_COMPLETED', 'CLOSED',
]

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
  CLOSED: 'bg-gray-100 text-gray-600',
}

function statusLabel(s) { return s?.replace(/_/g, ' ') || 'PLACED' }

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState(null)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const debouncedSearch = useDebounce(search, 400)

  const fetchOrders = () => {
    setLoading(true)
    adminService.getAllOrders({ page: 0, size: 50, filter: debouncedSearch || undefined })
      .then((res) => setOrders(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [debouncedSearch])

  const handleStatusUpdate = async (orderProductId, newStatus) => {
    setUpdating(orderProductId)
    try {
      await adminService.updateOrderStatus({ orderProductId, newStatus })
      toast.success(`Status updated to ${statusLabel(newStatus)}`)
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Orders</h1>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="input pl-9 w-56"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 animate-pulse h-24 bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="No orders found" description="Orders will appear here once customers start placing them" />
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
          {orders.map((order) => (
            <motion.div key={order.id} variants={staggerItem} className="card overflow-hidden">
              {/* Order Header */}
              <button
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                className="w-full p-5 flex items-center gap-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-gray-900 dark:text-white">Order #{order.id}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(order.dateCreated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {order.city}, {order.state} · {order.paymentMethod?.replace(/_/g, ' ')} · {formatCurrency(order.amountPaid || 0)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{order.orderProducts?.length || 0} items</span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Order Items */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                  {order.orderProducts?.map((item) => (
                    <div key={item.orderProductId} className="p-4 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden">
                        {item.imageUrl
                          ? <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                          : <ShoppingBag size={18} className="m-auto mt-2 text-gray-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{item.productName}</p>
                        <p className="text-xs text-gray-400">{item.brand} · Qty: {item.quantity}</p>
                        <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[item.currentStatus] || 'bg-gray-100 text-gray-600'}`}>
                          {statusLabel(item.currentStatus)}
                        </span>
                      </div>
                      {/* Admin status update */}
                      <div className="flex-shrink-0">
                        <select
                          disabled={updating === item.orderProductId}
                          onChange={(e) => e.target.value && handleStatusUpdate(item.orderProductId, e.target.value)}
                          defaultValue=""
                          className="input text-xs py-1 px-2 w-44">
                          <option value="" disabled>Update status...</option>
                          {ALL_STATUSES.filter((s) => s !== item.currentStatus).map((s) => (
                            <option key={s} value={s}>{statusLabel(s)}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
