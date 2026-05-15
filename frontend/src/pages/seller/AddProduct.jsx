import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Save, ArrowLeft } from 'lucide-react'
import { productSchema } from '../../utils/validators'
import sellerService from '../../services/sellerService'
import { pageTransition, fadeInUp } from '../../animations/variants'
import FormField from '../../components/ui/FormField'

export default function SellerAddProduct() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { isCancellable: true, isReturnable: true },
  })

  useEffect(() => {
    sellerService.getLeafCategories()
      .then((res) => setCategories(res.data || []))
      .catch(() => toast.error('Failed to load categories'))
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await sellerService.addProduct(data)
      toast.success('Product added successfully!')
      navigate('/seller/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn-icon btn-ghost"><ArrowLeft size={18} /></button>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Add New Product</h1>
      </div>

      <motion.div variants={fadeInUp} className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField label="Product Name *" error={errors.name?.message}>
            <input {...register('name')} placeholder="e.g. Premium Cotton T-Shirt" className={`input ${errors.name ? 'input-error' : ''}`} />
          </FormField>

          <FormField label="Brand *" error={errors.brand?.message}>
            <input {...register('brand')} placeholder="e.g. Nike, Adidas" className={`input ${errors.brand ? 'input-error' : ''}`} />
          </FormField>

          <FormField label="Category *" error={errors.categoryId?.message}>
            <select {...register('categoryId')} className={`input ${errors.categoryId ? 'input-error' : ''}`}>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Description" error={errors.description?.message}>
            <textarea {...register('description')} rows={4} placeholder="Describe your product..."
              className={`input resize-none ${errors.description ? 'input-error' : ''}`} />
          </FormField>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <input {...register('isCancellable')} type="checkbox" id="cancellable" className="w-4 h-4 rounded text-primary-600" />
              <label htmlFor="cancellable" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                Cancellable
              </label>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <input {...register('isReturnable')} type="checkbox" id="returnable" className="w-4 h-4 rounded text-primary-600" />
              <label htmlFor="returnable" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                Returnable
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary btn-lg">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </span>
              ) : (
                <span className="flex items-center gap-2"><Save size={18} /> Add Product</span>
              )}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary btn-lg">Cancel</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
