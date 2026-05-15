import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Plus, Edit2, Search, Tag, X, Save } from 'lucide-react'
import { categorySchema } from '../../utils/validators'
import adminService from '../../services/adminService'
import { pageTransition, staggerContainer, staggerItem, fadeInUp } from '../../animations/variants'
import { debounce } from '../../utils'
import Skeleton from '../../components/ui/Skeleton'
import Pagination from '../../components/ui/Pagination'
import EmptyState from '../../components/ui/EmptyState'
import FormField from '../../components/ui/FormField'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [filter, setFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(categorySchema),
  })

  const fetchCategories = useCallback(() => {
    setLoading(true)
    adminService.getAllCategories({ page, size: 10, sort: 'id', order: 'asc', filter })
      .then((res) => setCategories(res.data || []))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false))
  }, [page, filter])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  const debouncedSearch = useCallback(debounce((val) => { setFilter(val); setPage(0) }, 400), [])

  const openAdd = () => { reset({ name: '', parentCategoryId: null }); setEditId(null); setShowForm(true) }
  const openEdit = (cat) => { reset({ name: cat.name, parentCategoryId: cat.parentCategoryId || null }); setEditId(cat.id); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditId(null) }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      if (editId) {
        await adminService.updateCategory({ id: editId, name: data.name, parentCategoryId: data.parentCategoryId || null })
        toast.success('Category updated!')
      } else {
        await adminService.addCategory({ name: data.name, parentCategoryId: data.parentCategoryId || null })
        toast.success('Category added!')
      }
      closeForm()
      fetchCategories()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Categories</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input defaultValue={filter} onChange={(e) => debouncedSearch(e.target.value)} placeholder="Search..." className="input pl-9 w-48" />
          </div>
          <button onClick={openAdd} className="btn-primary btn-sm"><Plus size={16} /> Add Category</button>
        </div>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" exit="exit" className="card p-6 max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">{editId ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={closeForm} className="btn-icon btn-ghost"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField label="Category Name *" error={errors.name?.message}>
                <input {...register('name')} placeholder="e.g. Electronics" className={`input ${errors.name ? 'input-error' : ''}`} />
              </FormField>
              <FormField label="Parent Category ID" error={errors.parentCategoryId?.message}>
                <input {...register('parentCategoryId')} type="number" placeholder="Leave empty for root category" className="input" />
              </FormField>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : <span className="flex items-center gap-2"><Save size={16} /> {editId ? 'Update' : 'Add'}</span>}
                </button>
                <button type="button" onClick={closeForm} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
      ) : categories.length === 0 ? (
        <EmptyState icon={Tag} title="No categories found" description="Add your first category" action={{ label: 'Add Category', onClick: openAdd }} />
      ) : (
        <>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="card overflow-hidden">
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Parent</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <motion.tr key={cat.id} variants={staggerItem}>
                      <td className="text-gray-400 font-mono text-xs">#{cat.id}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Tag size={14} className="text-primary-500" />
                          <span className="font-medium text-gray-900 dark:text-white">{cat.name}</span>
                        </div>
                      </td>
                      <td className="text-gray-500">{cat.parentCategoryName || <span className="text-gray-300">Root</span>}</td>
                      <td>
                        <button onClick={() => openEdit(cat)} className="btn-icon btn-ghost text-primary-500">
                          <Edit2 size={15} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
          <Pagination page={page} onPageChange={setPage} hasNext={categories.length === 10} />
        </>
      )}
    </motion.div>
  )
}
