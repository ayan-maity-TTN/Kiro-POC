import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ChevronRight, ShoppingBag } from 'lucide-react'
import { pageTransition, staggerContainer, staggerItem } from '../../animations/variants'
import EmptyState from '../../components/ui/EmptyState'
import customerService from '../../services/customerService'
import { formatCurrency } from '../../utils'

const STATUS_COLORS = {
  ORDER_PLACED: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  ORDER_CONFIRMED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  ORDER_SHIPPED: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  DELIVERED: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  RETURN_REQUESTED: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  RETURN_APPROVED: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
  REFUND_COMPLETED: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
}

function statusLabel(s) {
  return s?.replace(/_/g, ' ') || 'PLACED'
}

export default function CustomerOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    customerService.getOrders({ page: 0, size: 20 })
      .then((res) => setOrders(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-5 animate-pulse h-28 bg-gray-100 dark:bg-gray-800" />
        ))}
      </div>
    )
  }

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Your order history will appear here once you place your first order"
          action={{ label: 'Start Shopping', to: '/customer/products' }}
        />
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
          {orders.map((order) => {
            const overallStatus = order.orderProducts?.[0]?.currentStatus || 'ORDER_PLACED'
            const itemCount = order.orderProducts?.length || 0
            return (
              <motion.div key={order.id} variants={staggerItem}>
                <Link to={`/customer/orders/${order.id}`}
                  className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow group">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    {order.orderProducts?.[0]?.imageUrl
                      ? <img src={order.orderProducts[0].imageUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                      : <ShoppingBag size={24} className="text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Order #{order.id}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[overallStatus] || 'bg-gray-100 text-gray-600'}`}>
                        {statusLabel(overallStatus)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {itemCount} item{itemCount !== 1 ? 's' : ''} · {new Date(order.dateCreated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(order.amountPaid || 0)}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </motion.div>
  )
}
