import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Store, Camera, Save, Lock, Eye, EyeOff, MapPin } from 'lucide-react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { selectUser, updateUser } from '../../store/slices/authSlice'
import sellerService from '../../services/sellerService'
import { changePasswordSchema, addressSchema } from '../../utils/validators'
import { pageTransition, fadeInUp } from '../../animations/variants'
import FormField from '../../components/ui/FormField'
import Skeleton from '../../components/ui/Skeleton'

const sellerProfileSchema = z.object({
  firstName: z.string().min(3).max(255).regex(/^[a-zA-Z]+$/, 'Only letters'),
  lastName: z.string().optional(),
  companyName: z.string().min(3).max(255),
  companyContact: z.string().regex(/^[1-9][0-9]{9}$/, 'Must be 10 digits'),
})

export default function SellerProfile() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingAddr, setSavingAddr] = useState(false)
  const [changingPw, setChangingPw] = useState(false)
  const [showPwForm, setShowPwForm] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [savedImageUrl, setSavedImageUrl] = useState(null)
  const fileRef = useRef()

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(sellerProfileSchema) })
  const { register: regAddr, handleSubmit: handleAddr, reset: resetAddr, formState: { errors: addrErrors } } = useForm({ resolver: zodResolver(addressSchema) })
  const { register: regPw, handleSubmit: handlePw, reset: resetPw, formState: { errors: pwErrors } } = useForm({ resolver: zodResolver(changePasswordSchema) })

  useEffect(() => {
    sellerService.getProfile()
      .then((res) => {
        const p = res.data
        reset({ firstName: p.firstName || '', lastName: p.lastName || '', companyName: p.companyName || '', companyContact: p.companyContact || '' })
        if (p.address) resetAddr(p.address)
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
      Object.entries(data).forEach(([k, v]) => { if (v) formData.append(k, v) })
      if (fileRef.current?.files[0]) formData.append('image', fileRef.current.files[0])
      await sellerService.updateProfile(formData)
      // Refresh to get updated image URL
      const updated = await sellerService.getProfile()
      if (updated.data.profileImageUrl) setSavedImageUrl(updated.data.profileImageUrl)
      dispatch(updateUser(data))
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const onSaveAddress = async (data) => {
    setSavingAddr(true)
    try {
      await sellerService.updateAddress(user?.addressId || 1, data)
      toast.success('Address updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Address update failed')
    } finally {
      setSavingAddr(false)
    }
  }

  const onChangePassword = async (data) => {
    setChangingPw(true)
    try {
      await sellerService.updatePassword({
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      toast.success('Password changed!')
      resetPw()
      setShowPwForm(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed')
    } finally {
      setChangingPw(false)
    }
  }

  if (loading) return (
    <div className="space-y-4 max-w-2xl">
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  )

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Seller Profile</h1>

      {/* Profile */}
      <motion.div variants={fadeInUp} className="card p-6">
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {imagePreview ? <img src={imagePreview} alt="avatar" className="w-full h-full object-cover" /> : savedImageUrl ? <img src={savedImageUrl} alt="avatar" className="w-full h-full object-cover" /> : <Store size={32} />}
            </div>
            <button onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-accent-600 text-white flex items-center justify-center hover:bg-accent-700 transition-colors shadow-md">
              <Camera size={14} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files[0]; if (f) setImagePreview(URL.createObjectURL(f)) }} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">{user?.companyName}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="badge badge-warning mt-1">Seller</span>
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
          <FormField label="Company Name *" error={errors.companyName?.message}>
            <input {...register('companyName')} className={`input ${errors.companyName ? 'input-error' : ''}`} />
          </FormField>
          <FormField label="Company Contact *" error={errors.companyContact?.message}>
            <input {...register('companyContact')} className={`input ${errors.companyContact ? 'input-error' : ''}`} />
          </FormField>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : <span className="flex items-center gap-2"><Save size={16} /> Save Profile</span>}
          </button>
        </form>
      </motion.div>

      {/* Address */}
      <motion.div variants={fadeInUp} className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={18} className="text-primary-500" />
          <h2 className="font-semibold text-gray-900 dark:text-white">Business Address</h2>
        </div>
        <form onSubmit={handleAddr(onSaveAddress)} className="space-y-4">
          <FormField label="Address Line *" error={addrErrors.addressLine?.message}>
            <input {...regAddr('addressLine')} className={`input ${addrErrors.addressLine ? 'input-error' : ''}`} />
          </FormField>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="City *" error={addrErrors.city?.message}>
              <input {...regAddr('city')} className={`input ${addrErrors.city ? 'input-error' : ''}`} />
            </FormField>
            <FormField label="State *" error={addrErrors.state?.message}>
              <input {...regAddr('state')} className={`input ${addrErrors.state ? 'input-error' : ''}`} />
            </FormField>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Country *" error={addrErrors.country?.message}>
              <input {...regAddr('country')} className={`input ${addrErrors.country ? 'input-error' : ''}`} />
            </FormField>
            <FormField label="ZIP Code *" error={addrErrors.zipCode?.message}>
              <input {...regAddr('zipCode')} className={`input ${addrErrors.zipCode ? 'input-error' : ''}`} />
            </FormField>
          </div>
          <FormField label="Label *" error={addrErrors.label?.message}>
            <input {...regAddr('label')} placeholder="Office / Warehouse" className={`input ${addrErrors.label ? 'input-error' : ''}`} />
          </FormField>
          <button type="submit" disabled={savingAddr} className="btn-primary">
            {savingAddr ? 'Saving...' : <span className="flex items-center gap-2"><Save size={16} /> Save Address</span>}
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
          <button onClick={() => setShowPwForm(!showPwForm)} className="btn-secondary btn-sm">{showPwForm ? 'Cancel' : 'Change'}</button>
        </div>
        {showPwForm && (
          <form onSubmit={handlePw(onChangePassword)} className="space-y-4">
            <FormField label="New Password" error={pwErrors.password?.message}>
              <div className="relative">
                <input {...regPw('password')} type={showNew ? 'text' : 'password'} className={`input pr-10 ${pwErrors.password ? 'input-error' : ''}`} />
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
