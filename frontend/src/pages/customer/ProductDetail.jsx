import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ShoppingCart,
  Heart,
  Star,
  Package,
  RefreshCw,
  Shield,
  Truck,
  Send,
} from "lucide-react";
import customerService from "../../services/customerService";
import {
  pageTransition,
  fadeInUp,
  staggerContainer,
  staggerItem,
} from "../../animations/variants";
import { formatCurrency } from "../../utils";
import Skeleton from "../../components/ui/Skeleton";
import Breadcrumb from "../../components/ui/Breadcrumb";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Review form
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      customerService.getProduct(id),
      customerService.getSimilarProducts({ productId: id, page: 0, size: 6 }),
      customerService.getProductReviews(id).catch(() => ({ data: [] })),
      customerService.getWishlist().catch(() => ({ data: [] })),
    ])
      .then(([productRes, similarRes, reviewsRes, wishlistRes]) => {
        const p = productRes.data;
        setProduct(p);
        if (p?.variations?.length > 0) setSelectedVariation(p.variations[0]);
        setSimilar(similarRes.data || []);
        setReviews(reviewsRes.data || []);
        const wishlist = wishlistRes.data || [];
        if (p?.variations?.length > 0) {
          setIsWishlisted(
            wishlist.some((w) => w.variationId === p.variations[0].id),
          );
        }
      })
      .catch(() => toast.error("Failed to load product"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedVariation) return;
    setCartLoading(true);
    try {
      await customerService.addToCart({
        productVariationId: selectedVariation.id,
        quantity: 1,
      });
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  const handleWishlist = async () => {
    if (!selectedVariation) return;
    setWishlistLoading(true);
    try {
      await customerService.toggleWishlist(selectedVariation.id);
      setIsWishlisted((prev) => !prev);
      toast.success(
        isWishlisted ? "Removed from wishlist" : "Added to wishlist!",
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      await customerService.addReview({
        productId: Number(id),
        review: reviewText,
        rating: reviewRating,
      });
      toast.success("Review submitted!");
      setReviewText("");
      setReviewRating(5);
      const res = await customerService.getProductReviews(id);
      setReviews(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading)
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-20 text-gray-500">Product not found</div>
    );

  const variations = product.variations || [];
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((s, r) => s + Number(r.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : null;

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
      <Breadcrumb
        items={[
          { label: "Products", to: "/customer/products" },
          { label: product.name },
        ]}
      />

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square"
        >
          {selectedVariation?.primaryImageUrl ? (
            <img
              src={selectedVariation.primaryImageUrl}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Package size={80} />
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div variants={fadeInUp} className="space-y-5">
          <div>
            <p className="text-sm text-gray-400 mb-1">{product.brand}</p>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>
            {avgRating && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={
                        s <= Math.round(Number(avgRating))
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {avgRating} ({reviews.length} reviews)
                </span>
              </div>
            )}
          </div>

          {selectedVariation && (
            <div className="text-3xl font-display font-bold text-gray-900 dark:text-white">
              {formatCurrency(selectedVariation.price || 0)}
            </div>
          )}

          {product.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Variations */}
          {variations.length > 1 && (
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Variant
              </p>
              <div className="flex flex-wrap gap-2">
                {variations.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariation(v)}
                    className={`px-3 py-1.5 rounded-xl text-sm border-2 transition-all ${
                      selectedVariation?.id === v.id
                        ? "border-primary-600 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-300"
                    }`}
                  >
                    {v.metaData
                      ? Object.values(v.metaData).join(" / ")
                      : `Variant ${v.id}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          {selectedVariation && (
            <p
              className={`text-sm font-medium ${selectedVariation.quantityAvailable > 0 ? "text-green-600" : "text-red-500"}`}
            >
              {selectedVariation.quantityAvailable > 0
                ? `In Stock (${selectedVariation.quantityAvailable} left)`
                : "Out of Stock"}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={
                cartLoading ||
                !selectedVariation ||
                selectedVariation?.quantityAvailable === 0
              }
              className="btn-primary btn-lg flex-1 disabled:opacity-50"
            >
              {cartLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ShoppingCart size={18} />
              )}
              Add to Cart
            </button>
            <button
              onClick={handleWishlist}
              disabled={wishlistLoading}
              className={`btn btn-lg px-4 border-2 transition-all disabled:opacity-50 ${
                isWishlisted
                  ? "border-red-500 bg-red-50 dark:bg-red-950 text-red-500"
                  : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-300"
              }`}
            >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { icon: Truck, text: "Free Delivery" },
              { icon: Shield, text: "Secure Payment" },
              {
                icon: RefreshCw,
                text: product.isReturnable ? "Returnable" : "Non-Returnable",
              },
              {
                icon: Package,
                text: product.isCancellable ? "Cancellable" : "Non-Cancellable",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
              >
                <f.icon size={15} className="text-primary-500 flex-shrink-0" />
                {f.text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
          Reviews{" "}
          {reviews.length > 0 && (
            <span className="text-gray-400 font-normal text-base">
              ({reviews.length})
            </span>
          )}
        </h2>

        {/* Write Review */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">
            Write a Review
          </h3>
          <form onSubmit={handleSubmitReview} className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setReviewRating(s)}
                  >
                    <Star
                      size={20}
                      className={
                        s <= reviewRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 hover:text-yellow-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={3}
              className="input w-full resize-none"
            />
            <button
              type="submit"
              disabled={reviewLoading}
              className="btn-primary btn-sm"
            >
              {reviewLoading ? (
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={14} />
              )}
              Submit Review
            </button>
          </form>
        </div>

        {/* Review List */}
        {reviews.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {reviews.map((r, i) => (
              <motion.div key={i} variants={staggerItem} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-sm flex-shrink-0">
                      {r.customerName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {r.customerName}
                      </p>
                      <div className="flex gap-0.5 mt-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={11}
                            className={
                              s <= Number(r.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {r.review && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 ml-12">
                    {r.review}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-gray-400 text-sm text-center py-6">
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>

      {/* Similar Products */}
      {similar.length > 0 && (
        <div>
          <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Similar Products
          </h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
          >
            {similar.map((p) => (
              <motion.div key={p.id} variants={staggerItem}>
                <Link
                  to={`/customer/product/${p.id}`}
                  className="card block hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800">
                    {p.primaryImageUrl?.[0] ? (
                      <img
                        src={p.primaryImageUrl[0]}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Package size={24} />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-2">
                      {p.name}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
