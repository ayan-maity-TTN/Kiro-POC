import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  ShoppingBag,
  Shield,
  Truck,
  RefreshCw,
  ArrowRight,
  Award,
  Users,
  Zap,
} from "lucide-react";
import {
  staggerContainer,
  staggerItem,
  pageTransition,
  scaleIn,
} from "../../animations/variants";
import publicService from "../../services/publicService";
import { formatCurrency } from "../../utils";
import Skeleton from "../../components/ui/Skeleton";

const heroSlides = [
  {
    title: "Starting \u20B9199",
    subtitle: "Deals on Fashion & Beauty",
    bg: "#e8f5e9",
    textColor: "text-gray-900",
    img: "/banners/fashion.svg",
  },
  {
    title: "Up to 70% Off",
    subtitle: "Electronics & Gadgets Sale",
    bg: "#fce4ec",
    textColor: "text-gray-900",
    img: "/banners/electronics.svg",
  },
  {
    title: "Under \u20B9399",
    subtitle: "Shop T-Shirts & Polos",
    bg: "#e3f2fd",
    textColor: "text-gray-900",
    img: "/banners/tshirts.svg",
  },
];

const promoSections = [
  {
    title: "Best Sellers in Home & Kitchen",
    items: [
      {
        name: "Tissue Rolls",
        img: "https://picsum.photos/seed/tissue/200/200",
      },
      { name: "Garbage Bags", img: "https://picsum.photos/seed/bags/200/200" },
      {
        name: "Water Bottle",
        img: "https://picsum.photos/seed/bottle/200/200",
      },
      {
        name: "Soap Dispenser",
        img: "https://picsum.photos/seed/soap/200/200",
      },
    ],
    link: "/products",
    linkText: "Explore more",
  },
  {
    title: "Customers' Most-Loved Products",
    items: [
      { name: "Candle Set", img: "https://picsum.photos/seed/candle/200/200" },
      { name: "Decor Tray", img: "https://picsum.photos/seed/tray/200/200" },
      { name: "Flower Pot", img: "https://picsum.photos/seed/flower/200/200" },
      {
        name: "Smart Speaker",
        img: "https://picsum.photos/seed/speaker/200/200",
      },
    ],
    link: "/products",
    linkText: "Explore more",
  },
  {
    title: "Essentials for Your Home",
    items: [
      { name: "Bedsheets", img: "https://picsum.photos/seed/bed/200/200" },
      { name: "Curtains", img: "https://picsum.photos/seed/curtain/200/200" },
      { name: "Pillows", img: "https://picsum.photos/seed/pillow/200/200" },
      { name: "Towels", img: "https://picsum.photos/seed/towel/200/200" },
    ],
    link: "/products",
    linkText: "See more",
  },
  {
    title: "Up to 80% Off | Latest Collections",
    items: [
      { name: "Coasters", img: "https://picsum.photos/seed/coaster/200/200" },
      { name: "Wall Art", img: "https://picsum.photos/seed/wallart/200/200" },
      { name: "Vases", img: "https://picsum.photos/seed/vase/200/200" },
      { name: "Perfume", img: "https://picsum.photos/seed/perfume/200/200" },
    ],
    link: "/products",
    linkText: "See all deals",
  },
];

const horizontalPromo = {
  title: "Min. 30% off | Upgrade your home with products from Small Businesses",
  items: [
    {
      name: "Bluetooth Speaker",
      img: "https://picsum.photos/seed/btspeaker/300/200",
    },
    { name: "Panda Lamp", img: "https://picsum.photos/seed/panda/300/200" },
    { name: "Crystal Globe", img: "https://picsum.photos/seed/globe/300/200" },
    { name: "Figurines", img: "https://picsum.photos/seed/figurine/300/200" },
    { name: "Skull Decor", img: "https://picsum.photos/seed/skull/300/200" },
    {
      name: "Vintage Camera",
      img: "https://picsum.photos/seed/camera/300/200",
    },
  ],
};

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    desc: "On orders above \u20B9499",
    color: "text-purple-500",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    desc: "100% secure transactions",
    color: "text-green-500",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    desc: "7-day hassle-free returns",
    color: "text-orange-500",
  },
  {
    icon: Award,
    title: "Quality Assured",
    desc: "Verified sellers only",
    color: "text-primary-500",
  },
];

const stats = [
  { icon: Users, value: "10L+", label: "Happy Customers" },
  { icon: ShoppingBag, value: "50K+", label: "Products Listed" },
  { icon: Award, value: "5K+", label: "Verified Sellers" },
  { icon: Zap, value: "99.9%", label: "Uptime" },
];

