import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Search, UserCheck, UserX, Users } from 'lucide-react'
import adminService from '../../services/adminService'
import { pageTransition, staggerContainer, staggerItem } from '../../animations/variants'
import { debounce } from '../../utils'
import Skeleton from '../../components/ui/Skeleton'
import Pagination from '../../components/ui/Pagination'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [email, setEmail] = useState('')
  const [confirmAction, setConfirmAction] = useState(null) // { id, action: 'activate'|'deactivate', name }

  const fetchCustomers = useCallback(() => {
    setLoading(true)
    adminService.getCustomers({ page, size: 10, sort: 'id', email: email || undefined })
      .then((res) => setCustomers(res.data || []))
      .catch(() => toast.error('Failed to load customers'))
      .finally(() => setLoading(false))
  }, [page, email])

  useEffect(() => { fetchCustomers() }, [fetchCustomers])

  const debouncedSearch = useCallback(debounce((val) => { setEmail(val); setPage(0) }, 400), [])

  const handleConfirm = async () => {
    const { id, action } = confirmAction
    try {
      if (action === 'activate') await adminService.activateCustomer(id)
      else await adminService.deactivateCustomer(id)
      toast.success(`Customer ${action}d successfully`)
      setConfirmAction(null)
      fetchCustomers()
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} customer`)
    }
  }

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Customers</h1>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input defaultValue={email} onChange={(e) => debouncedSearch(e.target.value)} placeholder="Search by email..." className="input pl-9" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : customers.length === 0 ? (
        <EmptyState icon={Users} title="No customers found" description="No customers match your search" />
      ) : (
        <>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="card overflow-hidden">
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <motion.tr key={c.id} variants={staggerItem}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full hero-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {c.firstName?.[0]}{c.lastName?.[0]}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{c.firstName} {c.lastName}</span>
                        </div>
                      </td>
                      <td className="text-gray-500">{c.email}</td>
                      <td className="text-gray-500">{c.phoneNumber || '—'}</td>
                      <td>
                        <Badge variant={c.active ? 'success' : 'danger'}>{c.active ? 'Active' : 'Inactive'}</Badge>
                      </td>
                      <td>
                        {c.active ? (
                          <button onClick={() => setConfirmAction({ id: c.id, action: 'deactivate', name: `${c.firstName} ${c.lastName}` })}
                            className="btn-sm btn text-red-600 hover:bg-red-50 dark:hover:bg-red-950 gap-1">
                            <UserX size={14} /> Deactivate
                          </button>
                        ) : (
                          <button onClick={() => setConfirmAction({ id: c.id, action: 'activate', name: `${c.firstName} ${c.lastName}` })}
                            className="btn-sm btn text-green-600 hover:bg-green-50 dark:hover:bg-green-950 gap-1">
                            <UserCheck size={14} /> Activate
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
          <Pagination page={page} onPageChange={setPage} hasNext={customers.length === 10} />
        </>
      )}

      <ConfirmDialog
        open={!!confirmAction}
        title={`${confirmAction?.action === 'activate' ? 'Activate' : 'Deactivate'} Customer`}
        message={`Are you sure you want to ${confirmAction?.action} ${confirmAction?.name}?`}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
        confirmLabel={confirmAction?.action === 'activate' ? 'Activate' : 'Deactivate'}
        variant={confirmAction?.action === 'activate' ? 'primary' : 'danger'}
      />
    </motion.div>
  )
}
