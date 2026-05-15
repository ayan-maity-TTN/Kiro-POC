import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { TrendingUp, Users, Package, Store } from 'lucide-react'
import adminService from '../../services/adminService'
import { pageTransition, staggerContainer, staggerItem, fadeInUp } from '../../animations/variants'
import StatsCard from '../../components/ui/StatsCard'
import Skeleton from '../../components/ui/Skeleton'

// Mock data for charts (will be replaced with real API data when available)
const salesData = [
  { month: 'Jan', sales: 4000, orders: 240 },
  { month: 'Feb', sales: 3000, orders: 198 },
  { month: 'Mar', sales: 5000, orders: 300 },
  { month: 'Apr', sales: 4500, orders: 270 },
  { month: 'May', sales: 6000, orders: 380 },
  { month: 'Jun', sales: 5500, orders: 340 },
  { month: 'Jul', sales: 7000, orders: 420 },
  { month: 'Aug', sales: 6500, orders: 390 },
  { month: 'Sep', sales: 8000, orders: 480 },
  { month: 'Oct', sales: 7500, orders: 450 },
  { month: 'Nov', sales: 9000, orders: 540 },
  { month: 'Dec', sales: 10000, orders: 600 },
]

const categoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Fashion', value: 25 },
  { name: 'Home', value: 20 },
  { name: 'Sports', value: 12 },
  { name: 'Others', value: 8 },
]

const COLORS = ['#2563eb', '#f97316', '#22c55e', '#a855f7', '#64748b']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-medium text-gray-900 dark:text-white mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

export default function AdminAnalytics() {
  const [stats, setStats] = useState({ customers: 0, sellers: 0, products: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminService.getCustomers({ page: 0, size: 1 }),
      adminService.getSellers({ page: 0, size: 1 }),
      adminService.getAllProducts({ page: 0, size: 1 }),
    ])
      .then(([cRes, sRes, pRes]) => {
        setStats({
          customers: (cRes.data || []).length,
          sellers: (sRes.data || []).length,
          products: (pRes.data || []).length,
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Analytics</h1>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div variants={staggerItem}><StatsCard title="Total Revenue" value="₹8.5L" icon={TrendingUp} color="primary" trend="+12%" /></motion.div>
          <motion.div variants={staggerItem}><StatsCard title="Customers" value={stats.customers + '+'} icon={Users} color="success" trend="+8%" /></motion.div>
          <motion.div variants={staggerItem}><StatsCard title="Sellers" value={stats.sellers + '+'} icon={Store} color="accent" trend="+5%" /></motion.div>
          <motion.div variants={staggerItem}><StatsCard title="Products" value={stats.products + '+'} icon={Package} color="warning" trend="+15%" /></motion.div>
        </motion.div>
      )}

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales Area Chart */}
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="lg:col-span-2 card p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Monthly Sales & Orders</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="sales" stroke="#2563eb" fill="url(#salesGrad)" strokeWidth={2} name="Sales (₹)" />
              <Area type="monotone" dataKey="orders" stroke="#f97316" fill="url(#ordersGrad)" strokeWidth={2} name="Orders" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Pie Chart */}
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="card p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(val) => `${val}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-gray-600 dark:text-gray-300">{cat.name}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{cat.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bar Chart */}
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="card p-5">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Monthly Order Volume</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="orders" fill="#2563eb" radius={[6, 6, 0, 0]} name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  )
}
