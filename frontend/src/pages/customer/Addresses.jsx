import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Plus, MapPin, Edit2, Trash2, X, Save } from 'lucide-react'
import { addressSchema } from '../../utils/validators'
import customerService from '../../services/customerService'
import { pageTransition, staggerContainer, staggerItem, fadeInUp } from '../../animations/variants'
import FormField from '../../components/ui/FormField'
import Skeleton from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

export default function CustomerAddresses() {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(addressSchema),
  })

  const fetchAddresses = () => {
    setLoading(true)
    customerService.getAddresses()
      .then((res) => setAddresses(res.data || []))
      .catch(() => toast.error('Failed to load addresses'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAddresses() }, [])

  const openAdd = () => { reset({}); setEditId(null); setShowForm(true) }
  const openEdit = (addr) => { reset(addr); setEditId(addr.id); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditId(null); reset({}) }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      if (editId) {
        await customerService.updateAddress(editId, data)
        toast.success('Address updated!')
      } else {
        await customerService.addAddress(data)
        toast.success('Address added!')
      }
      closeForm()
      fetchAddresses()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await customerService.deleteAddress(deleteId)
      toast.success('Address deleted')
      setDeleteId(null)
      fetchAddresses()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">My Addresses</h1>
        <button onClick={openAdd} className="btn-primary btn-sm">
          <Plus size={16} /> Add Address
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" exit="exit" className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 dark:text-white">{editId ? 'Edit Address' : 'Add New Address'}</h2>
              <button onClick={closeForm} className="btn-icon btn-ghost"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField label="Address Line *" error={errors.addressLine?.message}>
                <input {...register('addressLine')} placeholder="Street, Building, Area" className={`input ${errors.addressLine ? 'input-error' : ''}`} />
              </FormField>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="City *" error={errors.city?.message}>
                  <input {...register('city')} placeholder="Mumbai" className={`input ${errors.city ? 'input-error' : ''}`} />
                </FormField>
                <FormField label="State *" error={errors.state?.message}>
                  <input {...register('state')} placeholder="Maharashtra" className={`input ${errors.state ? 'input-error' : ''}`} />
                </FormField>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Country *" error={errors.country?.message}>
                  <input {...register('country')} placeholder="India" className={`input ${errors.country ? 'input-error' : ''}`} />
                </FormField>
                <FormField label="ZIP Code *" error={errors.zipCode?.message}>
                  <input {...register('zipCode')} placeholder="400001" className={`input ${errors.zipCode ? 'input-error' : ''}`} />
                </FormField>
              </div>
              <FormField label="Label *" error={errors.label?.message}>
                <input {...register('label')} placeholder="Home / Office / Work" className={`input ${errors.label ? 'input-error' : ''}`} />
              </FormField>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : <span className="flex items-center gap-2"><Save size={16} /> {editId ? 'Update' : 'Add'} Address</span>}
                </button>
                <button type="button" onClick={closeForm} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : addresses.length === 0 ? (
        <EmptyState icon={MapPin} title="No addresses yet" description="Add a delivery address to get started" action={{ label: 'Add Address', onClick: openAdd }} />
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
          {addresses.map((addr) => (
            <motion.div key={addr.id} variants={staggerItem} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-primary-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">{addr.label}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{addr.addressLine}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{addr.city}, {addr.state} - {addr.zipCode}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{addr.country}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(addr)} className="btn-icon btn-ghost text-primary-500">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => setDeleteId(addr.id)} className="btn-icon btn-ghost text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        confirmLabel="Delete"
        variant="danger"
      />
    </motion.div>
  )
}
