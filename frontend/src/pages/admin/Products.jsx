import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Search, Eye, ToggleLeft, ToggleRight, Package } from 'lucide-react'
import adminService from '../../services/adminService'
import { pageTransition, staggerContainer, staggerItem } from '../../animations/variants'
import { debounce } from '../../utils'
import Skeleton from '../../components/ui/Skeleton'
import Pagination from '../../components/ui/Pagination'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [filter, setFilter] = useState('')
  const [confirmAction, setConfirmAction] = useState(null)

  const fetchProducts = useCallback(() => {
    setLoading(true)
    adminService.getAllProducts({ page, size: 10, sort: 'id', order: 'desc', filter: filter || undefined })
      .then((res) => setProducts(res.data || []))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }, [page, filter])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const debouncedSearch = useCallback(debounce((val) => { setFilter(val); setPage(0) }, 400), [])

  const handleToggleStatus = async () => {
    const { id, isActive } = confirmAction
    try {
      await adminService.changeProductStatus(id, !isActive)
      toast.success(`Product ${!isActive ? 'activated' : 'deactivated'}`)
      setConfirmAction(null)
      fetchProducts()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    }
  }

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Products</h1>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input defaultValue={filter} onChange={(e) => debouncedSearch(e.target.value)} placeholder="Search products..." className="input pl-9" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : products.length === 0 ? (
        <EmptyState icon={Package} title="No products found" description="No products match your search" />
      ) : (
        <>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="card overflow-hidden">
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Seller</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <motion.tr key={p.id} variants={staggerItem}>
                      <td>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{p.name}</p>
                          {p.description && <p className="text-xs text-gray-400 truncate max-w-xs">{p.description}</p>}
                        </div>
                      </td>
                      <td className="text-gray-500">{p.brand}</td>
                      <td className="text-gray-500">{p.categoryName || '—'}</td>
                      <td className="text-gray-500">{p.sellerCompanyName || '—'}</td>
                      <td>
                        <Badge variant={p.isActive ? 'success' : 'danger'}>{p.isActive ? 'Active' : 'Inactive'}</Badge>
                      </td>
                      <td>
                        <button
                          onClick={() => setConfirmAction({ id: p.id, isActive: p.isActive, name: p.name })}
                          className={`btn-sm btn gap-1 ${p.isActive ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950' : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-950'}`}>
                          {p.isActive ? <><ToggleRight size={14} /> Deactivate</> : <><ToggleLeft size={14} /> Activate</>}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
          <Pagination page={page} onPageChange={setPage} hasNext={products.length === 10} />
        </>
      )}

      <ConfirmDialog
        open={!!confirmAction}
        title={`${confirmAction?.isActive ? 'Deactivate' : 'Activate'} Product`}
        message={`Are you sure you want to ${confirmAction?.isActive ? 'deactivate' : 'activate'} "${confirmAction?.name}"?`}
        onConfirm={handleToggleStatus}
        onCancel={() => setConfirmAction(null)}
        confirmLabel={confirmAction?.isActive ? 'Deactivate' : 'Activate'}
        variant={confirmAction?.isActive ? 'danger' : 'primary'}
      />
    </motion.div>
  )
}
