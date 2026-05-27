import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Store,
  Package,
  Tag,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import adminService from "../../services/adminService";
import {
  pageTransition,
  staggerContainer,
  staggerItem,
  fadeInUp,
} from "../../animations/variants";
import StatsCard from "../../components/ui/StatsCard";
import Skeleton from "../../components/ui/Skeleton";

const quickLinks = [
  {
    label: "Customers",
    to: "/admin/customers",
    icon: Users,
    color: "from-blue-500 to-blue-600",
  },
  {
    label: "Sellers",
    to: "/admin/sellers",
    icon: Store,
    color: "from-green-500 to-emerald-600",
  },
  {
    label: "Products",
    to: "/admin/products",
    icon: Package,
    color: "from-purple-500 to-violet-600",
  },
  {
    label: "Categories",
    to: "/admin/categories",
    icon: Tag,
    color: "from-orange-500 to-amber-600",
  },
  {
    label: "Metadata",
    to: "/admin/metadata",
    icon: ShieldCheck,
    color: "from-teal-500 to-cyan-600",
  },
  {
    label: "Analytics",
    to: "/admin/analytics",
    icon: TrendingUp,
    color: "from-pink-500 to-rose-600",
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    sellers: 0,
    products: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [recentSellers, setRecentSellers] = useState([]);

  useEffect(() => {
    Promise.all([
      adminService.getCustomers({ page: 0, size: 5, sort: "id" }),
      adminService.getSellers({ page: 0, size: 5, sort: "id" }),
      adminService.getAllProducts({ page: 0, size: 1 }),
      adminService.getAllCategories({ page: 0, size: 1 }),
    ])
      .then(([cRes, sRes, pRes, catRes]) => {
        setRecentCustomers(cRes.data || []);
        setRecentSellers(sRes.data || []);
        setStats({
          customers: (cRes.data || []).length,
          sellers: (sRes.data || []).length,
          products: (pRes.data || []).length,
          categories: (catRes.data || []).length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        className="rounded-2xl hero-gradient p-6 md:p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_50%,white,transparent)]" />
        <div className="relative">
          <p className="text-white/70 text-sm font-medium mb-1">Admin Panel</p>
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
            Platform Overview
          </h1>
          <p className="text-white/80 text-sm">
            Manage users, products, and platform settings
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <motion.div variants={staggerItem}>
            <StatsCard
              title="Customers"
              value={recentCustomers.length + "+"}
              icon={Users}
              color="primary"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <StatsCard
              title="Sellers"
              value={recentSellers.length + "+"}
              icon={Store}
              color="success"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <StatsCard
              title="Products"
              value="—"
              icon={Package}
              color="accent"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <StatsCard
              title="Categories"
              value="—"
              icon={Tag}
              color="warning"
            />
          </motion.div>
        </motion.div>
      )}

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-4">
          Management
        </h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {quickLinks.map((link, i) => (
            <motion.div key={i} variants={staggerItem}>
              <Link
                to={link.to}
                className="card p-5 flex items-center gap-4 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform`}
                >
                  <link.icon size={22} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {link.label}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Recent Users */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Customers */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Recent Customers
            </h2>
            <Link
              to="/admin/customers"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="card overflow-hidden">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10" />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentCustomers.slice(0, 5).map((c) => (
                  <div key={c.id} className="flex items-center gap-3 p-3">
                    <div className="w-8 h-8 rounded-full hero-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {c.firstName?.[0]}
                      {c.lastName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {c.firstName} {c.lastName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {c.email}
                      </p>
                    </div>
                    <span
                      className={`badge ${c.isActive ? "badge-success" : "badge-danger"} text-xs`}
                    >
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Sellers */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Recent Sellers
            </h2>
            <Link
              to="/admin/sellers"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="card overflow-hidden">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10" />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentSellers.slice(0, 5).map((s) => (
                  <div key={s.id} className="flex items-center gap-3 p-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {s.companyName?.[0] || "S"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {s.companyName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {s.email}
                      </p>
                    </div>
                    <span
                      className={`badge ${s.isActive ? "badge-success" : "badge-danger"} text-xs`}
                    >
                      {s.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
