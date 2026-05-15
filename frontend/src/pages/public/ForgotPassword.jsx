import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { forgotPasswordSchema } from '../../utils/validators'
import authService from '../../services/authService'
import { fadeInUp, pageTransition } from '../../animations/variants'
import FormField from '../../components/ui/FormField'

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await authService.forgotPassword(data.email)
      setSent(true)
      toast.success('Password reset link sent to your email!')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send reset link'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit"
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <motion.div variants={fadeInUp} className="card p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">Check your email</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
              </p>
              <Link to="/login" className="btn-primary w-full">
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                  <Mail size={28} />
                </div>
                <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Forgot Password?</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Enter your email to receive a reset link</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <FormField label="Email Address" error={errors.email?.message}>
                  <input {...register('email')} type="email" placeholder="you@example.com"
                    className={`input ${errors.email ? 'input-error' : ''}`} />
                </FormField>

                <button type="submit" disabled={loading} className="btn-primary w-full btn-lg">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2"><Mail size={18} /> Send Reset Link</span>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors">
                  <ArrowLeft size={16} /> Back to Login
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
