import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { User, Camera, Save, Lock, Eye, EyeOff } from 'lucide-react'
import { z } from 'zod'
import { selectUser, updateUser } from '../../store/slices/authSlice'
import customerService from '../../services/customerService'
import { changePasswordSchema } from '../../utils/validators'
import { pageTransition, fadeInUp } from '../../animations/variants'
import FormField from '../../components/ui/FormField'
import Skeleton from '../../components/ui/Skeleton'

const profileSchema = z.object({
  firstName: z.string().min(3).max(255).regex(/^[a-zA-Z]+$/, 'Only letters'),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().regex(/^[1-9][0-9]{9}$/, 'Must be 10 digits').optional().or(z.literal('')),
})

export default function CustomerProfile() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changingPw, setChangingPw] = useState(false)
  const [showPwForm, setShowPwForm] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [savedImageUrl, setSavedImageUrl] = useState(null)
  const fileRef = useRef()

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
  })

  const { register: regPw, handleSubmit: handlePw, reset: resetPw, formState: { errors: pwErrors } } = useForm({
    resolver: zodResolver(changePasswordSchema),
  })

  useEffect(() => {
    customerService.getProfile()
      .then((res) => {
        const p = res.data
        reset({
          firstName: p.firstName || '',
          middleName: p.middleName || '',
          lastName: p.lastName || '',
          phoneNumber: p.contact || p.phoneNumber || '',
        })
        if (p.profileImageUrl) setSavedImageUrl(p.profileImageUrl)
        dispatch(updateUser(p))
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const onSaveProfile = async (data) => {
    setSaving(true)
    try {
      const formData = new FormData()
      // Only append non-empty values to avoid backend @Pattern failures on empty strings
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined && v !== '') formData.append(k, v)
      })
      if (fileRef.current?.files[0]) formData.append('image', fileRef.current.files[0])
      const res = await customerService.updateProfile(formData)
      // Refresh profile to get updated image URL
      const updated = await customerService.getProfile()
      if (updated.data.profileImageUrl) setSavedImageUrl(updated.data.profileImageUrl)
      dispatch(updateUser({ ...data }))
      toast.success('Profile updated successfully!')
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.detail || 'Update failed'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const onChangePassword = async (data) => {
    setChangingPw(true)
    try {
      await customerService.updatePassword({
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      toast.success('Password changed successfully!')
      resetPw()
      setShowPwForm(false)
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.detail || 'Password change failed'
      toast.error(msg)
    } finally {
      setChangingPw(false)
    }
  }

  if (loading) return (
    <div className="space-y-4">
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  )

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">My Profile</h1>

      {/* Profile Card */}
      <motion.div variants={fadeInUp} className="card p-6">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="relative">
            <div className="w-20 h-20 rounded-full hero-gradient flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="avatar" className="w-full h-full object-cover" />
              ) : savedImageUrl ? (
                <img src={savedImageUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={32} />
              )}
            </div>
            <button onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors shadow-md">
              <Camera size={14} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) setImagePreview(URL.createObjectURL(file))
              }} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <span className="badge badge-primary mt-1">Customer</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="First Name *" error={errors.firstName?.message}>
              <input {...register('firstName')} className={`input ${errors.firstName ? 'input-error' : ''}`} />
            </FormField>
            <FormField label="Last Name" error={errors.lastName?.message}>
              <input {...register('lastName')} className="input" />
            </FormField>
          </div>
          <FormField label="Middle Name" error={errors.middleName?.message}>
            <input {...register('middleName')} className="input" />
          </FormField>
          <FormField label="Phone Number" error={errors.phoneNumber?.message}>
            <input {...register('phoneNumber')} className={`input ${errors.phoneNumber ? 'input-error' : ''}`} />
          </FormField>

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2"><Save size={16} /> Save Changes</span>
            )}
          </button>
        </form>
      </motion.div>

      {/* Change Password */}
      <motion.div variants={fadeInUp} className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lock size={18} className="text-primary-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Change Password</h2>
          </div>
          <button onClick={() => setShowPwForm(!showPwForm)} className="btn-secondary btn-sm">
            {showPwForm ? 'Cancel' : 'Change'}
          </button>
        </div>

        {showPwForm && (
          <form onSubmit={handlePw(onChangePassword)} className="space-y-4">
            <FormField label="New Password" error={pwErrors.password?.message}>
              <div className="relative">
                <input {...regPw('password')} type={showNew ? 'text' : 'password'}
                  placeholder="Min 8 chars, upper, lower, number, special"
                  className={`input pr-10 ${pwErrors.password ? 'input-error' : ''}`} />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormField>
            <FormField label="Confirm New Password" error={pwErrors.confirmPassword?.message}>
              <input {...regPw('confirmPassword')} type="password" className={`input ${pwErrors.confirmPassword ? 'input-error' : ''}`} />
            </FormField>
            <button type="submit" disabled={changingPw} className="btn-primary">
              {changingPw ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}
