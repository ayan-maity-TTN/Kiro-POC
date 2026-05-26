import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import {
  ShoppingBag,
  Shield,
  Truck,
  RefreshCw,
  Star,
  ArrowRight,
  Zap,
  Award,
  Users,
} from "lucide-react";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  pageTransition,
  scaleIn,
} from "../../animations/variants";

const heroSlides = [
  {
    title: "Discover Amazing Products",
    subtitle: "Shop the latest trends with unbeatable prices and fast delivery",
    cta: "Shop Now",
    bg: "from-primary-700 via-primary-600 to-accent-600",
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
  },
  {
    title: "New Season Arrivals",
    subtitle: "Explore thousands of products from top sellers across India",
    cta: "Explore",
    bg: "from-purple-700 via-primary-600 to-primary-500",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
  },
  {
    title: "Exclusive Deals Today",
    subtitle: "Limited time offers on electronics, fashion, and more",
    cta: "View Deals",
    bg: "from-accent-600 via-orange-500 to-primary-600",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
  },
];

const categories = [
  { name: "Electronics", icon: "💻", color: "from-blue-500 to-blue-600" },
  { name: "Fashion", icon: "👗", color: "from-pink-500 to-rose-500" },
  { name: "Home & Living", icon: "🏠", color: "from-green-500 to-emerald-500" },
  { name: "Sports", icon: "⚽", color: "from-orange-500 to-amber-500" },
  { name: "Books", icon: "📚", color: "from-purple-500 to-violet-500" },
  { name: "Beauty", icon: "💄", color: "from-red-500 to-pink-500" },
  { name: "Toys", icon: "🧸", color: "from-yellow-500 to-orange-400" },
  { name: "Grocery", icon: "🛒", color: "from-teal-500 to-cyan-500" },
];

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    desc: "On orders above ₹499",
    color: "text-blue-500",
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
    color: "text-purple-500",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Regular Customer",
    text: "Amazing shopping experience! Fast delivery and great quality products.",
    rating: 5,
    avatar: "PS",
  },
  {
    name: "Rahul Verma",
    role: "Verified Buyer",
    text: "Best prices in the market. The seller support is excellent too.",
    rating: 5,
    avatar: "RV",
  },
  {
    name: "Anita Singh",
    role: "Premium Member",
    text: "Love the variety of products. Easy returns make shopping stress-free.",
    rating: 4,
    avatar: "AS",
  },
];

const stats = [
  { icon: Users, value: "10L+", label: "Happy Customers" },
  { icon: ShoppingBag, value: "50K+", label: "Products Listed" },
  { icon: Award, value: "5K+", label: "Verified Sellers" },
  { icon: Zap, value: "99.9%", label: "Uptime" },
];

export default function Home() {
  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Hero Swiper */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="h-[480px] md:h-[560px]"
        >
          {heroSlides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div
                className={`relative h-full bg-gradient-to-r ${slide.bg} flex items-center overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-20">
                  <img
                    src={slide.img}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="relative page-container w-full px-16 md:px-20">
                  <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-xl text-white"
                  >
                    <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-lg text-white/80 mb-8">
                      {slide.subtitle}
                    </p>
                    <div className="flex gap-4">
                      <Link
                        to="/register/customer"
                        className="btn bg-white text-primary-700 hover:bg-gray-100 btn-lg font-semibold shadow-lg"
                      >
                        {slide.cta} <ArrowRight size={18} />
                      </Link>
                      <Link
                        to="/about"
                        className="btn border-2 border-white text-white hover:bg-white/10 btn-lg"
                      >
                        Learn More
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Features Bar */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="page-container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-center gap-3 p-3"
              >
                <div
                  className={`p-2 rounded-xl bg-gray-50 dark:bg-gray-800 ${f.color}`}
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section bg-gray-50 dark:bg-gray-950">
        <div className="page-container">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              Shop by Category
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Find exactly what you're looking for
            </p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-4 md:grid-cols-8 gap-4"
          >
            {categories.map((cat, i) => (
              <motion.div key={i} variants={staggerItem}>
                <Link
                  to="/register/customer"
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-gray-900 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}
                  >
                    {cat.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
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

      {/* Testimonials */}
      <section className="section bg-white dark:bg-gray-900">
        <div className="page-container">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              What Our Customers Say
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Trusted by millions across India
            </p>
          </motion.div>
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-10"
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i}>
                <div className="card p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center text-white font-bold text-sm">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    "{t.text}"
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
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
