import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { MapPin, CreditCard, ShoppingBag, CheckCircle, ChevronRight } from 'lucide-react'
import customerService from '../../services/customerService'
import { pageTransition, fadeInUp } from '../../animations/variants'
import { formatCurrency } from '../../utils'

const STEPS = ['Address', 'Payment', 'Review']

export default function CustomerCheckout() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [addresses, setAddresses] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY')
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    Promise.all([customerService.getAddresses(), customerService.getCart()])
      .then(([addrRes, cartRes]) => {
        const addrs = addrRes.data || []
        setAddresses(addrs)
        if (addrs.length > 0) setSelectedAddress(addrs[0])
        const cart = cartRes.data || []
        setCartItems(cart)
        if (cart.length === 0) navigate('/customer/cart')
      })
      .catch(() => navigate('/customer/cart'))
  }, [])

  const total = cartItems.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0)
  const shipping = total > 499 ? 0 : 49
  const tax = Math.round(total * 0.18)
  const grandTotal = total + shipping + tax

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { toast.error('Please select a delivery address'); return }
    setPlacing(true)
    try {
      await customerService.placeOrder({
        addressId: selectedAddress.id,
        paymentMethod,
      })
      toast.success('Order placed successfully!')
      navigate('/customer/orders')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Checkout</h1>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
              i === step ? 'bg-primary-600 text-white'
              : i < step ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
              {i < step ? <CheckCircle size={14} /> : (
                <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-xs">{i + 1}</span>
              )}
              {s}
            </div>
            {i < STEPS.length - 1 && <ChevronRight size={16} className="text-gray-300" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Step 0: Address */}
          {step === 0 && (
            <motion.div variants={fadeInUp} className="space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin size={18} className="text-primary-500" /> Select Delivery Address
              </h2>
              {addresses.length === 0 ? (
                <div className="card p-6 text-center">
                  <p className="text-gray-500 mb-3">No addresses found</p>
                  <a href="/customer/addresses" className="btn-primary btn-sm">Add Address</a>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr, idx) => (
                    <div key={idx}
                      onClick={() => setSelectedAddress(addr)}
                      className={`card p-4 cursor-pointer transition-all ${
                        selectedAddress === addr ? 'border-2 border-primary-500 bg-primary-50 dark:bg-primary-950'
                        : 'hover:shadow-card-hover'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          selectedAddress === addr ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}`}>
                          {selectedAddress === addr && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{addr.label}</p>
                          <p className="text-sm text-gray-500">{addr.addressLine}, {addr.city}, {addr.state} - {addr.zipCode}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => setStep(1)} disabled={!selectedAddress} className="btn-primary btn-lg">
                Continue to Payment <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <motion.div variants={fadeInUp} className="space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CreditCard size={18} className="text-primary-500" /> Payment Method
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'CASH_ON_DELIVERY', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
                  { value: 'UPI', label: 'UPI', icon: '📱', desc: 'Pay via UPI apps' },
                  { value: 'CREDIT_CARD', label: 'Credit Card', icon: '💳', desc: 'Visa, Mastercard, Amex' },
                  { value: 'DEBIT_CARD', label: 'Debit Card', icon: '🏦', desc: 'All major banks supported' },
                ].map((pm) => (
                  <div key={pm.value}
                    onClick={() => setPaymentMethod(pm.value)}
                    className={`card p-4 cursor-pointer transition-all ${
                      paymentMethod === pm.value ? 'border-2 border-primary-500 bg-primary-50 dark:bg-primary-950'
                      : 'hover:shadow-card-hover'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === pm.value ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}`}>
                        {paymentMethod === pm.value && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-xl">{pm.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{pm.label}</p>
                        <p className="text-xs text-gray-500">{pm.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="btn-secondary btn-lg">Back</button>
                <button onClick={() => setStep(2)} className="btn-primary btn-lg flex-1">
                  Review Order <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <motion.div variants={fadeInUp} className="space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <ShoppingBag size={18} className="text-primary-500" /> Review Order
              </h2>
              <div className="card p-4 space-y-3">
                {cartItems.map((item) => (
                  <div key={item.variationId} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden">
                      {item.imageUrl
                        ? <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                        : <ShoppingBag size={20} className="m-auto mt-2 text-gray-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.productName}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency((item.price || 0) * (item.quantity || 1))}
                    </p>
                  </div>
                ))}
              </div>
              {selectedAddress && (
                <div className="card p-4">
                  <p className="text-xs text-gray-400 mb-1">Delivering to</p>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{selectedAddress.label}</p>
                  <p className="text-sm text-gray-500">{selectedAddress.addressLine}, {selectedAddress.city}</p>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary btn-lg">Back</button>
                <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary btn-lg flex-1">
                  {placing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Placing Order...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2"><CheckCircle size={18} /> Place Order</span>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Summary */}
        <motion.div variants={fadeInUp} className="card p-5 h-fit">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Price Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Subtotal</span><span>{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'text-green-500' : ''}>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>GST (18%)</span><span>{formatCurrency(tax)}</span>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between font-bold text-gray-900 dark:text-white">
              <span>Total</span><span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
