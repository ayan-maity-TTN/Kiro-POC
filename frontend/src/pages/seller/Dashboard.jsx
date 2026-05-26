import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  Package,
  Plus,
  ShoppingBag,
  TrendingUp,
  ArrowRight,
  Eye,
} from "lucide-react";
import { selectUser, updateUser } from "../../store/slices/authSlice";
import sellerService from "../../services/sellerService";
import {
  pageTransition,
  staggerContainer,
  staggerItem,
  fadeInUp,
} from "../../animations/variants";
import StatsCard from "../../components/ui/StatsCard";
import Skeleton from "../../components/ui/Skeleton";
import { formatCurrency } from "../../utils";

const quickActions = [
  {
    label: "Add Product",
    desc: "List a new product",
    to: "/seller/products/add",
    icon: Plus,
    color: "from-blue-500 to-blue-600",
  },
  {
    label: "My Products",
    desc: "Manage your listings",
    to: "/seller/products",
    icon: Package,
    color: "from-green-500 to-emerald-600",
  },
  {
    label: "Orders",
    desc: "View incoming orders",
    to: "/seller/orders",
    icon: ShoppingBag,
    color: "from-purple-500 to-violet-600",
  },
  {
    label: "Profile",
    desc: "Update seller info",
    to: "/seller/profile",
    icon: TrendingUp,
    color: "from-orange-500 to-amber-600",
  },
];

export default function SellerDashboard() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [products, setProducts] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [sellerName, setSellerName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      sellerService.getAllProducts({
        page: 0,
        size: 5,
        sort: "id",
        order: "desc",
      }),
      sellerService.getOrders({ page: 0, size: 1 }),
      sellerService.getProfile(),
    ])
      .then(([prodRes, ordersRes, profileRes]) => {
        setProducts(
          prodRes.status === "fulfilled" ? prodRes.value.data || [] : [],
        );
        setOrderCount(
          ordersRes.status === "fulfilled"
            ? (ordersRes.value.data || []).length
            : 0,
        );
        if (profileRes.status === "fulfilled" && profileRes.value.data) {
          const p = profileRes.value.data;
          setSellerName(p.firstName || p.companyName || "");
          dispatch(updateUser(p));
        }
      })
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
      {/* Welcome */}
      <motion.div
        variants={fadeInUp}
        className="rounded-2xl bg-gradient-to-r from-accent-500 to-accent-600 p-6 md:p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_50%,white,transparent)]" />
        <div className="relative">
          <p className="text-white/70 text-sm font-medium mb-1">
            Seller Dashboard
          </p>
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
            Welcome, {sellerName || user?.firstName || "Seller"}!
          </h1>
          <p className="text-white/80 text-sm mb-4">
            {user?.companyName || "Manage your store and products"}
          </p>
          <Link
            to="/seller/products/add"
            className="inline-flex items-center gap-2 bg-white text-accent-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            <Plus size={16} /> Add New Product
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <motion.div variants={staggerItem}>
          <StatsCard
            title="Total Products"
            value={products.length}
            icon={Package}
            color="primary"
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatsCard
            title="Active Products"
            value={products.filter((p) => p.isActive).length}
            icon={Eye}
            color="success"
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatsCard
            title="Orders"
            value={orderCount}
            icon={ShoppingBag}
            color="accent"
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatsCard
            title="Revenue"
            value="—"
            icon={TrendingUp}
            color="warning"
          />
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {quickActions.map((action, i) => (
            <motion.div key={i} variants={staggerItem}>
              <Link
                to={action.to}
                className="card p-5 flex items-center gap-4 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform`}
                >
                  <action.icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {action.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {action.desc}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0"
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Recent Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white">
            Recent Products
          </h2>
          <Link
            to="/seller/products"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="card p-8 text-center">
            <Package size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No products yet</p>
            <Link
              to="/seller/products/add"
              className="btn-primary btn-sm mt-3 inline-flex"
            >
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="font-medium text-gray-900 dark:text-white">
                        {p.name}
                      </td>
                      <td className="text-gray-500">{p.brand}</td>
                      <td>
                        <span
                          className={`badge ${p.isActive ? "badge-success" : "badge-danger"}`}
                        >
                          {p.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/seller/products/edit/${p.id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
