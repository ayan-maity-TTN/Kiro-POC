import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  LogIn,
  ShoppingBag,
  ShieldCheck,
  User,
} from "lucide-react";
import { loginSchema } from "../../utils/validators";
import { setCredentials } from "../../store/slices/authSlice";
import authService from "../../services/authService";
import { fadeInUp, pageTransition } from "../../animations/variants";
import FormField from "../../components/ui/FormField";

const tabVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState("user"); // 'user' | 'admin'
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const switchTab = (next) => {
    if (next === tab) return;
    setTab(next);
    setShowPw(false);
    reset();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.login(data.email, data.password);
      const role = res.data?.message?.toUpperCase() || "CUSTOMER";

      dispatch(setCredentials({ user: { email: data.email }, role }));

      if (role === "ADMIN") {
        toast.success("Welcome, Admin!");
        navigate("/admin/dashboard");
      } else if (role === "SELLER") {
        toast.success("Welcome back!");
        navigate("/seller/dashboard");
      } else {
        toast.success("Welcome back!");
        navigate("/customer/dashboard");
      }
    } catch (err) {
      const d = err.response?.data;
      const msg =
        d?.message ||
        (Array.isArray(d?.errors) && d.errors[0]) ||
        err.message ||
        "Invalid credentials";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = tab === "admin";

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4"
    >
      <div className="w-full max-w-md">
        <motion.div variants={fadeInUp} className="card p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg transition-all duration-300 ${isAdmin ? "bg-gradient-to-br from-rose-500 to-rose-700" : "hero-gradient"}`}
            >
              {isAdmin ? <ShieldCheck size={28} /> : <ShoppingBag size={28} />}
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              {isAdmin ? "Admin Portal" : "Welcome back"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {isAdmin
                ? "Sign in to the admin dashboard"
                : "Sign in to your account"}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 mb-6 gap-1">
            <button
              type="button"
              onClick={() => switchTab("user")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === "user"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <User size={15} />
              User Login
            </button>
            <button
              type="button"
              onClick={() => switchTab("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === "admin"
                  ? "bg-white dark:bg-gray-700 text-rose-600 dark:text-rose-400 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <ShieldCheck size={15} />
              Admin Login
            </button>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={tab}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <FormField label="Email Address" error={errors.email?.message}>
                <input
                  {...register("email")}
                  type="email"
                  placeholder={
                    isAdmin ? "admin@example.com" : "you@example.com"
                  }
                  className={`input ${errors.email ? "input-error" : ""}`}
                  autoComplete="email"
                />
              </FormField>

              <FormField label="Password" error={errors.password?.message}>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPw ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`input pr-10 ${errors.password ? "input-error" : ""}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormField>

              {!isAdmin && (
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full btn-lg flex items-center justify-center gap-2 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-60 ${
                  isAdmin
                    ? "bg-rose-600 hover:bg-rose-700 active:bg-rose-800"
                    : "btn-primary"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {isAdmin ? <ShieldCheck size={18} /> : <LogIn size={18} />}
                    {isAdmin ? "Sign In as Admin" : "Sign In"}
                  </span>
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Register links — only for user tab */}
          {!isAdmin && (
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register/customer"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Register as Customer
                </Link>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Want to sell?{" "}
                <Link
                  to="/register/seller"
                  className="text-accent-600 hover:text-accent-700 font-medium"
                >
                  Register as Seller
                </Link>
              </p>
            </div>
          )}

          {/* Admin tab footer note */}
          {isAdmin && (
            <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
              Restricted access. Authorised personnel only.
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
