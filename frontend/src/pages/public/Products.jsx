import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ShoppingBag, Star } from "lucide-react";
import publicService from "../../services/publicService";
import {
  pageTransition,
  staggerContainer,
  staggerItem,
} from "../../animations/variants";
import { formatCurrency } from "../../utils";
import Skeleton from "../../components/ui/Skeleton";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";

export default function PublicProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = { page, size: 20 };
    if (categoryId) params.categoryId = categoryId;
    if (search) params.filter = search;
    publicService
      .getProducts(params)
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [categoryId, page, search]);

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="page-container py-8 space-y-6"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
          Products
        </h1>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={staggerItem}>
              <Link
                to={`/product?productId=${product.id}`}
                className="card block hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-square bg-gray-100 dark:bg-gray-800">
                  {product.primaryImageUrl?.[0] ? (
                    <img
                      src={product.primaryImageUrl[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ShoppingBag size={32} />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 capitalize">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
                  {product.price > 0 && (
                    <p className="text-sm font-bold text-primary-600 mt-1">
                      {formatCurrency(product.price)}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="No products found"
          description="Try a different search or category"
        />
      )}

      {products.length >= 20 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={10}
            onPageChange={setPage}
          />
        </div>
      )}
    </motion.div>
  );
}
