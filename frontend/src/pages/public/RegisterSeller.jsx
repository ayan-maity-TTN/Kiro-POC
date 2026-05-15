import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Store } from 'lucide-react'
import { registerSellerSchema } from '../../utils/validators'
import authService from '../../services/authService'
import { fadeInUp, pageTransition } from '../../animations/variants'
import FormField from '../../components/ui/FormField'

export default function RegisterSeller() {
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [showCPw, setShowCPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSellerSchema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Strip undefined optional fields so backend @Pattern doesn't fire on empty strings
      const payload = Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== undefined && v !== '')
      )
      await authService.registerSeller(payload)
      toast.success('Seller registration submitted! Check your email to activate your account.')
      navigate('/login')
    } catch (err) {
      const data = err.response?.data
      const msg = data?.errors?.[0]
        || data?.message
        || data?.detail
        || 'Registration failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit"
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <motion.div variants={fadeInUp} className="card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
              <Store size={28} />
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Become a Seller</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Start selling on Shoppers Point</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="First Name *" error={errors.firstName?.message}>
                <input {...register('firstName')} placeholder="John" className={`input ${errors.firstName ? 'input-error' : ''}`} />
              </FormField>
              <FormField label="Last Name" error={errors.lastName?.message}>
                <input {...register('lastName')} placeholder="Doe" className="input" />
              </FormField>
            </div>

            <FormField label="Email Address *" error={errors.email?.message}>
              <input {...register('email')} type="email" placeholder="you@example.com" className={`input ${errors.email ? 'input-error' : ''}`} />
            </FormField>

            <FormField label="Company Name *" error={errors.companyName?.message}>
              <input {...register('companyName')} placeholder="Your Business Name" className={`input ${errors.companyName ? 'input-error' : ''}`} />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Company Contact *" error={errors.companyContact?.message}>
                <input {...register('companyContact')} placeholder="9876543210" className={`input ${errors.companyContact ? 'input-error' : ''}`} />
              </FormField>
              <FormField label="GST Number *" error={errors.gst?.message}>
                <input {...register('gst')} placeholder="22AAAAA0000A1Z5" className={`input ${errors.gst ? 'input-error' : ''}`} />
              </FormField>
            </div>

            <FormField label="Password *" error={errors.password?.message}>
              <div className="relative">
                <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="Min 8 chars"
                  className={`input pr-10 ${errors.password ? 'input-error' : ''}`} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormField>

            <FormField label="Confirm Password *" error={errors.confirmPassword?.message}>
              <div className="relative">
                <input {...register('confirmPassword')} type={showCPw ? 'text' : 'password'} placeholder="Repeat password"
                  className={`input pr-10 ${errors.confirmPassword ? 'input-error' : ''}`} />
                <button type="button" onClick={() => setShowCPw(!showCPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showCPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormField>

            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-300">
              Your seller account will be reviewed by admin before activation. You'll receive an email once approved.
            </div>

            <button type="submit" disabled={loading} className="btn-accent w-full btn-lg mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2"><Store size={18} /> Register as Seller</span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
