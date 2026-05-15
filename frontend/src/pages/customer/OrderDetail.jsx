import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Package, MapPin, CreditCard, RotateCcw, XCircle, ShoppingBag } from 'lucide-react'
import { pageTransition, staggerContainer, staggerItem } from '../../animations/variants'
import customerService from '../../services/customerService'
import { formatCurrency } from '../../utils'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  ORDER_PLACED: 'bg-blue-100 text-blue-700',
  ORDER_CONFIRMED: 'bg-indigo-100 text-indigo-700',
  ORDER_SHIPPED: 'bg-yellow-100 text-yellow-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  RETURN_REQUESTED: 'bg-orange-100 text-orange-700',
  RETURN_APPROVED: 'bg-teal-100 text-teal-700',
  REFUND_COMPLETED: 'bg-purple-100 text-purple-700',
}

function statusLabel(s) { return s?.replace(/_/g, ' ') || 'PLACED' }

export default function CustomerOrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  const fetchOrder = () => {
    customerService.getOrderDetail(id)
      .then((res) => setOrder(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrder() }, [id])

  const handleCancel = async (orderProductId) => {
    setActionLoading(orderProductId)
    try {
      await customerService.cancelOrderItem(orderProductId)
      toast.success('Order item cancelled')
      fetchOrder()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel this item')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReturn = async (orderProductId) => {
    setActionLoading(orderProductId)
    try {
      await customerService.returnOrderItem(orderProductId)
      toast.success('Return request submitted')
      fetchOrder()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot return this item')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 max-w-3xl">
        <div className="card p-5 animate-pulse h-32 bg-gray-100 dark:bg-gray-800" />
        <div className="card p-5 animate-pulse h-48 bg-gray-100 dark:bg-gray-800" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="card p-8 text-center max-w-3xl">
        <Package size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Order not found</p>
        <Link to="/customer/orders" className="btn-primary btn-sm mt-4 inline-flex">Back to Orders</Link>
      </div>
    )
  }

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link to="/customer/orders" className="btn-icon btn-ghost"><ArrowLeft size={18} /></Link>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Order #{order.id}</h1>
      </div>

      {/* Order Info */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-xs text-gray-400 mb-1">Date</p>
          <p className="font-medium text-gray-900 dark:text-white text-sm">
            {new Date(order.dateCreated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><CreditCard size={12} /> Payment</p>
          <p className="font-medium text-gray-900 dark:text-white text-sm">{order.paymentMethod?.replace(/_/g, ' ')}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-400 mb-1">Total Paid</p>
          <p className="font-bold text-primary-600 text-sm">{formatCurrency(order.amountPaid || 0)}</p>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="card p-4">
        <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><MapPin size={12} /> Delivery Address</p>
        <p className="font-medium text-gray-900 dark:text-white text-sm">{order.label}</p>
        <p className="text-sm text-gray-500">{order.addressLine}, {order.city}, {order.state} - {order.zipCode}</p>
        <p className="text-sm text-gray-500">{order.country}</p>
      </div>

      {/* Order Items */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Items</h2>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
          {order.orderProducts?.map((item) => (
            <motion.div key={item.orderProductId} variants={staggerItem}
              className="flex items-start gap-4 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
              <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden">
                {item.imageUrl
                  ? <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                  : <ShoppingBag size={20} className="m-auto mt-3 text-gray-300" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white text-sm">{item.productName}</p>
                <p className="text-xs text-gray-400">{item.brand}</p>
                <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity} · {formatCurrency(item.price || 0)} each</p>
                <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[item.currentStatus] || 'bg-gray-100 text-gray-600'}`}>
                  {statusLabel(item.currentStatus)}
                </span>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                {(item.currentStatus === 'ORDER_PLACED' || item.currentStatus === 'ORDER_CONFIRMED') && (
                  <button
                    disabled={actionLoading === item.orderProductId}
                    onClick={() => handleCancel(item.orderProductId)}
                    className="btn-ghost btn-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 text-xs">
                    <XCircle size={13} /> Cancel
                  </button>
                )}
                {item.currentStatus === 'DELIVERED' && (
                  <button
                    disabled={actionLoading === item.orderProductId}
                    onClick={() => handleReturn(item.orderProductId)}
                    className="btn-ghost btn-sm text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950 text-xs">
                    <RotateCcw size={13} /> Return
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