export default function Home() {
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    publicService
      .getHomepageProducts()
      .then((res) => setCategoryProducts(res.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Hero Banner + Product Cards wrapped in seamless background */}
      <div
        className="transition-all duration-700 ease-in-out"
        style={{
          background: `linear-gradient(to bottom, ${heroSlides[activeSlide].bg} 0%, ${heroSlides[activeSlide].bg} 35%, #f3f4f6 75%, #f3f4f6 100%)`,
        }}
      >
        <section className="relative" style={{ background: "transparent" }}>
          <Swiper
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            navigation
            loop
            speed={600}
            onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
            className="h-[220px] sm:h-[280px] md:h-[350px] lg:h-[400px]"
            style={{ background: "transparent" }}
          >
            {heroSlides.map((slide, i) => (
              <SwiperSlide key={i} style={{ background: "transparent" }}>
                <div className="h-full w-full flex items-center justify-between px-8 sm:px-12 md:px-16 lg:px-24">
                  <div className={slide.textColor}>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold italic">
                      {slide.title}
                    </h2>
                    <p className="text-lg sm:text-xl md:text-2xl font-medium mt-2 opacity-90">
                      {slide.subtitle}
                    </p>
                  </div>
                  <div className="hidden sm:block w-[280px] md:w-[360px] lg:w-[420px] h-[180px] md:h-[260px] lg:h-[320px] overflow-hidden mix-blend-multiply">
                    <img
                      src={slide.img}
                      alt={slide.subtitle}
                      className="w-full h-full object-contain mix-blend-multiply"
                      loading="lazy"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Product Cards by Category */}
        <section className="relative z-20 pb-8">
          <div className="page-container pt-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-80 rounded-2xl" />
                ))}
              </div>
            ) : Object.keys(categoryProducts).length > 0 ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {Object.entries(categoryProducts).map(
                  ([categoryName, products]) => (
                    <motion.div key={categoryName} variants={staggerItem}>
                      <div className="card p-5 h-full">
                        <h3 className="font-display font-bold text-gray-900 dark:text-white text-base mb-1 capitalize">
                          {categoryName}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                          {products.length} products available
                        </p>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {products.slice(0, 4).map((product) => (
                            <Link
                              to={`/product?productId=${product.id}`}
                              key={product.id}
                              className="group"
                            >
                              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-1.5">
                                {product.primaryImageUrl &&
                                product.primaryImageUrl.length > 0 ? (
                                  <img
                                    src={product.primaryImageUrl[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <ShoppingBag size={24} />
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-gray-700 dark:text-gray-300 truncate capitalize">
                                {product.name}
                              </p>
                              {product.price > 0 && (
                                <p className="text-xs font-semibold text-primary-600">
                                  {formatCurrency(product.price)}
                                </p>
                              )}
                            </Link>
                          ))}
                        </div>
                        <Link
                          to={`/products?categoryId=${products[0]?.category?.id}`}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
                        >
                          See all deals
                        </Link>
                      </div>
                    </motion.div>
                  ),
                )}
              </motion.div>
            ) : (
              <div className="text-center py-16">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  No products yet
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Products will appear here once sellers add them
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Promotional Grid Sections - Amazon style */}
      <section className="bg-[#f3f4f6] dark:bg-gray-950 py-6">
        <div className="page-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {promoSections.map((section, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 rounded-sm p-5 shadow-sm"
              >
                <h3 className="font-bold text-gray-900 dark:text-white text-base mb-4">
                  {section.title}
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {section.items.map((item, i) => (
                    <Link to={section.link} key={i} className="group">
                      <div className="aspect-square rounded overflow-hidden bg-gray-100 dark:bg-gray-800 mb-1.5">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {item.name}
                      </p>
                    </Link>
                  ))}
                </div>
                <Link
                  to={section.link}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {section.linkText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Horizontal Promo Strip */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 py-5">
        <div className="page-container">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
              {horizontalPromo.title}
            </h3>
            <Link
              to="/products"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium whitespace-nowrap"
            >
              See more
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {horizontalPromo.items.map((item, i) => (
              <Link to="/products" key={i} className="flex-shrink-0 w-44 group">
                <div className="w-44 h-32 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Horizontal Product Strip per Category */}
      {!loading &&
        Object.entries(categoryProducts).map(
          ([categoryName, products]) =>
            products.length > 4 && (
              <section
                key={categoryName}
                className="py-6 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 mb-4"
              >
                <div className="page-container">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg capitalize">
                      {categoryName}
                    </h3>
                    <Link
                      to={`/products?categoryId=${products[0]?.category?.id}`}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      See more
                    </Link>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                    {products.map((product) => (
                      <Link
                        to={`/product?productId=${product.id}`}
                        key={product.id}
                        className="flex-shrink-0 w-40 group"
                      >
                        <div className="w-40 h-40 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-2">
                          {product.primaryImageUrl &&
                          product.primaryImageUrl.length > 0 ? (
                            <img
                              src={product.primaryImageUrl[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <ShoppingBag size={24} />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200 truncate capitalize">
                          {product.name}
                        </p>
                        {product.price > 0 && (
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatCurrency(product.price)}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            ),
        )}

      {/* Features Bar */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="page-container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div
                  className={`p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 ${f.color}`}
                >
                  <f.icon size={22} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">
                    {f.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section hero-gradient">
        <div className="page-container">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center"
          >
            {stats.map((s, i) => (
              <motion.div key={i} variants={staggerItem}>
                <s.icon size={32} className="mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-display font-bold">{s.value}</div>
                <div className="text-white/70 text-sm mt-1">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section bg-gray-50 dark:bg-gray-950">
        <div className="page-container">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-3xl hero-gradient p-10 md:p-16 text-center text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white,transparent)]" />
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 relative">
              Ready to Start Shopping?
            </h2>
            <p className="text-white/80 text-lg mb-8 relative">
              Join millions of happy customers. Register today and get exclusive
              deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
              <Link
                to="/register/customer"
                className="btn bg-white text-primary-700 hover:bg-gray-100 btn-lg font-semibold shadow-lg"
              >
                Register as Customer <ArrowRight size={18} />
              </Link>
              <Link
                to="/register/seller"
                className="btn border-2 border-white text-white hover:bg-white/10 btn-lg"
              >
                Become a Seller
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
