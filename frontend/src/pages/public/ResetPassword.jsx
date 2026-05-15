import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react'
import { resetPasswordSchema } from '../../utils/validators'
import authService from '../../services/authService'
import { fadeInUp, pageTransition } from '../../animations/variants'
import FormField from '../../components/ui/FormField'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [showPw, setShowPw] = useState(false)
  const [showCPw, setShowCPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid or missing reset token')
      return
    }
    setLoading(true)
    try {
      await authService.resetPassword(token, { password: data.password, confirmPassword: data.confirmPassword })
      setDone(true)
      toast.success('Password reset successfully!')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password'
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
          {done ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">Password Reset!</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Your password has been reset successfully. You can now log in with your new password.</p>
              <Link to="/login" className="btn-primary w-full">Go to Login</Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl hero-gradient flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                  <Lock size={28} />
                </div>
                <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Reset Password</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Enter your new password below</p>
              </div>

              {!token && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600 dark:text-red-400 mb-4">
                  Invalid or missing reset token. Please request a new password reset link.
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <FormField label="New Password" error={errors.password?.message}>
                  <div className="relative">
                    <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="Min 8 chars"
                      className={`input pr-10 ${errors.password ? 'input-error' : ''}`} />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </FormField>

                <FormField label="Confirm New Password" error={errors.confirmPassword?.message}>
                  <div className="relative">
                    <input {...register('confirmPassword')} type={showCPw ? 'text' : 'password'} placeholder="Repeat password"
                      className={`input pr-10 ${errors.confirmPassword ? 'input-error' : ''}`} />
                    <button type="button" onClick={() => setShowCPw(!showCPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showCPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </FormField>

                <button type="submit" disabled={loading || !token} className="btn-primary w-full btn-lg">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Resetting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2"><Lock size={18} /> Reset Password</span>
                  )}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
