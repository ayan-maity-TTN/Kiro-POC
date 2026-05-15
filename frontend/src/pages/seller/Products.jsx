import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Plus, Search, Edit2, Trash2, Layers, Eye, EyeOff } from 'lucide-react'
import sellerService from '../../services/sellerService'
import { pageTransition, staggerContainer, staggerItem } from '../../animations/variants'
import { debounce } from '../../utils'
import { SORT_OPTIONS } from '../../constants'
import Skeleton from '../../components/ui/Skeleton'
import Pagination from '../../components/ui/Pagination'
import EmptyState from '../../components/ui/EmptyState'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Badge from '../../components/ui/Badge'

export default function SellerProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('name-asc')
  const [deleteId, setDeleteId] = useState(null)

  const fetchProducts = useCallback(() => {
    setLoading(true)
    const [sortField, sortOrder] = sort.split('-')
    sellerService.getAllProducts({ page, size: 10, sort: sortField, order: sortOrder, query: search || undefined })
      .then((res) => setProducts(res.data || []))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }, [page, search, sort])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const debouncedSearch = useCallback(debounce((val) => { setSearch(val); setPage(0) }, 400), [])

  const handleDelete = async () => {
    try {
      await sellerService.deleteProduct(deleteId)
      toast.success('Product deleted')
      setDeleteId(null)
      fetchProducts()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">My Products</h1>
        <Link to="/seller/products/add" className="btn-primary btn-sm">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input defaultValue={search} onChange={(e) => debouncedSearch(e.target.value)} placeholder="Search products..." className="input pl-9" />
        </div>
        <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(0) }} className="input w-auto">
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : products.length === 0 ? (
        <EmptyState icon={Plus} title="No products yet" description="Add your first product to start selling"
          action={{ label: 'Add Product', to: '/seller/products/add' }} />
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
                      <td>
                        <Badge variant={p.isActive ? 'success' : 'danger'}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Link to={`/seller/products/${p.id}/variations`} className="btn-icon btn-ghost text-purple-500" title="Variations">
                            <Layers size={15} />
                          </Link>
                          <Link to={`/seller/products/edit/${p.id}`} className="btn-icon btn-ghost text-primary-500" title="Edit">
                            <Edit2 size={15} />
                          </Link>
                          <button onClick={() => setDeleteId(p.id)} className="btn-icon btn-ghost text-red-500" title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
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
        open={!!deleteId}
        title="Delete Product"
        message="Are you sure you want to delete this product? All variations will also be deleted."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        confirmLabel="Delete"
        variant="danger"
      />
    </motion.div>
  )
}
