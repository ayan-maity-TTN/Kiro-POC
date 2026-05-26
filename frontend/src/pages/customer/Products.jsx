import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Star,
  Heart,
  ShoppingCart,
  X,
} from "lucide-react";
import customerService from "../../services/customerService";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import {
  toggleWishlist,
  selectIsWishlisted,
} from "../../store/slices/wishlistSlice";
import {
  pageTransition,
  staggerContainer,
  staggerItem,
} from "../../animations/variants";
import { formatCurrency, debounce } from "../../utils";
import { SORT_OPTIONS } from "../../constants";
import Skeleton from "../../components/ui/Skeleton";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";
import toast from "react-hot-toast";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const isWishlisted = useSelector(selectIsWishlisted(product.id));

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(
      addToCart({
        variationId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      }),
    );
    toast.success("Added to cart!");
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(
      toggleWishlist({
        variationId: product.id,
        name: product.name,
        price: product.price,
      }),
    );
    toast.success(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist!",
    );
  };

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={`/customer/product/${product.id}`}
        className="card block group overflow-hidden"
      >
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
          {product.primaryImageUrl?.[0] ? (
            <img
              src={product.primaryImageUrl[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
              <ShoppingCart size={40} />
            </div>
          )}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${isWishlisted ? "bg-red-500 text-white" : "bg-white dark:bg-gray-800 text-gray-400 hover:text-red-500"}`}
          >
            <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          {!product.isActive && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="badge badge-danger">Unavailable</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 truncate">
            {product.brand}
          </p>
          <h3 className="font-medium text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 mb-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={12}
                className={
                  s <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }
              />
            ))}
            <span className="text-xs text-gray-400 ml-1">(4.0)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-900 dark:text-white">
              {formatCurrency(product.price || 0)}
            </span>
            <button
              onClick={handleAddToCart}
              className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors shadow-sm"
            >
              <ShoppingCart size={15} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CustomerProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [sort, setSort] = useState("id-asc");
  const [categoryId, setCategoryId] = useState(
    searchParams.get("categoryId") || "",
  );
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = useCallback(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const [sortField, sortOrder] = sort.split("-");
    customerService
      .getProducts({
        page,
        size: 12,
        sort: sortField,
        order: sortOrder,
        query: search || undefined,
        categoryId,
      })
      .then((res) => setProducts(res.data || []))
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  }, [page, search, sort, categoryId]);

  useEffect(() => {
    customerService
      .getCategories()
      .then((res) => {
        const cats = res.data || [];
        setCategories(cats);
        if (!categoryId && cats.length > 0) setCategoryId(cats[0].id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const debouncedSearch = useCallback(
    debounce((val) => {
      setSearch(val);
      setPage(0);
    }, 400),
    [],
  );

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-5"
    >
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
          Products
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              defaultValue={search}
              onChange={(e) => debouncedSearch(e.target.value)}
              placeholder="Search products..."
              className="input pl-9"
            />
          </div>
          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(0);
              }}
              className="input pr-8 appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary btn-icon"
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategoryId(cat.id);
                setPage(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${categoryId == cat.id ? "bg-primary-600 text-white shadow-sm" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <Skeleton className="aspect-square" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No products found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </motion.div>
      )}

      {products.length > 0 && (
        <Pagination
          page={page}
          onPageChange={setPage}
          hasNext={products.length === 12}
        />
      )}
    </motion.div>
  );
}
