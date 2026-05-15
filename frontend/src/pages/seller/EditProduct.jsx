import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Save, ArrowLeft } from 'lucide-react'
import { z } from 'zod'
import sellerService from '../../services/sellerService'
import { pageTransition, fadeInUp } from '../../animations/variants'
import FormField from '../../components/ui/FormField'
import Skeleton from '../../components/ui/Skeleton'

const updateSchema = z.object({
  name: z.string().min(2).max(255),
  brand: z.string().min(2).max(255),
  description: z.string().min(5).max(255).optional().or(z.literal('')),
  isCancellable: z.boolean().optional(),
  isReturnable: z.boolean().optional(),
})

export default function SellerEditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(updateSchema),
  })

  useEffect(() => {
    sellerService.getProduct(id)
      .then((res) => {
        const p = res.data
        reset({
          name: p.name || '',
          brand: p.brand || '',
          description: p.description || '',
          isCancellable: p.isCancellable ?? true,
          isReturnable: p.isReturnable ?? true,
        })
      })
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setLoading(false))
  }, [id])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      await sellerService.updateProduct(id, data)
      toast.success('Product updated successfully!')
      navigate('/seller/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="space-y-4 max-w-2xl">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  )

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn-icon btn-ghost"><ArrowLeft size={18} /></button>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Edit Product</h1>
      </div>

      <motion.div variants={fadeInUp} className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField label="Product Name *" error={errors.name?.message}>
            <input {...register('name')} className={`input ${errors.name ? 'input-error' : ''}`} />
          </FormField>

          <FormField label="Brand *" error={errors.brand?.message}>
            <input {...register('brand')} className={`input ${errors.brand ? 'input-error' : ''}`} />
          </FormField>

          <FormField label="Description" error={errors.description?.message}>
            <textarea {...register('description')} rows={4} className={`input resize-none ${errors.description ? 'input-error' : ''}`} />
          </FormField>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <input {...register('isCancellable')} type="checkbox" id="cancellable" className="w-4 h-4 rounded text-primary-600" />
              <label htmlFor="cancellable" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">Cancellable</label>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <input {...register('isReturnable')} type="checkbox" id="returnable" className="w-4 h-4 rounded text-primary-600" />
              <label htmlFor="returnable" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">Returnable</label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary btn-lg">
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2"><Save size={18} /> Save Changes</span>
              )}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary btn-lg">Cancel</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
