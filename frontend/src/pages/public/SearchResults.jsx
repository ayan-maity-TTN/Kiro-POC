import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Search } from "lucide-react";
import publicService from "../../services/publicService";
import { formatCurrency } from "../../utils";
import {
  pageTransition,
  staggerContainer,
  staggerItem,
} from "../../animations/variants";
import Skeleton from "../../components/ui/Skeleton";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      publicService
        .searchProducts(query)
        .then((res) => setProducts(res.data || []))
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    }
  }, [query]);

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="page-container py-8"
    >
      <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
        Search results for "{query}"
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {loading ? "Searching..." : `${products.length} product(s) found`}
      </p>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={staggerItem}>
              <Link
                to={`/product?productId=${product.id}`}
                className="card p-3 block group h-full"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3">
                  {product.primaryImageUrl &&
                  product.primaryImageUrl.length > 0 ? (
                    <img
                      src={product.primaryImageUrl[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ShoppingBag size={32} />
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate capitalize">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {product.brand}
                </p>
                {product.price > 0 && (
                  <p className="text-sm font-bold text-primary-600 mt-1">
                    {formatCurrency(product.price)}
                  </p>
                )}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            No products found
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Try a different search term
          </p>
          <Link
            to="/"
            className="inline-block mt-6 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      )}
    </motion.div>
  );
}
