import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle, Loader, Mail } from 'lucide-react'
import authService from '../../services/authService'
import { fadeInUp, pageTransition } from '../../animations/variants'

export default function ActivateAccount() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('loading') // loading | success | error
  const [resendEmail, setResendEmail] = useState('')
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }
    authService.activateAccount(token)
      .then(() => {
        setStatus('success')
        toast.success('Account activated successfully!')
      })
      .catch((err) => {
        setStatus('error')
        const msg = err.response?.data?.message || 'Activation failed'
        toast.error(msg)
      })
  }, [token])

  const handleResend = async () => {
    if (!resendEmail) return
    setResending(true)
    try {
      await authService.resendActivation(resendEmail)
      toast.success('Activation link resent! Check your email.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend')
    } finally {
      setResending(false)
    }
  }

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit"
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <motion.div variants={fadeInUp} className="card p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-4">
                <Loader size={32} className="text-primary-500 animate-spin" />
              </div>
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">Activating Account...</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Please wait while we verify your account.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">Account Activated!</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Your account has been successfully activated. You can now log in and start shopping.
              </p>
              <Link to="/login" className="btn-primary w-full btn-lg">Go to Login</Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mx-auto mb-4">
                <XCircle size={32} className="text-red-500" />
              </div>
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">Activation Failed</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                The activation link is invalid or has expired. Request a new one below.
              </p>

              <div className="space-y-3 text-left">
                <label className="label">Enter your email to resend activation link</label>
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input"
                />
                <button onClick={handleResend} disabled={resending || !resendEmail} className="btn-primary w-full">
                  {resending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2"><Mail size={16} /> Resend Activation Link</span>
                  )}
                </button>
              </div>

              <Link to="/login" className="inline-block mt-4 text-sm text-gray-500 hover:text-primary-600">Back to Login</Link>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
